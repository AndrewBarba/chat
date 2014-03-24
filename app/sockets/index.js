var _ = require('underscore')
  , ws = require('ws')
  , WebSocketServer = ws.Server
  , utils = require('../utils')
  , User = require('../models/user')

var WS = null;
var VERIFIERS = {};

function TLWebSocket(path, verify) {
    var _this = this;

    this.path = path;

    this.verify = verify;

    this.sockets = {};

    this.ws = WS;

    this.ws.on('connection', function(ws){
        var path = parsePath(ws.upgradeReq.url);
        if (_this.path == path) {
            var user = ws.upgradeReq.user;
            if (!_this.sockets[user.id]) {
                _this.sockets[user.id] = [];
            } 
            _this.sockets[user.id].push(ws);
            utils.logger('New Socket Connection: '+path+' '+user.id);
        }
    });

    this.send = function(id, data) {
        var sockets = this.sockets[id];
        _.each(sockets, function(socket){
            send(socket, data);
        });
    }

    this.broadcast = function(data) {
        _.each(this.sockets, function(sockets, id){
            _.each(sockets, function(socket){
                send(socket, data);
            });
        });
    }
}

exports.open = function(server) {
    WS = new WebSocketServer({
        server: server,
        verifyClient: function(info, next){
            var auth = parseAuth(info.req.url);
            var path = parsePath(info.req.url);

            if (!auth || !auth.length || !path || !path.length) {
                return next(0);
            }

            User.findByAuthToken(auth, function(err, user){ 
                if (user) {
                    info.req.user = user;
                    var verifier = VERIFIERS[path];
                    verifier(info.req, null, function(err){
                        next(!err);
                    });
                } else {
                    next(0);
                }
            });
        }
    });
}

exports.listen = function(path, verify, controller) {
    VERIFIERS[path] = verify || function(){};
    var TLWS = new TLWebSocket(path, verify);
    controller(TLWS);
}

/*********************
/* HELPERS
/*********************/

function send(ws, data) {
    if (ws && ws.readyState == 1) {
        ws.send(JSON.stringify(data));
    }
}

function parseAuth(url) {
    var matches = url.match(/auth=[A-Za-z0-9]+/);
    if (!matches) return null;
    var match = matches[0];
    if (match) {
        return match.split("=")[1];
    }
    return "";
}

function parsePath(url) {
    return url.split("?")[0];
}


