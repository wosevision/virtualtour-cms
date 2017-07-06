const keystone = require('keystone');
const Types = keystone.Field.Types;

const utils = require('../utils/string');

/**
 * User Model
 * ==========
 */
const Drilldown = new keystone.List('Drilldown', {
  plural: 'Drilldown items',
  defaultSort: 'parent level',
  drilldown: 'parent',
  track: true
});

Drilldown.add({
  name: {
    initial: false,
    noedit: true,
    type: Types.Text,
    watch: 'location building scene',
    value: function(callback) {
      keystone.list(utils.capitalize(this.level))
        .model
        .findById(this[this.level])
        .exec(function(err, item){
          callback(err, item.name);
        });
    }
  },
  level: {
    type: Types.Select,
    options: 'location, building, scene',
    default: 'scene',
    initial: true,
    index: true
  },
  location: {
    type: Types.Relationship,
    ref: 'Location',
    dependsOn: { 'level': 'location' },
    initial: true
  },
  building: {
    type: Types.Relationship,
    ref: 'Building',
    dependsOn: { 'level': 'building' },
    initial: true
  },
  scene: {
    type: Types.Relationship,
    ref: 'Scene',
    dependsOn: { 'level': 'scene' },
    initial: true
  },
  parent: {
    type: Types.Relationship,
    ref: 'Drilldown',
    initial: true
  }
});

Drilldown.relationship({ path: 'children', ref: 'Drilldown', refPath: 'parent' });

/**
 * Registration
 */
Drilldown.track = true;
Drilldown.defaultColumns = 'name, level, parent';
Drilldown.register();