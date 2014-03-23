
var express = require('express')
  , http = require('http')
  , utils = require('../utils')

module.exports = function() {

    // create express app
    var app = express();
    var server = http.createServer(app);

    // start WebSockets
    require('./app/services/sockets').init(server);

    // Start the server
    var port = process.env.PORT || 3000;
    server.listen(port, function() {
        
    });

    return app;
}