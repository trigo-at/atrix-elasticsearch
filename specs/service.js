'use strict';

const atrix = require('@trigo/atrix');
const path = require('path');

atrix.configure({ pluginMap: { elasticsearch: path.join(__dirname, '../') } });

const svc = new atrix.Service('elasticsearch', {
	dataSource: {
		m1: {
			type: 'elasticsearch',
			config: {
				connectionString: 'http://localhost:9200',
				indexTemplateDir: path.join(__dirname, './templates'),
			},
		},
	},
});

atrix.addService(svc);

