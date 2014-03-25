
var express = require('express')
  , bodyParser = require('body-parser')
  , http = require('http')
  , utils = require('../utils')
  , rateLimit = require('../services/ratelimit')

module.exports = function() {

    // create express app
    var app = express();

    // default middle ware
    app.use(rateLimit(10));
    app.use(defaultHeaders);

    // parse request body
    app.use(bodyParser()); 

    // Start the server
    var server = http.createServer(app);
    var port = process.env.PORT || 3000;
    server.listen(port, function() {
        utils.logger('Listening on port: '+port)
    });

    app.server = server;
    return app;
}

function defaultHeaders(req, res, next) {
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    next();
}