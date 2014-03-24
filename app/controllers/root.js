
exports.index = function(req, res, next) {
    res.json({ 
        'app': 'chat', 
        'time': Date.now() 
    });
}

exports.status = function(req, res, next) {
    res.json({ 
        'status': 'OK' 
    });
}