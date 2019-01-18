const router = require('express').Router();
const request = require('request');
const getInfo = require('webvr360/lib/get-info');

exports.router = routes => {

  router.get('/', (req, res) => {
    getInfo(req.query).then(body => {
      request.get(body[1].video.url).pipe(res);
    }).catch(function (err) {
      console.error(err);
      res.status(400).send({
        success: false,
        error: 'Could not fetch video',
      });
    });
  });

  return router;
};
