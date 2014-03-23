
var utils = require('../utils')
  , User = require('../models/user')
  , sockets = require('../sockets')
  , auth = require('../authentication')

module.exports = function(app) {

    // load all controllers
    var controllers = utils.loadFiles(__dirname);

    // attempt to add user to all requests
    app.use(auth.getUser);

    // root
    app.get('/', controllers.root.root);
    app.get('/status', controllers.root.status);

    // messages
    app.post('/message', auth.requireUser, controllers.message.sendMessage);
    app.put('/message/:id/received', auth.requireUser, controllers.message.messageRecieved);
    app.put('/message/:id/received', auth.requireUser, controllers.message.messageRead);
    app.get('/message/new', auth.requireUser, controllers.message.getUnreadMessages);

    // message stream
    sockets.listen('/message', auth.requireUser, controllers.message.messageStream);

    // respond to 404's
    app.use(function(req, res, next){
        res.json(404, { 'status': 'Not found' });
    });

    return controllers;
}
