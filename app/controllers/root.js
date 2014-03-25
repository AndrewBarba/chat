
var mongoose = require('mongoose')
  , Errors = require('../errors')

exports.index = function(req, res, next) {
    res.json({ 
        'app': 'chat', 
        'time': Date.now() 
    });
}

exports.status = function(req, res, next) {

    // check if we are connected to mongohq
    var connected = mongoose.connection.readyState == 1;

    if (connected) {
        res.json({ 
            'status' : 'OK',
            'environment' : process.env.NODE_ENV,
            'node' : process.version,
            'database' : mongoose.connection.db.databaseName
        });
    } else {
        Errors.ServerError(res, 'Lost connection to database');
    }
}