
var error = function(code, res, message, data) {
    var e = {
        'error': message
    }
    if (data) {
        e['data'] = data;
    }
    return res.json(code, e);
}

var badRequestError = function(res, message, data) {
    message = message || 'Bad request error';
    return error(400, res, message, data);
}

var notFoundError = function(res, message, data) {
    message = message || 'Not found';
    return error(404, res, message, data);
}

var unauthorizedError = function(res, message, data) {
    message = message || 'Unauthorized';
    return error(401, res, message, data);
}

module.exports = {
    Error: error,
    BadRequestError: badRequestError,
    NotFoundError: notFoundError,
    UnauthorizedError: unauthorizedError
}