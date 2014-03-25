
var prod = {
    db: 'mongodb://api:chat-api-password@oceanic.mongohq.com:10079/chat',
    twilio: {
        sid: 'AC444de0a850e8d0e457e3f8ae5b9e332b',
        token: '1dc58f02c00de870bbfd553826c7bf56'
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

var local = {
    db: 'mongodb://api:chat-api-password@oceanic.mongohq.com:10079/chat',
    twilio: {
        sid: 'AC444de0a850e8d0e457e3f8ae5b9e332b',
        token: '1dc58f02c00de870bbfd553826c7bf56'
    }
}

module.exports = dev;