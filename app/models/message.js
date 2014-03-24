var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')
  , _ = require('underscore')
  , History = require('./history')

var scheme = {
    to: { type: String, ref: 'User', index: true, required: true },
    from: { type: String, ref: 'User', index: true, required: true },
    message: { type: String, trim: true, required: true },
    received: { type: Boolean, default: false },
    read: { type: Boolean, default: false }
}

var MessageSchema = BaseSchema.extend(scheme);

MessageSchema.pre('save', function(next){
    if (this.isNew) {
        History.logMessage(this, 'send', next);
    } else if (this.isModified('received')) {
        History.logMessage(this, 'received', next);
    } else if (this.isModified('read')) {
        History.logMessage(this, 'read', next);
    } else {
        next();
    }
});

_.extend(MessageSchema.statics, {
    create: function(to, from, message, next) {
        var data = {
            'to': to,
            'from': from,
            'message': message
        };

        var message = new Message(data);
        message.save(next);
    }
});

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
