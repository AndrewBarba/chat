
var utils = require('./utils');

module.exports = function() {
    
    // connect to the database
    require('./database')(function(err){
        
        // check for error conecting to database
        if (err) throw err

        utils.logger.info('Connected to database');

        // start the server
        var app = require('./server')();

    }, function(err){
        utils.logger.error('Lost connection to databse');
    });
}