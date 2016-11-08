const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const Category = new keystone.List('Category', {
	track: true
});

Category.add({
	name: {
		type: Types.Text,
		initial: true,
		required: true,
		index: true
	},
	default: {
		type: Types.Relationship,
		label: 'Default feature collection',
		initial: true,
		ref: 'FeatureCollection'
	}
});

Category.relationship({ path: 'features', ref: 'Feature', refPath: 'properties.category' });
Category.relationship({ path: 'feature-collections', ref: 'FeatureCollection', refPath: 'category' });

/**
 * Registration
 */
Category.register();