var keystone = require('keystone');
var Types = keystone.Field.Types;
// var Schema = require('mongoose').Schema;

// var AttributeSchema = new Schema({
// 	prop: { type: String, required: true },
// 	val: Schema.Types.Mixed,
// 	type: String
// });
/**
 * User Model
 * ==========
 */
var Entity = new keystone.List('Entity', { plural: 'Entities' });

Entity.add({
	type: {
		type: Types.Text,
		initial: true,
		index: true
	},
	// attrs: [AttributeSchema],
	entities: {
		type: Types.Relationship,
		ref: 'Entity',
		many: true
	}
});

/**
 * Registration
 */
Entity.track = true;
Entity.defaultColumns = '_id, type';
Entity.register();