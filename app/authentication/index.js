
var Errors = require('../errors')
  , User = require('../models/user')

var getUser = function(req, res, next) {
    var auth = req.body.auth || req.query.auth;
    if (auth && auth.length) {
        User.findByAuthToken(auth, function(err, doc){
            if (err) return next(err);
            req.user = doc ? doc.toObject() : {};
            next();
        });
    } else {
        req.user = {};
        next();
    }
}

var requireUser = function(req, res, next) {
    var user = req.user;
    if (!user || !user.id) {
        return Errors.UnauthorizedError(res);
    } else {
        next();
    }
}

var requireVerifiedUser = function(req, res, next) {
    requireUser(req, res, function(){
        if (!req.user.isVerified) {
            return Errors.UnauthorizedError(res);
        } else {
            next();
        }
    });
}

module.exports = {
    getUser: getUser,
    requireUser: requireUser,
    requireVerifiedUser: requireVerifiedUser
}