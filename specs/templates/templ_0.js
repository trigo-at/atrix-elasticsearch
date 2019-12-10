'use strict';

module.exports = {
    template: '*:branch:*',
    settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
    },
    mappings: {
        dynamic_templates: [
            {
                base: {
                    mapping: {
                        type: 'keyword',
                    },
                    match: '*',
                    match_mapping_type: '*',
                },
            },
        ],
    },
    aliases: {},
};
