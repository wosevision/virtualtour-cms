'use strict';

const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Feature Model
 * ==========
 */
const Feature = new keystone.List('Feature', {
  map: { name: 'properties.name' },
	track: true,
	drilldown: 'group'
});

Feature.add('Metadata', {
	type: {
		type: Types.Text,
		noedit: true,
		default: 'Feature'
	},
	properties: {
		name: {
			type: Types.Text,
			label: 'Feature name',
			initial: true
		},
		linked: {
			type: Types.Select,
			label: 'Link to virtual tour?',
			note: 'Select "Building" or "Scene" to allow navigation from the Campus Map to the Virtual Tour, or select "None" to provide an optional URL link and text description for the feature.',
			default: 'none',
			options: [
				{ label: 'Building', value: 'buildings' },
				{ label: 'Scene', value: 'scenes' },
				{ label: 'None', value: 'none' }
			]
		},
		href: {
			type: Types.Url,
			label: 'Link',
			note: 'Optionally provide a URL for this feature to link to.',
			dependsOn: { 'properties.linked': 'none' }
		},
		label: {
			type: Types.Text,
			label: 'Link title',
			note: 'Provide a title for the URL this feature optionally links to.',
			dependsOn: { 'properties.linked': 'none' }
		},
		desc: {
			type: Types.Html,
			label: 'Description',
			// initial: true,
			wysiwyg: true,
			dependsOn: { 'properties.linked': 'none' }
		},
		building: {
			type: Types.Relationship,
			label: 'Building link',
			ref: 'Building',
			// initial: true,
			dependsOn: { 'properties.linked': 'buildings' }
		},
		scene: {
			type: Types.Relationship,
			label: 'Scene link',
			ref: 'Scene',
			// initial: true,
			dependsOn: { 'properties.linked': 'scenes' }
		},
		category: {
			type: Types.Relationship,
			ref: 'Category',
			label: 'Category',
			required: true,
			initial: true
		}
	},
	location: {
		type: Types.Relationship,
		ref: 'Location',
		// required: true,
		initial: true
	},
	group: {
		type: Types.Relationship,
		label: 'Feature collections',
		ref: 'FeatureCollection',
		filters: { 'properties.category': ':_id' },
		index: true,
		many: true,
		initial: true
	}
}, 'Geometry', {
	geometry: {
		type: Types.Relationship,
		initial: true,
		ref: 'Geometry'
	}
});

const transform = function(doc, ret) {
	ret.id = doc._id;
}

Feature.schema.set('toJSON', { transform });

/**
 * Registration
 */
Feature.defaultColumns = 'properties.name|20%, location|20%, properties.category|15%, group|35%, properties.linked|10%';
Feature.register();