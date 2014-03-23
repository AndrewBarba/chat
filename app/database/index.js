
var mongoose = require('mongoose')
  , config = require('../config')
  , utils = require('../utils')

module.exports = function(next, disconnect) {

    // Setup DB connection based on config file
    var dbOptions = {
        server: {
            socketOptions : { keepAlive : 1 } // keep the connection open even if inactive
        }
    };

    // connect to database
    mongoose.connect(config.db, dbOptions, next);

    // handle disconnect
    mongoose.connection.on('disconnected', function(err){
        if (disconnect) disconnect();
    });
}