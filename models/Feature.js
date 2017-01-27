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
			type: Types.Boolean,
			label: 'Link to a virtual tour building?',
			default: false,
			// initial: true
		},
		href: {
			type: Types.Url,
			label: 'Link',
			// initial: true,
			dependsOn: { 'properties.linked': false }
		},
		desc: {
			type: Types.Html,
			label: 'Description',
			// initial: true,
			wysiwyg: true,
			dependsOn: { 'properties.linked': false }
		},
		building: {
			type: Types.Relationship,
			label: 'Building link',
			ref: 'Building',
			// initial: true,
			dependsOn: { 'properties.linked': true }
		},
		category: {
			type: Types.Relationship,
			ref: 'Category',
			label: 'Category',
			required: true,
			initial: true
		}
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

/**
 * Registration
 */
Feature.defaultColumns = 'properties.name|20%, properties.linked|10%, properties.building|20%, group|35%, properties.category|15%';
Feature.register();