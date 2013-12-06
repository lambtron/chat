/**
 * Import all models ===============================================================================
 */
require('../app/models/message.js');

/**
 * Import controllers ==============================================================================
 */
var Twilio = require('../app/controllers/twilio.js');

/**
 * Module dependencies =============================================================================
 */
var mongoose = require('mongoose')
	, Message = mongoose.model('Message')
	, _ = require('underscore');

module.exports = function(app) {
	// API routes for Message model ==================================================================
	// + GET all messages
	app.get('/api/messages', function(req, res) {
		// Use Mongoose to get all of the messages in the database.
		// Only get the Messages in Mongodb where the 'from' or 'to' matches your Twilio number.
		Message.find({ $or: [ {'to': '+14158586858'}, {'from': '+14158586858'} ] },
			function(err, messages) {
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
	app.post('/api/message', function(req, res) {
		// Debugging purposes.
		console.log(JSON.stringify(req.body, null, 4));

		// Message specific variables.
		var body = ''
		  , to   = ''
		  , from = '';

		if(typeof req.body.MessageSid !== "undefined") {
			// If Twilio is making the POST request, then this is an inbound SMS.
			body = req.body.Body;
			to = req.body.To;
			from = req.body.From;
		} else {
			// Else, this is a POST request from the client, an outbound SMS.
			body = req.body.formData.text;
			to = req.body.toData.text;
			// from = req.body;
			from = '+14158586858';

			// Send POST request to Twilio to initate outbound SMS.
			// To, From, Body
			Twilio.sendMessage(to, from, body);
		};

		// Save Message object to Mongodb.
		// Create a message; information comes from AJAX request from Angular
		Message.create({
			body : body,
			to : to,
			from : from
		}, function(err, message) {
			if (err) {
				res.send(err);
			};

			// Load all new messages.
			Message.find({ $or: [ {'to': '+14158586858'}, {'from': '+14158586858'} ] },
				function(err, messages) {
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