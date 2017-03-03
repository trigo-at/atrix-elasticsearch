'use strict';

/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, arrow-body-style: 0 */

const { expect } = require('chai');

require('./service');
const atrix = require('@trigo/atrix');

describe('loads datasources into service', () => {
	before(async () => {
		console.log('Wait 10s for kafka to become available.'); // eslint-disable-line
	});

	beforeEach(async () => {
		try {
			await atrix.services.elasticsearch.start();
		} catch (e) {
			console.error(e); // eslint-disable-line
			throw e;
		}
	});

	it('connects all and expose as service.dataConnections', async () => {
		expect(atrix.services.elasticsearch.dataConnections.m1).to.be.an('object');
	});


	it('client can access the cluster', async () => {
		const client =	atrix.services.elasticsearch.dataConnections.m1.client;
		const info = await client.info();
		expect(info.tagline).to.equal('You Know, for Search');
	});
});
