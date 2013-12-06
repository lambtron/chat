//require the Twilio module and create a REST client
var client = require('twilio')(process.env.TWILIO_ASID, process.env.TWILIO_AUTH_TOKEN);

// Send an SMS text message
module.exports = {
    sendMessage: function(to, from, body) {
        client.sendMessage({
            to: to,
            from: from,
            body: body
        }, function(err, responseData) {
            if (!err) {
                console.log(responseData);
            };
        });
    }
}