
var config = require('../config')
  , twilio = require('twilio')
  , client = twilio(config.twilio.sid, config.twilio.token);

exports.sendText = function(phone, message, next) {
    if (process.env.NODE_ENV != 'local') {
        client.sms.messages.create({
            from: config.twilio.number,
            to: phone,
            body: message
        }, next);
    } else {
        next();
    }
}