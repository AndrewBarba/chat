
var _ = require('underscore');

var prod = {
    db: 'mongodb://api:chat-api-password@oceanic.mongohq.com:10079/chat',
    twilio: {
        sid: 'AC444de0a850e8d0e457e3f8ae5b9e332b',
        token: '1dc58f02c00de870bbfd553826c7bf56',
        number: '+18183224563'
    }
}

var dev = {
    db: 'mongodb://api:chat-api-password@oceanic.mongohq.com:10079/chat',
    twilio: {
        sid: 'AC444de0a850e8d0e457e3f8ae5b9e332b',
        token: '1dc58f02c00de870bbfd553826c7bf56',
        number: '+18183224563'
    }
}

var local = _.extend({}, dev, {
    db: 'mongodb://localhost/chat-local',
});

var config = {
    'production': prod,
    'development': dev,
    'local': local
}

var env = process.env.NODE_ENV || 'development';
module.exports = config[env];