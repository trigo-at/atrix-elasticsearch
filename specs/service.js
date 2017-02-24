'use strict';

const atrix = require('@trigo/atrix');
const path = require('path');

atrix.configure({ pluginMap: { elasticsearch: path.join(__dirname, '../') } });

const svc = new atrix.Service('elasticsearch', {
	dataSource: {
		m1: {
			type: 'elasticsearch',
			config: {
			},
		},
	},
});

atrix.addService(svc);

