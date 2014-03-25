var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')
  , _ = require('underscore')

var ACTIONS = [ 'send', 'read', 'received' ];

var scheme = {
    message: { type: Object },
    action: { type: String, enum: ACTIONS }
}

var HistorySchema = BaseSchema.cappedSchema(scheme, (64 * 1024 * 1024)); // 64 megabytes

_.extend(HistorySchema.statics, {

    logMessage: function(message, action, next) {
        message.populate('from to', function(err, doc){
            var history = new History({
                message: doc.toObject(),
                action: action
            });
            console.log(doc);
            history.save(next);
        });
    },

    stream: function(){
        var now = Date.now();
        var stream = this
                        .find({created:{$gt:now}})
                        .tailable()
                        .stream(); // start with events in last hour
        return stream;
    }
});

_.extend(HistorySchema.methods, {

    notify: function(socket) {
        var message = this.toObject().message;
        if (this.action == 'send') {
            socket.send(message.to, message);
            socket.send(message.from, message);
        } else if (this.action == 'received') {
            socket.send(message.from, message);
        } else if (this.action == 'read') {
            socket.send(message.from, message);
        }
    }
});

var History = mongoose.model('History', HistorySchema);
module.exports = History;
