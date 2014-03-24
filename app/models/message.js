var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')
  , _ = require('underscore')
  , History = require('./history')
  , User = require('./user')

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
    create: function(to, from, text, next) {
        User.count({_id:to}, function(err, count){
            if (err) return next(err);
            if (count <= 0) return next(new Error('Recipient not found'));

            var message = new Message({
                to: to,
                from: from,
                message: text
            });
            message.save(next);
        });
    },

    markReceived: function(messageId, userId, next) {
        var query = { _id: messageId, to: userId };
        var update = { received: true };
        Message.findOneAndUpdate(query, update, function(err, doc){
            if (err) return next(err);
            if (!doc) return next(new Error('You must be the reciever to mark a message as received'));
            History.logMessage(doc, 'received', function(err){
                next(null, doc);
            });
        });
    },

    markRead: function(messageId, userId, next) {
        var query = { _id: messageId, to: userId };
        var update = { read: true };
        Message.findOneAndUpdate(query, update, function(err, doc){
            if (err) return next(err);
            if (!doc) return next(new Error('You must be the reciever to mark a message as read'));
            History.logMessage(doc, 'read', function(err){
                next(null, doc);
            });
        });
    }
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
