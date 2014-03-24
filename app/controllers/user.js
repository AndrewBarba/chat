
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

exports.requestVerificationCode = function(req, res, next) {
    req.user.requestVerificationCode(function(err){
        if (err) return next(err);
        res.json({status:'success'});
    });
}

exports.verifyUser = function(req, res, next) {
    var code = req.body.code;
    req.user.verify(code, function(err, user){
        if (err) return next(err);
        res.json(user);
    });
}