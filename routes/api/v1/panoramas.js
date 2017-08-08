const path = require('path');
const sharp = require('sharp');
const router = require('express').Router();

exports.router = routes => {
	router.get('/:filename', (req, res, next) => {
		const filename = path.join('./uploads', req.params.filename);
		const {
			width,
			height,
			quality,
			progressive,
			webp,
		} = req.query;

		const transformer = sharp(filename);

		if (width || height) {
			if (width && height) {
				transformer.resize(Number(width), Number(height));
			} else {
				transformer.resize(width ? Number(width) : null, height ? Number(height) : null);
			}
		} else {
			transformer.resize(4096, 2048);
		}

		if (Boolean(webp)) { // eslint-disable-line
			transformer.webp({
				quality: Number(quality) || 65,
			});
		} else {
			transformer.jpeg({
				quality: Number(quality) || 80,
				// optimizeScans: true
				progressive: Boolean(progressive) || true,
			});
			// .toBuffer(function (err, outputBuffer, info) {
			//   // outputBuffer contains 200px high JPEG image data,
			//   // auto-rotated using EXIF Orientation tag
			//   // info.width and info.height contain the dimensions of the resized image
			// })
		}
		transformer.on('info', info => {
			console.log('Panorama info:', info);
		});
		req.pipe(transformer).pipe(res);
	});

	router.get('/thumbnail/:filename', (req, res, next) => {
		const filename = path.join('./uploads', req.params.filename);
		const transformer = sharp(filename)
			.resize(300)
			.jpeg({
				quality: 60,
			});
		transformer.on('info', info => {
			console.log('Thumbnail info:', info);
		});
		req.pipe(transformer).pipe(res);
	});
	return router;
};
