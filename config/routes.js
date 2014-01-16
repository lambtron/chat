'use strict';

(function() {

/**
 * Import all models ===============================================================================
 */
require('../app/models/message');
require('../app/models/user');

/**
 * Import helpers ==================================================================================
 */
var Twilio = require('../app/helpers/twilio');

/**
 * Module dependencies =============================================================================
 */
var mongoose = require('mongoose')
	, Message = mongoose.model('Message')
	, User = mongoose.model('User')
	, my_phone_numbers = process.env.TWILIO_PHONE_NUMBERS
	, _ = require('underscore');

// Public functions. ===============================================================================
module.exports = function(app, io) {
	// API routes for Message model ==================================================================

	// * DELETE (removes all users and messages)
	app.delete('/api', function(req, res) {
		User.remove({}, function(err) {
			console.log('Users removed.');
		});
		Message.remove({}, function(err) {
			console.log('Messages removed.');
		});
		res.send({},200);
	});

	// * POST, add new user to mongodb.
	app.post('/api/user', function(req, res) {
		console.log(req.body);

		var first_name = req.body.firstName
		  , last_name = req.body.lastName
		  , phone_number = Twilio.standardizePhoneNumber(req.body.phoneNumber);

		User.findOne({ phone_number: phone_number }, function(err, user) {
			if (err) {
				res.send(err, 400);
			};

			// If existing user is found.
			if (user) {

				// Need to return all users.
				User.getAllUsers(function(err, users) {
					Message.getMessagesFromUsers(users, function(err, data) {
						res.json(data);
					});
				});
			} else {
				// If user is not found, then create a new one.
				User.create({
					first_name: first_name,
					last_name: last_name,
					phone_number: phone_number
				}, function(err, user) {
					if (err) {
						res.send(err, 400);
					};

					// Need to return all users.
					// Load new user.
					User.getAllUsers(function(err, users) {
						Message.getMessagesFromUsers(users, function(err, data) {
							res.json(data);
						});
					});
				});
			};
		});
	});

	// + GET all users and messages.
	app.get('/api/users', function(req, res) {
		User.getAllUsers(function(err, users) {
			Message.getMessagesFromUsers(users, function(err, data) {
				res.json(data);
			});
		});
	});

	// Create a Message and send back all Messages.
	app.post('/api/message', function(req, res) {
		// Debugging purposes.
		// console.log(JSON.stringify(req.body, null, 4));

		// When a new message is created, we need to add a new user with the phone number as the first
		// name and black as last name.

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
			body = req.body.body;
			to = req.body.to;
			from = req.body.from;

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
				res.send(err, 400);
			};

			// Check if there is a user with this phone number. If no user, create one.
			User.findOne({ phone_number: from }, function(err, user) {
				if (err) {
					res.send(err, 400);
				};

				// If no existing user is found.
				if (!user && (_.indexOf(my_phone_numbers, from) != -1)) {
					// Then create a new one.
					User.create({
						first_name: from,
						last_name: '',
						phone_number: from
					}, function(err, user) {
						if (err) {
							res.send(err, 400);
						};

						// After create user, return all Users.
						returnAll(to, from, function(err, data) {
							if(typeof req.body.MessageSid !== 'undefined') {
								io.sockets.emit('users', data);
							} else {
								res.json(data);
							};
						});

					});
				} else {
					// If user exists.
					
					// Return all users.
					// Form array to hold phone numbers.
					returnAll(to, from, function(err, data) {
						if(typeof req.body.MessageSid !== 'undefined') {
							io.sockets.emit('users', data);
						} else {
							res.json(data);
						};
					});
				};
			});
		});
	});

	// Delete a Message.
	app.delete('/api/messages/:message_id', function(req, res) {
		Message.remove({
			_id : req.params.message_id
		}, function(err, message) {
			if (err) {
				res.send(err, 400);
			};

			// Get and return all of the messages after the message is deleted.
			Message.find(function(err, message) {
				if (err) {
					res.send(err, 400);
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

// Private functions. ==============================================================================
function returnAll(to, from, cb) {
	var arr = [];
	arr.push(to, from);
	arr = _.without(arr, my_phone_numbers);

	User.refreshLastUpdatedOn(arr, function(err, data) {
		if (err) {
			res.json(err, 400);
		};
		// Retrieve Users data and send it back to the front end.
		User.getAllUsers(function(err, users) {
			Message.getMessagesFromUsers(users, function(err, data) {
				cb(err, data);
			});
		});
	});
};

}());