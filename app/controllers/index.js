
var utils = require('../utils')
  , User = require('../models/user')
  , sockets = require('../sockets')
  , auth = require('../authentication')
  , Errors = require('../errors')

module.exports = function(app) {

    // load all controllers
    var controllers = utils.loadFiles(__dirname);

    // attempt to add user to all requests
    app.use(auth.getUser);

    // root
    app.get('/', controllers.root.root);
    app.get('/status', controllers.root.status);

    // messages
    app.post('/message', auth.requireVerifiedUser, controllers.message.sendMessage);
    app.put('/message/:id/received', auth.requireUser, controllers.message.messageRecieved);
    app.put('/message/:id/read', auth.requireUser, controllers.message.messageRead);
    app.get('/message/new', auth.requireUser, controllers.message.getUnreadMessages);

    // user
    app.get('/user', auth.requireUser, controllers.user.getCurrentUser);
    app.post('/user', controllers.user.createUser);

    // message stream
    sockets.listen('/message', auth.requireUser, controllers.message.messageStream);

    // respond to 404's
    app.use(function(req, res, next){
        return Errors.NotFoundError(res);
    });

    return controllers;
}
