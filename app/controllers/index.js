
var utils = require('../utils')
  , User = require('../models/user')
  , sockets = require('../sockets')

module.exports = function(app) {

    // load all controllers
    var controllers = utils.loadFiles(__dirname);

    // attempt to add user to all requests
    app.use(getUser);

    // root
    app.get('/', controllers.root.root);
    app.get('/status', controllers.root.status);

    // messages
    app.post('/message', controllers.message.sendMessage);
    app.put('/message/:id/received', controllers.message.messageRecieved);
    app.put('/message/:id/received', controllers.message.messageRead);
    app.get('/message/new', controllers.message.getUnreadMessages);

    // message stream
    sockets.listen('/message', null, controllers.message.messageStream);

    // respond to 404's
    app.use(function(req, res, next){
        res.json(404, { 'status': 'Not found' });
    });

    return controllers;
}

function getUser(req, res, next) {
    var auth = req.query.auth;
    if (auth) {
        User.findByAuthToken(auth, function(err, doc){
            if (err) return next(err);
            req.user = doc || {};
            next();
        });
    } else {
        req.user = {};
        next();
    }
}