'use strict';

const bb = require('bluebird');
const elasticsearch = require('elasticsearch');

const log = require('../lib/fake-logger');
const waitForCluster = require('../lib/wait-for-cluster');

module.exports = async customClient => {
    let client = customClient;
    if (!client) {
        client = new elasticsearch.Client({
            hosts: process.env.TEST_ELASTICSEARCH || 'http://localhost:9200',
            defer: () => bb.defer(),
        });
    }

    await waitForCluster(client, log);
    await client.indices.delete({index: '*'});
    await client.indices.deleteTemplate({name: '*'});
    await client.cluster.health({
        waitForStatus: 'yellow',
    });
};
