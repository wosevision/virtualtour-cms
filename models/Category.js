const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const Category = new keystone.List('Category', {
  track: true
});

Category.add('Metadata', {
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
}, 'Icon styles', {
  icon: {
    path: {
      type: Types.Textarea,
      label: 'Icon path code',
      note: 'SVG code for rendering icon shapes (see https://materialdesignicons.com/ for ready-to-export SVG icon codes).',
      default: 'M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,12.5A1.5,1.5 0 0,1 10.5,11A1.5,1.5 0 0,1 12,9.5A1.5,1.5 0 0,1 13.5,11A1.5,1.5 0 0,1 12,12.5M12,7.2C9.9,7.2 8.2,8.9 8.2,11C8.2,14 12,17.5 12,17.5C12,17.5 15.8,14 15.8,11C15.8,8.9 14.1,7.2 12,7.2Z',
      height: 150
    },
    fillColor: {
      type: Types.Color,
      label: 'Icon fill colour',
      default: '#0077CA'
    },
    strokeColor: {
      type: Types.Color,
      label: 'Icon outline colour',
      default: '#FFFFFF'
    },
    fillOpacity: {
      type: Number,
      label: 'Icon fill transparency',
      note: 'Decimal number between 0 (completely transparent) and 1 (completely opaque).',
      min: 0,
      max: 1,
      default: 0.8
    },
    strokeOpacity: {
      type: Number,
      label: 'Icon outline transparency',
      note: 'Decimal number between 0 (completely transparent) and 1 (completely opaque).',
      min: 0,
      max: 1,
      default: 0.5
    },
    strokeWeight: {
      type: Number,
      label: 'Icon outline thickness',
      note: 'Whole number between 0 (thinnest) and 10 (thickest).',
      min: 0,
      max: 10,
      default: 1
    },
    size: {
      width: {
        type: Number,
        label: 'Icon width',
        min: 0,
        max: 100,
        default: 24
      },
      height: {
        type: Number,
        label: 'Icon height',
        min: 0,
        max: 100,
        default: 24
      }
    },
    anchor: {
      left: {
        type: Number,
        label: 'Icon anchor left offset',
        note: 'Determines what point from the left of the icon\'s edge should be considered its "x middle".',
        min: 0,
        max: 100,
        default: 12
      },
      top: {
        type: Number,
        label: 'Icon anchor top offset',
        note: 'Determines what point from the top of the icon\'s edge should be considered its "y middle".',
        min: 0,
        max: 100,
        default: 12
      }
    }
  }
}, 'Geometry styles', {
  fillColor: {
    type: Types.Color,
    label: 'Shape fill colour',
    default: '#0077CA'
  },
  strokeColor: {
    type: Types.Color,
    label: 'Shape outline colour',
    default: '#003C71'
  },
  fillOpacity: {
    type: Number,
    label: 'Shape fill transparency',
    note: 'Decimal number between 0 (completely transparent) and 1 (completely opaque).',
    min: 0,
    max: 1,
    default: 0.5
  },
  strokeOpacity: {
    type: Number,
    label: 'Shape outline transparency',
    note: 'Decimal number between 0 (completely transparent) and 1 (completely opaque).',
    min: 0,
    max: 1,
    default: 0.3
  },
  strokeWeight: {
    type: Number,
    label: 'Shape outline thickness',
    note: 'Whole number between 0 (thinnest) and 10 (thickest).',
    min: 0,
    max: 10,
    default: 3
  },
  zIndex: {
    type: Number,
    label: 'Layer depth order',
    note: 'Categories with higher depth level values visually display their features in front of lower value categories.',
    min: 0,
    max: 1000,
    default: 1
  }
});

Category.relationship({
  path: 'features',
  ref: 'Feature',
  refPath: 'properties.category'
});
Category.relationship({
  path: 'feature-collections',
  ref: 'FeatureCollection',
  refPath: 'category'
});

/**
 * Registration
 */
Category.register();
