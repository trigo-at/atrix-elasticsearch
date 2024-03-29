'use strict';

const {Client} = require('@elastic/elasticsearch');

const Joi = require('joi');
const fs = require('fs');
const path = require('path');

const waitForCluster = require('./wait-for-cluster');
const resetCluster = require('./reset-cluster');

const configSchema = Joi.object({
    connectionString: Joi.string()
        .required()
        .description(
            'the elasticsearch server to connect to. Comma separate if you want to connect to several instances'
        ),
    indexTemplateDir: Joi.string().description('path to the directory containing the index template definitions'),
    onStartup: Joi.func().description('function to run on startup'),
    auth: Joi.object({
        username: Joi.string().description('username used to authenticate'),
        password: Joi.string().description('password used to authenticate'),
        apiKey: Joi.string().description('apiKey used to authenticate'),
    })
        .description('authentication settings')
        .default({}),
});

class AtrixElasticsearch {
    constructor(atrix, service, config) {
        this.retries = {};
        this.atrix = atrix;
        this.service = service;
        this.log = this.service.log.child({plugin: 'AtrixElasticsearch'});
        this.config = Joi.attempt(config, configSchema);

        if (this.config.indexTemplateDir && !fs.existsSync(this.config.indexTemplateDir)) {
            throw new Error(`Invalid indexTemplateDir: "${this.config.indexTemplateDir}"`);
        }
    }

    async start() {
        this.log.debug('start');

        await waitForCluster(this.getClient(), this.log);
        await this.applyAllTemplates();

        const connection = {
            client: this.getClient(),
            resetCluster: () => resetCluster(this.getClient()),
            applyIndexTemplates: () => this.applyAllTemplates(),
        };

        if (this.config.onStartup) {
            this.log.info('Execute "onStartup" handler...');
            try {
                const asPromise = await Promise.resolve(this.config.onStartup);
                await asPromise(connection, this.service, this);
                this.log.info('Finished "onStartup" handler.');
            } catch (e) {
                this.log.error(e);
            }
        }

        return connection;
    }

    async applyAllTemplates() {
        if (!this.config.indexTemplateDir) {
            return;
        }
        fs.readdirSync(this.config.indexTemplateDir)
            .filter(file => file.indexOf('.js') === file.length - 3)
            .forEach(async file => {
                this.log.debug(`Found index template file: ${file}`);
                const templData = require(path.join(this.config.indexTemplateDir, file)); // eslint-disable-line
                const name = path.basename(file, '.js');
                const client = this.getClient();
                await client.indices.putTemplate({
                    name,
                    body: templData,
                });
            });
    }

    getClient() {
        if (this.client) {
            return this.client;
        }
        this.client = new Client({
            nodes: this.config.connectionString.split(','),
            auth: this.config.auth,
        });

        return this.client;
    }
}

module.exports = AtrixElasticsearch;
