var keystone = require('keystone');
var Types = keystone.Field.Types;

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
	attrs: {
		type: Types.List,
		fields: {
			prop: {
				type: Types.Text
			},
			val: {
				type: Types.Text
			}
		}
	},
	entities: {
		type: Types.Relationship,
		ref: 'Entity',
		many: true
	}
});

/**
 * Emergency schema edit for #nested-lists branch maintenance
 * Comment props out on List, uncomment props on schema when branch is broken
 */
// Entity.schema.add({
// 	attrs: [{ prop: String, val: {} }]
// });

var autoPopulate = function(next) {
	this.populate('entities');
	next();
};

Entity.schema.pre('find', autoPopulate);

/**
 * Registration
 */
Entity.track = true;
Entity.defaultColumns = 'type attrs';
Entity.register();