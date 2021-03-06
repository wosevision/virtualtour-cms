const sharp = require('sharp');
const router = require('express').Router();

const {
  parse
} = require('url');
const {
  inspect
} = require('util');
const {
  join
} = require('path');

const {
  supportsWebP,
  log
} = require('../../../utils');

const ALLOWED_PARAMS = [
  'width',
  'height',
  'quality',
  'progressive',
];

exports.router = routes => {
  router.get('/:filename', (req, res, next) => {
    const filename = join('./uploads', req.params.filename);

    const params = Object.keys(req.query).reduce((acc, key) => {
      if (ALLOWED_PARAMS.findIndex(index => index === key) !== -1) {
        acc[key] = Number(req.query[key]);
      }
      return acc;
    }, {});

    const transformer = sharp(filename);

    if (params.width || params.height) {
      if (params.width && params.height) {
        transformer.resize(params.width, params.height);
      } else {
        transformer.resize(params.width ? params.width : null, params.height ? params.height : null);
      }
    } else {
      transformer.resize(4096, 2048);
    }

    const {
      pathname
    } = parse(req.url);
    const extension = (pathname.match(/\.([a-z]{3,4})$/i) || [])[1];

    if (supportsWebP(req.headers.accept, extension)) { // eslint-disable-line
      res.setHeader('Content-Type', 'image/webp');
      transformer.webp({
        quality: params.quality === 0 ? 5 : params.quality || 95,
      });
    } else {
      res.setHeader('Content-Type', 'image/jpeg');
      transformer.jpeg({
        quality: params.quality === 0 ? 5 : params.quality || 90,
        // optimizeScans: true
        progressive: Boolean(params.progressive) || true,
      });
      // .toBuffer(function (err, outputBuffer, info) {
      //   // outputBuffer contains 200px high JPEG image data,
      //   // auto-rotated using EXIF Orientation tag
      //   // info.width and info.height contain the dimensions of the resized image
      // })
    }
    transformer.on('info', info => {
      log.note('Panorama served:\n', inspect(info, {
        depth: null,
        colors: true,
      }));
    });
    req.pipe(transformer).pipe(res);
  });

  router.get('/thumbnail/:filename', (req, res, next) => {
    const filename = join('./uploads', req.params.filename);
    const transformer = sharp(filename)
      .resize(300)
      .jpeg({
        quality: 60,
      });
    transformer.on('info', info => {
      log.note('Thumbnail served:\n', inspect(info, {
        depth: null,
        colors: true,
      }));
    });
    req.pipe(transformer).pipe(res);
  });
  return router;
};
