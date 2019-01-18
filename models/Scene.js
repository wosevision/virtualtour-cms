const keystone = require('keystone');
const Types = keystone.Field.Types;

const {
  getStorageAdapter
} = require('../utils');

/**
 * Scene model
 * ==========
 */
const Scene = new keystone.List('Scene', {
  // autokey: { path: 'code', from: 'name', unique: true },
  defaultSort: 'parent name code',
  drilldown: 'parent',
});

Scene.add(
  'Metadata', {
    name: {
      type: Types.Text,
      initial: true,
      index: true,
      required: true,
    },
    code: {
      type: Types.Key,
      note: 'Used for unique identification (such as in URLs). <strong>No special characters.</strong>',
      separator: '_',
      width: 'small',
      initial: true,
      required: true,
      index: true,
      lowercase: true,
    },
    parent: {
      type: Types.Relationship,
      label: 'Building',
      note: 'Assign a <em>building</em> relationship to this scene.',
      ref: 'Building',
      initial: true,
      index: true,
    },
    state: {
      type: Types.Select,
      options: 'draft, published, archived',
      note: 'Set this scene to published, archived, or draft mode.',
      default: 'published',
      index: true,
    },
    visible: {
      type: Types.Boolean,
      label: 'Show in navigation menus?',
      note: [
        'Uncheck to hide this scene from all navigation menus, such as the "By Location" drilldown menu.',
        '<br/>',
        '<strong>Scenes will still be accessible by URL and scene link.</strong>',
      ].join(''),
      default: true,
      initial: true,
      index: true,
    },
  },
  'Sky configuration', {
    sky: {
      type: {
        type: Types.Select,
        label: 'Sky type',
        note: [
          '<ul>',
          '<li><em>Panorama</em> – choose a panoramic image background</li>',
          '<li><em>Video</em> – choose a 360° YouTube video background</li>',
          '<li><em>Environment</em> – choose background colour/fog/etc</li>',
          '</ul>',
        ].join(''),
        options: 'panorama, video, environment',
        default: 'panorama',
        initial: true,
      },
      panorama: {
        dependsOn: {
          'sky.type': 'panorama'
        },
        type: Types.File,
        label: 'Panorama',
        note: [
          '<br/>',
          'Select an equirectangular panorama to upload for the sky background.',
          '<br/>',
          '<strong>Panorama widths must be twice their height, and perform optimally in powers of two.</strong>',
          '<br/><br/>',
          '<em>Optimal: 4096x2048</em>',
        ].join(''),
        initial: true,
        storage: getStorageAdapter('./uploads', '/api/v1/panoramas/'),
      },
      video: {
        dependsOn: {
          'sky.type': 'video'
        },
        type: Types.Url,
        label: 'Video',
        note: [
          'Enter the URL of a 360° YouTube video to use as the sky background.',
          '<br/>',
          '<strong>WARNING:</strong> use of a video you do not own is a violation of the YouTube terms of service.',
        ].join(''),
        initial: true,
      },
      environment: {
        color: {
          dependsOn: {
            'sky.type': 'environment'
          },
          type: Types.Color,
          label: 'Sky colour',
          note: 'Pick a colour to use as the sky background.',
          initial: true,
        },
        fog: {
          enabled: {
            dependsOn: {
              'sky.type': 'environment'
            },
            type: Types.Boolean,
            label: 'Use fog?',
            initial: true,
          },
          color: {
            dependsOn: {
              'sky.type': 'environment',
              'sky.environment.fog.enabled': true
            },
            type: Types.Color,
            label: 'Fog colour',
            initial: true,
          },
        },
      },
    },
  },
  'Scene configuration', {
    sceneLinks: {
      type: Types.List,
      fields: {
        scene: {
          type: Types.Relationship,
          ref: 'Scene',
        },
        position: {
          type: Types.NumberArray,
          default: [0, 0, 0],
        },
        rotation: {
          type: Types.NumberArray,
          default: [0, 0, 70],
        },
        label: {
          type: Types.Select,
          note: 'Provides a text popup for the scene link. Default: automatically show popups on scenes that link to scenes from other groups (such as a different building).',
          options: 'default, scene, building, custom',
          default: 'default',
        },
        custom: {
          type: Types.Text,
          label: 'Custom label',
          dependsOn: {
            label: 'custom'
          },
        },
      },
      note: 'Provide links to other scenes; can be edited within tour for proper rotation and postioning',
    },
    hotSpots: {
      type: Types.List,
      fields: {
        linked: {
          type: Types.Boolean,
          label: 'Link to a campus map feature?',
          default: false,
        },
        feature: {
          type: Types.Relationship,
          label: 'Feature link',
          ref: 'Feature',
          dependsOn: {
            linked: true
          },
        },
        name: {
          type: Types.Text,
          dependsOn: {
            linked: false
          },
        },
        desc: {
          type: Types.Html,
          wysiwyg: true,
          dependsOn: {
            linked: false
          },
        },
        thumbnail: {
          type: Types.File,
          label: 'Thumbnail image',
          storage: getStorageAdapter('./uploads/static', '/api/v1/static/'),
        },
        position: {
          type: Types.NumberArray,
        },
      },
      note: 'Provide info on special points; can be edited within tour for proper postioning',
    },
  },
  'Advanced configuration', {
    assets: {
      type: Types.Relationship,
      ref: 'Entity',
      many: true,
    },
    entities: {
      type: Types.Relationship,
      ref: 'Entity',
      many: true,
    },
    script: {
      type: Types.Code,
      label: 'Javascript',
      language: 'js',
    },
  }, {
    preload: {
      type: Types.List,
      watch: true,
      label: 'Assets to preload',
      note: '<em>This list is auto-generated on save and populated with assets linked in this scene.</em>',
      value: function (callback) {
        const list = keystone.list('Scene');
        const promises = this.sceneLinks.map(
          link => list.model
          .findById(link.scene, 'sky.panorama')
          .exec()
        );
        Promise.all(promises)
          .then(scenes => list.model.findByIdAndUpdate(this._id, {
            $set: {
              preload: scenes.filter(Boolean).map(s => s.sky.panorama)
            },
          }).exec())
          .then(scene => callback(null, scene.preload || []))
          .catch(err => callback(err));
      },
      fields: {
        filename: {
          type: String,
        },
        size: {
          type: Number,
        },
        originalname: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      noedit: true,
    },
  }
);

Scene.schema.statics.findByCode = function (code, cb) {
  return this.findOne({
    code: code
  }, cb);
};

Scene.schema.index({
  parent: 1,
  code: 1
});

/**
 * Registration
 */
Scene.track = true;
Scene.defaultColumns = 'name, parent, code|10%, state|10%, sceneLinks|15%, hotSpots|15%,  visible|5%';
Scene.register();
