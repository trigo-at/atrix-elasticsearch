'use strict';

/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0, space-before-function-paren: 0, no-unused-expressions: 0 */

const { expect } = require('chai');
const AtrixElasticsearch = require('./AtrixElasticsearch');
const path = require('path');
const fakeLogger = require('./fake-logger');
const resetEs = require('./reset-cluster');
const bb = require('bluebird');

describe('AtrixElasticsearch', () => {
	it('throws Exception whe indexTemplateDir does not eixts', () => {
		expect(() => new AtrixElasticsearch({}, { log: fakeLogger }, {
			connectionString: process.env.TEST_ELASTICSEARCH || 'http://localhost:9200',
			indexTemplateDir: 'franz',
		})).to.throw(/Invalid indexTemplateDir/);
	});


	describe('on startup', () => {
		const fakeService = { log: fakeLogger };
		let connection;
		let startupCalledArgs;
		let ae;
		beforeEach(async () => {
			await resetEs();
			ae = new AtrixElasticsearch({}, fakeService, {
				connectionString: process.env.TEST_ELASTICSEARCH || 'http://localhost:9200',
				indexTemplateDir: path.join(__dirname, '../specs/templates'),
				onStartup: async (...args) => {
					await bb.delay(50);
					startupCalledArgs = args;
				},
			});
			connection = await ae.start();
		});

		it('applies all found indexTemplates', async () => {
			await bb.delay(500);
			expect(await connection.client.indices.existsTemplate({ name: 'templ_0' })).to.be.true;
			expect(await connection.client.indices.existsTemplate({ name: 'templ_1' })).to.be.true;
		});

		describe('config.onStartup settings', () => {
			it('handler called after initialization', () => {
				expect(startupCalledArgs[0]).to.exist;
			});
			it('first argument is the connection', () => {
				expect(startupCalledArgs[0]).to.equal(connection);
			});
			it('second arg is the service', () => {
				expect(startupCalledArgs[1]).to.equal(fakeService);
			});
			it('third arg is the plugin instance', () => {
				expect(startupCalledArgs[2]).to.equal(ae);
			});
		});

		it('connection exposes initialized elasticsearch client', () => {
			expect(connection.client).to.be.an('object');
		});

		it('connection exposes resetCluster function', () => {
			expect(connection.resetCluster).to.be.a('function');
		});

		it('connection exposes applyIndexTemplates function', () => {
			expect(connection.applyIndexTemplates).to.be.a('function');
		});

		it('can reset cluster', async () => {
			await connection.resetCluster();
			await bb.delay(500);
			expect(await connection.client.indices.existsTemplate({ name: 'templ_0' })).to.be.false;
			expect(await connection.client.indices.existsTemplate({ name: 'templ_1' })).to.be.false;
		});

		it('can apply templates cluster', async () => {
			await connection.resetCluster();
			await bb.delay(500);
			await connection.applyIndexTemplates();
			await bb.delay(500);
			expect(await connection.client.indices.existsTemplate({ name: 'templ_0' })).to.be.true;
			expect(await connection.client.indices.existsTemplate({ name: 'templ_1' })).to.be.true;
		});
	});
});
