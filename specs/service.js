'use strict';

const atrix = require('@trigo/atrix');
const path = require('path');

atrix.configure({ pluginMap: { elasticsearch: path.join(__dirname, '../') } });

atrix.addService({
	name: 'elasticsearch',
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

