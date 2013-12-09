/**
 * Import all models ===============================================================================
 */
require('../app/models/message.js');
require('../app/models/user.js');

/**
 * Import controllers ==============================================================================
 */
var Twilio = require('../app/controllers/twilio.js');

/**
 * Module dependencies =============================================================================
 */
var mongoose = require('mongoose')
	, Message = mongoose.model('Message')
	, User = mongoose.model('User')
	, _ = require('underscore');

module.exports = function(app) {
	// API routes for Message model ==================================================================

	// * POST, add new user to mongodb.
	app.post('/api/user', function(req, res) {
		var first_name = req.body.firstName
		  , last_name = req.body.lastName
		  , phone_number = Twilio.standardizePhoneNumber(req.body.phoneNumber);

		User.create({
			first_name: first_name,
			last_name: last_name,
			phone_number: phone_number
		}, function(err, user) {
			if (err) {
				res.send(err);
			};

			// Load new user.
			res.json(user);
		});
	});


	// + GET all users and messages.
	app.get('/api/users', function(req, res) {
		// Get the self phone number from req.
		// var my_phone_number = req.body.my_phone_number;
		var my_phone_number = '+14158586858';

		// Use Mongoose to get all of the messages in the database.
		// Only get the Messages in Mongodb where the 'from' or 'to' matches your Twilio number.
		Message.find({ $or: [ {'to': my_phone_number}, {'from': my_phone_number} ] },
			function(err, messages) {

  		// Create an array of all the phone numbers across all messages.
  		var phone_numbers = [];
  		for (var i = messages.length - 1; i >= 0; i--) {
  			if (!_.contains(phone_numbers, Twilio.standardizePhoneNumber(messages[i].to)))
  				phone_numbers.push(Twilio.standardizePhoneNumber(messages[i].to));
  			if (!_.contains(phone_numbers, Twilio.standardizePhoneNumber(messages[i].from)))
  				phone_numbers.push(Twilio.standardizePhoneNumber(messages[i].from));
  		};

  		// Transform array to array of objects.
  		// Array must be in this format:
			// [ {phone_number: '+12409887757'}, ... ]
			var arr = [];
  		for( var i = phone_numbers.length -1; i>=0; i--) {
  			var obj = {};
  			obj.phone_number = phone_numbers[i];
  			arr.push(obj);
  		};

  		// Retrieve all users that have conversations.
  		// Get users where the phone number matches any of the phone numbers in the array.
  		var query = User.find({});
			query.or(arr);
  		query.exec(function(err, users) {
  			if (err) {
  				res.send(err);
  			};
  			// If no users were returned, then we have to return empty data.
  			// TODO.

  			// With the array of users, turn to this kind of data structure:
  			// Make a new array from messages, where the user.phone_number is either 
				// the to or the from field
				var new_users = JSON.parse(JSON.stringify(users));

  			for(var i=new_users.length-1; i>=0; i--) {
  				var chat = [];
  				new_users[i].chat = [];
  				for(var j=messages.length-1; j>=0; j--) {
  					if (new_users[i].phone_number == messages[j].to ||
  						new_users[i].phone_number == messages[j].from) {
  						chat.push(messages[j]);
  					};
  				};
  				new_users[i].chat = chat;
  			};

  			// console.log(JSON.stringify(new_users, null, 2));

  			res.json(new_users);
  		});
		});
	});

	// Get messages.
	app.get('/api/messages', function(req, res) {
		var my_phone_number = '+14158586858';

		// Use Mongoose to get all of the messages in the database.
		// Only get the Messages in Mongodb where the 'from' or 'to' matches your Twilio number.
		Message.find({ $or: [ {'to': my_phone_number}, {'from': my_phone_number} ] },
			function(err, messages) {
			if (err) {
				res.send(err);
			};
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