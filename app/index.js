
var utils = require('./utils');

module.exports = function() {
    
    // connect to the database
    require('./database')(function(err){
        
        // check for error conecting to database
        if (err) throw err

        utils.logger.info('Connected to database');

        // start the server
        var app = require('./server')();

        // load all of the models
        require('./models')();

        // load all of the controllers
        require('./controllers')(app);

    }, function(err){
        utils.logger.error('Lost connection to databse');
    });
}