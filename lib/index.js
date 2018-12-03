const pkg = require('../package.json');

const AtrixElasticsearch = require('./AtrixElasticsearch');

module.exports = {
	name: pkg.name,
	version: pkg.version,
	register: () => {},
	factory: (atrix, service, config) => new AtrixElasticsearch(atrix, service, config),
	compatibility: {
		atrix: {
			min: '6.0.0-7',
		},
	},
};
