
var User = require('../models/user')
  , utils = require('../utils')

exports.getCurrentUser = function(req, res, next) {
    res.json(req.user);
}

exports.createUser = function(req, res, next) {    
    var phone = req.body.phone;
    User.create(phone, function(err, user, existed){
        if (err) return next(err);
        user.sendVerificationCode(function(err){
            if (err) return next(err);
            res.json(user);
        });
    });
}

exports.update = function(req, res, next) {
    var phone = req.body.phone;
    var name  = req.body.name;
    req.user.update(phone, name, function(err, user){
        if (err) return next(err);
        res.json(user);
    });
}

exports.verifyUser = function(req, res, next) {
    var code = req.body.code;
    var userId = req.params.id;
    User.verify(code, userId, function(err, user){
        if (err) return next(err);
        res.json({
            authToken: user.authToken
        });
    });
}

exports.lookupNumbers = function(req, res, next) {
    var numbers = req.body.numbers;
    User.lookupNumbers(numbers, function(err, users){
        if (err) return next(err);
        res.json(users);
    });
}