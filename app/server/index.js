
var express = require('express')
  , http = require('http')
  , utils = require('../utils')

module.exports = function() {

    // create express app
    var app = express();
    var server = http.createServer(app);

    // default middle ware
    app.use(defaultHeaders);

    // Start the server
    var port = process.env.PORT || 3000;
    server.listen(port, function() {
        utils.logger('Listening on port: '+port)
    });

    return app;
}

function defaultHeaders(req, res, next) {
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    next();
}