const keystone = require('keystone');
const express = require('express');
const speedTest = require('speedtest-net');
const uaParser = require('ua-parser-js');

const { log } = require('../../utils');

const router = express.Router();

let message = 'Sorry, there were some issues under the hood; please try again.';

function authResponse (res, status, message) {
	return res.status(status).json({ message });
}

function signin (req, res) {

	if (!req.body.username || !req.body.password) return res.json({ success: false });

	keystone.list('User').model.findOne({ email: req.body.username }).exec(function (err, user) {

		if (err) {
			console.log(err);
			message = (err && err.message ? err.message : false) || message;
			return authResponse(res, 500, message);
		}

		if (!user) {
			return authResponse(res, 404, 'Sorry, no user exists with that username!');
		}

		keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function (user) {

			if (process.env.NODE_ENV !== 'production') {
				const now = new Date();
				log.auth(`User ${ user.email } logged in successfully on ${now.toUTCString()}.`);
			}

			return res.status(200).json({
				success: true,
				date: new Date().getTime(),
				user: user,
			});

		}, function (err) {
			console.log(err);
			if (err) {
				message = (err && err.message ? err.message : false) || message;
				return authResponse(res, 403, message);
			}
		});
	});
}

function signout (req, res) {
	keystone.session.signout(req, res, function () {
		res.status(200).json({ success: true });
	}, function (err) {
		if (err) {
			message = (err && err.message ? err.message : false) || message;
			return authResponse(res, 500, message);
		}
	});
}

function checkAuth (req, res, next) {
	if (req.user) return next();
	return authResponse(res, 403, 'Sorry, this resource requires a user access! Please log in.');
}

exports.router = routes => {

	router.use('/avatar', express.static('uploads/avatars'));

	router.post('/signin', signin);
	router.post('/signout', signout);

	// router.all('*', checkAuth);
	router.get('/me', checkAuth, (req, res) => {
		return res.status(200).json({ user: req.user });
	});

	router.post('/save', checkAuth, (req, res) => {
		keystone.list('User').model.findById(req.user._id).exec(function (err, item) {

			if (err) return authResponse(res, 500, err);
			if (!item) return authResponse(res, 404, 'User not found!');

			item.getUpdateHandler(req).process(req.body, function (err) {

				if (err) return authResponse(res, 500, err);
				return res.status(200).json({ user: item });
			});
		});

	});

	router.get('/connection', (req, res) => {
		const test = speedTest({ maxTime: 5000 });
		const useragent = uaParser(req.headers['user-agent']);
		test.on('data', network => res.status(200).json({ network, useragent }));
		test.on('error', err => {
			return authResponse(res, 503, 'Connection speed auto-detection is temporarily offline; please try again later.');
		});
	});

	return router;
};
