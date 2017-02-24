'use strict';

const bb = require('bluebird');
const Joi = require('joi');
const uuid = require('uuid');

const configSchema = Joi.object({
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

		return {};
	}

	getClient(options) {
	}
}

module.exports = AtrixElasticsearch;
