'use strict';

module.exports = {
	template: '*:test2:*',
	settings: {
		number_of_shards: 1,
		number_of_replicas: 0,
	},
	mappings: {
		_default_: {
			dynamic_templates: [{
				base: {
					mapping: {
						index: 'not_analyzed',
					},
					match: '*',
					match_mapping_type: '*',
				},
			}],
		},
	},
	aliases: {},
};
