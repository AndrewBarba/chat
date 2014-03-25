
var config = require('../config')
  , twilio = require('twilio')
  , client = twilio(config.twilio.sid, config.twilio.token);

exports.sendText = function(phone, message, next) {
    client.sms.messages.create({
        from: config.twilio.number,
        to: phone,
        body: message
    }, next);
}