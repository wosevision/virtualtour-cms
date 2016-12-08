var keystone = require('keystone');
var Types = keystone.Field.Types;
var Schema = require('mongoose').Schema;

// var AttributeSchema = new Schema({
// 	prop: { type: String, required: true },
// 	val: Schema.Types.Mixed,
// 	type: String
// });
/**
 * User Model
 * ==========
 */
var Entity = new keystone.List('Entity', {
	plural: 'Entities',
	track: true
});

Entity.add({
	type: {
		type: Types.Text,
		initial: true,
		index: true
	},
	// attrs: {
	// 	type: Types.List,
	// 	fields: {
	// 		prop: {
	// 			type: Types.Text
	// 		},
	// 		val: {
	// 			type: Types.Text
	// 		}
	// 	}
	// },
	entities: {
		type: Types.Relationship,
		ref: 'Entity',
		many: true
	}
});

var autoPopulate = function(next) {
	this.populate('entities');
	next();
};


Entity.schema.add({
	attrs: [{ prop: String, val: Schema.Types.Mixed }]
});

Entity.schema.pre('find', autoPopulate);

/**
 * Registration
 */
Entity.track = true;
Entity.defaultColumns = 'type attrs';
Entity.register();