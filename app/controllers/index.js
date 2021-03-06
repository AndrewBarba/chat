
var utils = require('../utils')
  , User = require('../models/user')
  , sockets = require('../sockets')
  , auth = require('../authentication')
  , rateLimit = require('../services/ratelimit')
  , Errors = require('../errors')
  , multipart = require('connect-multiparty')

module.exports = function(app) {

    // load all controllers
    var controllers = utils.loadFiles(__dirname);

    // rate limit requests based on auth token
    app.use(authRateLimit());

    // attempt to add user to all requests
    app.use(auth.getUser);

    // root
    app.get('/', controllers.root.index);
    app.get('/status', controllers.root.status);

    // messages
    app.post('/message', auth.requireVerifiedUser, controllers.message.sendMessage);
    app.put('/message/received', auth.requireUser, controllers.message.markMessagesRecieved);
    app.put('/message/read', auth.requireUser, controllers.message.markMessagesRead);
    app.get('/message/new', auth.requireUser, controllers.message.getUnreadMessages);
    app.get('/message/user/:id', auth.requireUser, controllers.message.getMessagesFromUser);

    // user
    app.get('/user', auth.requireUser, controllers.user.getCurrentUser);
    app.put('/user', auth.requireUser, controllers.user.update);
    app.post('/user', controllers.user.createUser);
    app.put('/user/:id/verify', controllers.user.verifyUser);
    app.post('/user/lookup', auth.requireVerifiedUser, controllers.user.lookupNumbers);

    // upload files
    app.post('/upload', auth.requireVerifiedUser, multipart(), controllers.upload.upload);

    // message stream
    sockets.listen('/message', auth.requireUser, controllers.message.messageStream);

    // respond to 404's
    app.use(function(req, res, next){
        Errors.NotFoundError(res);
    });

    // error handling
    app.use(function(err, req, res, next){
        var code = err.statusCode || 500;
        Errors.error(code, res, err.message, err.stack);
    });

    return controllers;
}

/*******************/
/* HELPERS
/*******************/

function authRateLimit() {
    return rateLimit(10, function(req, next){
        var auth = req.query.auth || req.body.auth;
        if (auth && auth.length) {
            next(auth);
        } else {
            next(true);
        }
    });
}
