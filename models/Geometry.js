'use strict';

const keystone = require('keystone');
const Types = keystone.Field.Types;

const joom = require('joometries');
/**
 * Geometry Model
 * ==========
 */
const Geometry = new keystone.List('Geometry', {
  map: {
    name: 'label'
  },
  track: true,
  plural: 'Geometries'
});

Geometry.add({
  label: {
    type: Types.Text,
    initial: true
  },
  type: {
    type: Types.Select,
    initial: true,
    required: true,
    options: [
      'Point',
      'MultiPoint',
      'LineString',
      'MultiLineString',
      'Polygon',
      'MultiPolygon',
      'GeometryCollection'
    ]
  },
  //		[x, y]
  //		Singular point/dot
  point: {
    type: Types.Text,
    initial: true,
    dependsOn: {
      type: 'Point'
    }
  },
  //		[
  //			[x, y], [x, y]
  //		]
  //		2 or more points, possibly connected
  points: {
    type: Types.Textarea,
    initial: true,
    dependsOn: {
      type: ['MultiPoint', 'LineString']
    }
  },
  //		[
  //			[ [x, y], [x, y] ],
  //			[ [x, y], [x, y] ]
  //		]
  //		2 or more lines, or 1 or more full shape
  coordset: {
    type: Types.List,
    // initial: true,
    label: 'Point set',
    dependsOn: {
      type: ['MultiLineString', 'Polygon']
    },
    fields: {
      coords: {
        type: Types.Textarea,
        initial: true,
        label: 'Points'
      }
    }
  },
  //		[
  //			[ [x, y], [x, y], [x, y], [x, y] ],
  //			[ [x, y], [x, y], [x, y], [x, y] ]
  //		]
  //		2 or more full shapes
  coordsets: {
    type: Types.List,
    // initial: true,
    label: 'Point set collection',
    dependsOn: {
      type: ['MultiPolygon']
    },
    fields: {
      coordset: {
        type: Types.TextArray,
        label: 'Point set'
      }
    }
  },
  //		[{...}, {...}]
  //		2 or more entire geometries
  geometries: {
    type: Types.Relationship,
    ref: 'Geometry',
    initial: true,
    many: true,
    dependsOn: {
      type: ['GeometryCollection']
    }
  }
});

const transform = function (doc, ret, options) {
  const type = doc.type;
  if (type !== 'GeometryCollection') {
    let coordinates;
    switch (type) {
      case 'Point':
        coordinates = new joom.Point(doc.point);
        break;
      case 'MultiPoint':
      case 'LineString':
        coordinates = new joom.MultiPoint(doc.points);
        break;
      case 'MultiLineString':
      case 'Polygon':
        coordinates = new joom.Polygon(
          doc.coordset.map(coords => {
            return new joom.MultiPoint(coords.coords);
          })
        );
        break;
      case 'MultiPolygon':
        coordinates = doc.coordsets.map(coordset => {
          return new joom.Polygon(coordset.coordset);
        });
        break;
      default:
        break;
    }
    return {
      type,
      coordinates
    };
  }
}

/**
 * Emergency schema edit for #nested-lists branch maintenance
 * Comment props out on List, uncomment props on schema when branch is broken
 */
// Geometry.schema.add({
// 	coordset: [{ coords: String }],
// 	coordsets: [{ coordset: [String] }]
// });

Geometry.schema.set('toJSON', {
  transform
});

Geometry.relationship({
  path: 'feature',
  ref: 'Feature',
  refPath: 'geometry'
});

/**
 * Registration
 */
Geometry.defaultColumns = 'label, type|15%, createdAt|20%, updatedAt|20%';
Geometry.register();
