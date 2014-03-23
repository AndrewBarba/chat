var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')

var scheme = {
    to: { type: String, ref: 'User', index: true, required: true },
    from: { type: String, ref: 'User', index: true, required: true },
    message: { type: String, trim: true, required: true },
    received: { type: Boolean, default: false },
    read: { type: Boolean, default: false }
}

var MessageSchema = BaseSchema.extend(scheme);
var MessageCappedSchema = BaseSchema.cappedSchema(scheme, (64 * 1024 * 1024)); // 64 megabytes

var MessageStream = mongoose.model('MessageStream', MessageCappedSchema);
var Message = mongoose.model('Message', MessageSchema);
Message.streamSchema = MessageStream;

module.exports = Message;
