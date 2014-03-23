
exports.getUser = function(req, res, next) {
    var auth = req.body.auth || req.query.auth;
    if (auth && auth.length) {
        User.findByAuthToken(auth, function(err, doc){
            if (err) return next(err);
            req.user = doc || {};
            next();
        });
    } else {
        req.user = {};
        next();
    }
}

exports.requireUser = function(req, res, next) {
    var user = req.user;
    if (!user || !user.id) {
        return res.json(401, {'status':'You are not authorized.'});
    } else {
        next();
    }
}