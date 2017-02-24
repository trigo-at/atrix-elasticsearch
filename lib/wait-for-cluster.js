'use strict';

const retry = require('async-retry');

const info = async (client, log) => {
	log.info('Check for elasticsearch cluster...');
	const info = await client.info();
	log.info(info);
	await client.cluster.health({
		waitForStatus: 'yellow',
	});
	log.info('Elasticsearch up and running.');
};

const waitForCluster = async (client, log) => {
	log.info('Waiting for elasticsearch cluster to becaome available...');
	return retry(async () => {
		await info(client, log);
		return true;
	}, {
		retries: 5000,
		factor: 1.2,
	});
};

module.exports = waitForCluster;
