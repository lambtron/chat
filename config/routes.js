/**
 * Import all models ===============================================================================
 */
require('../app/models/message.js');


/**
 * Module dependencies =============================================================================
 */
var mongoose = require('mongoose')
	, Message = mongoose.model('Message')
	, _ = require('underscore');

console.log('message: ');
console.log(Message);

module.exports = function(app) {
	// API routes for Message model ==================================================================
	// + GET all messages
	app.get('/api/messages', function(req, res) {
		// Use Mongoose to get all of the messages in the database.
		Message.find(function(err, messages) {
			// If there is an error while retrieving, send the error, nothing after res.send(err) 
			// will	execute.
			if (err) {
				res.send(err);
			};

			// Return all messages in JSON format.
			res.json(messages);
		});
	});

	// Create a Message and send back all Messages.
	app.post('/api/messages', function(req, res) {
		var body = req.body.text;
		var to = req.body.to;
		var from = req.body.from;

		// Call Twilio's API to send the Message.

		// Create a message; information comes from AJAX request from Angular
		Message.create({
			body : body,
			to : to,
			from : from
		}, function(err, message) {
			if (err) {
				res.send(err);
			};

			Message.find(function(err, messages) {
				if (err) {
					res.send(err);
				};
				res.json(messages);
			});
		});
	});

	// Delete a Message.
	app.delete('/api/messages/:message_id', function(req, res) {
		Message.remove({
			_id : req.params.message_id
		}, function(err, message) {
			if (err) {
				res.send(err);
			};

			// Get and return all of the messages after the message is deleted.
			Message.find(function(err, message) {
				if (err) {
					res.send(err);
				};
				res.json(messages);
			});
		});
	});

	// Application route =============================================================================
	app.get('*', function(req, res) {
		// Load the single view file (Angular will handle the page changes).
		res.sendfile('index.html', {'root': './public/views/'});
	});
};