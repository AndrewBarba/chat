
var User = require('../models/user')
  , utils = require('../utils')

exports.getCurrentUser = function(req, res, next) {
    res.json(req.user);
}

exports.createUser = function(req, res, next) {
    
    var email = req.body.email;
    var phone = req.body.phone;
    var first = req.body.firstName;
    var last  = req.body.lastName;

    User.create(phone, email, first, last, function(err, user){
        if (err) return next(err);
        res.json(201, user);
    });
}