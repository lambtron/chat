//require the Twilio module and create a REST client
var client = require('twilio')('ACad465e648f6f424ea9293be34818ebf9', 'be9ed87202b81e218b26e5423f7b6367');

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