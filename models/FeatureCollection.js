'use strict';

const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Feature Model
 * ==========
 */
const FeatureCollection = new keystone.List('FeatureCollection', {
	track: true,
	drilldown: 'location'
});

FeatureCollection.add('Metadata', {
	type: {
		type: Types.Text,
		noedit: true,
		default: 'FeatureCollection'
	},
	name: {
		type: Types.Text,
		label: 'Collection name',
		required: true,
		initial: true
	},
	category: {
		type: Types.Relationship,
		ref: 'Category',
		// required: true,
		initial: true
	},
	location: {
		type: Types.Relationship,
		ref: 'Location',
		// required: true,
		initial: true
	}
});

FeatureCollection.relationship({ path: 'features', ref: 'Feature', refPath: 'group' });

/**
 * Registration
 */
FeatureCollection.defaultColumns = 'name, location, category';
FeatureCollection.register();