//require the Twilio module and create a REST client
var client = require('twilio')('ACad465e648f6f424ea9293be34818ebf9', 'be9ed87202b81e218b26e5423f7b6367');

// Send an SMS text message
var sendMessage = client.sendMessage({
    to:'+12409887757', // Any number Twilio can deliver to
    from: '+14158586858', // A number you bought from Twilio and can use for outbound communication
    body: 'word to your mother.' // body of the SMS message
}, function(err, responseData) { //this function is executed when a response is received from Twilio
    console.log(responseData);
    console.log(responseData.dateCreated);

    // Save information into mongoDB.
    // - responseData.dateCreated
    // - responseDate.from
    // - responseData.to
    // - responseData.body

    if (!err) {
        console.log(responseData);
    }
});

// Receive an SMS message.
// var receiveMessage = 