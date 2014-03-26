
var utils = require('./utils');

module.exports = function(next) {
    
    utils.logger.info('Starting app...');

    // connect to the database
    require('./database')(function(err){
        
        // check for error conecting to database
        if (err) throw err

        utils.logger.info('Connected to database');

        // start the server
        var app = require('./server')(next);

        // open up sockets
        require('./sockets').open(app.server);

        // load all of the models
        app.models = require('./models')(app);

        // load all of the controllers
        app.controllers = require('./controllers')(app);
    });
}