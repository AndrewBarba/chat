
var fs = require('fs') 
  , _ = require('underscore')
  , async = require('async')
  , Errors = require('../errors');

var SIZE_LIMIT = 1048576 * 8; // 8 megabytes

exports.upload = function(req, res, next) {

    var data = req.files ? req.files.file : null;
    if (!data) {
        return cleanUp(req.files, function(err){
            if (err) return next(err);
            Errors.BadRequestError(res, 'No file found to upload');
        });
    }

    if (data.size > SIZE_LIMIT) {
        return cleanUp(req.files, function(err){
            if (err) return next(err);
            Errors.BadRequestError(res, 'Image is larger than the 8MB size limit');
        });
    }

    cleanUp(req.files, function(err){
        if (err) return next(err);
        Errors.BadRequestError(res, 'This endpoint is still in development');
    });
}

function cleanUp(files, next) {
    async.each(files, function(file, done){
        fs.unlink(file.path, done);
    }, next);
}