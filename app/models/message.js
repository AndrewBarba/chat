var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')
  , Errors = require('../errors')
  , _ = require('underscore')
  , History = require('./history')
  , User = require('./user')
  , async = require('async')

var scheme = {
    to: { type: String, ref: 'User', index: true, required: true },
    from: { type: String, ref: 'User', index: true, required: true },
    message: { type: String, trim: true, required: true },
    received: { type: Boolean, default: false, index: true },
    read: { type: Boolean, default: false, index: true },
    attachment: { type: String, trim: true } // url to attached file
}

var MessageSchema = BaseSchema.extend(scheme);

MessageSchema.pre('save', function(next){
    if (this.isNew) {
        History.logMessage(this, 'send', next);
    } else if (this.isModified('read')) {
        History.logMessage(this, 'read', next);
    } else if (this.isModified('received')) {
        History.logMessage(this, 'received', next);
    } else {
        next();
    }
});

_.extend(MessageSchema.statics, {
    create: function(toId, from, text, next, attachment) {
        if (!from.verified) {
            return next(Errors.init(401, 'You must be a verified user.'));
        }
        User.findOne({_id:toId}, function(err, user){
            if (err) return next(err);
            if (!user) return next(Errors.init(400, 'Recipient not found'));

            var message = new Message({
                to: user,
                from: from,
                message: text,
                attachment: attachment
            });
            message.save(next);
        });
    },

    markReceived: function(messageIds, userId, next) {
        var query = { to: userId, _id : { $in: messageIds } };
        Message.find(query, function(err, docs){
            if (err) return next(err);
            if (!docs) return next(Errors.init(400, 'You must be the reciever to mark a message as read'));
            async.each(docs, function(doc, done){
                doc.received = true;
                doc.save(done);
            }, function(err){
                if (err) return next(err);
                next(null, docs);
            });
        });
    },

    markRead: function(messageIds, userId, next) {
        var query = { to: userId, _id : { $in: messageIds } };
        Message.find(query, function(err, docs){
            if (err) return next(err);
            if (!docs) return next(Errors.init(400, 'You must be the reciever to mark a message as read'));
            async.each(docs, function(doc, done){
                doc.received = true;
                doc.read = true;
                doc.save(done);
            }, function(err){
                if (err) return next(err);
                next(null, docs);
            });
        });
    }
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;

