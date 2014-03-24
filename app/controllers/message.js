
var Message = require('../models/message')
  , User = require('../models/user')
  , utils = require('../utils')
  , History = require('../models/history')

exports.messageStream = function(socket) {
    History
        .stream()
        .on('data', function (history) {
            history.notify(socket);   
        })
        .on('error', function (err) {
            utils.logger.error(err);
        })
        .on('close', function () { 
            utils.logger('Message stream closed')
        });
}

exports.getUnreadMessages = function(req, res, next) {

    var userId = req.user.id;

    Message
        .find({ to: userId, read: false })
        .sort('created')
        .exec(function(err, docs){
            if (err) return next(err);
            res.json(docs);
        });
}

exports.getMessagesFromUser = function(req, res, next) {
    
    var id = req.user.id;
    var userId = req.params.id;

    Message
        .find({ to: id, from: userId })
        .limit(50)
        .sort('created')
        .exec(function(err, docs){
            if (err) return next(err);
            res.json(docs);
        });
}

exports.sendMessage = function(req, res, next) {

    var from = req.user.id;
    var text = req.body.message;
    var to = req.body.to;

    Message.create(to, from, text, function(err, doc){
        if (err) return next(err);
        res.json(201, doc);
    });
}

exports.messageRecieved = function(req, res, next) {
    var messageId = req.params.id;
    Message.markReceived(messageId, req.user.id, function(err, doc){
        if (err) return next(err);
        res.json(doc);
    });
}

exports.messageRead = function(req, res, next) {
    var messageId = req.params.id;
    Message.markRead(messageId, req.user.id, function(err, doc){
        if (err) return next(err);
        res.json(doc);
    });
}