'use strict';

const elasticsearch = require('elasticsearch');

const bb = require('bluebird');
const Joi = require('joi');
const waitForCluster = require('./wait-for-cluster');

const configSchema = Joi.object({
	connectionString: Joi.string().required().description('the elasticsearch server to connect to. Comma separate if you want to connect to several instances'),
});

class AtrixElasticsearch {
	constructor(atrix, service, config) {
		this.retries = {};
		this.atrix = atrix;
		this.service = service;
		this.log = this.service.log.child({ plugin: 'AtrixElasticsearch' });
		this.config = Joi.attempt(config, configSchema);
	}


	async start() {
		this.log.debug('start');

		await waitForCluster(this.getClient(), this.log);
		return {
			client: this.getClient(),
		};
	}

	getClient() {
		if (this.client) {
			return this.client;
		}
		this.client = new elasticsearch.Client({
			hosts: this.config.connectionString.split(','),
			defer: () => bb.defer(),
		});

		return this.client;
	}
}

module.exports = AtrixElasticsearch;
