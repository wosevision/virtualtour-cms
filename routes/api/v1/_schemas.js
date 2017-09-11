
// const mongoose = require('mongoose');
const keystone = require('keystone');
const router = require('express').Router();
const jsonSchema = require('mongoose-jsonschema').modelToJSONSchema;

const { capitalize } = require('../../../utils');

exports.router = routes => {
	router.get('/:schema', (req, res) => {
		const schemaName = capitalize(req.params.schema.toLowerCase());
		const model = keystone.list(schemaName).model;
		res.set({ 'Content-Type': 'application/schema+json' })
			.send(jsonSchema(model)).end();
	});
	return router;
};
