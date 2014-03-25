
var init = function(code, message) {
    var err = new Error(message);
    err.statusCode = code || 500;
    return err;
}

var error = function(code, res, message, data) {
    var e = {
        'error': message
    }
    if (data) {
        e['data'] = data;
    }
    return res.json(code, e);
}

var serverError = function(res, message, data) {
    message = message || 'Server error';
    return error(500, res, message, data);
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

var busyError = function(res, message, data) {
    message = message || 'Server busy';
    return error(503, res, message, data);
}

module.exports = {
    init: init,
    error: error,
    ServerError: serverError,
    BadRequestError: badRequestError,
    NotFoundError: notFoundError,
    UnauthorizedError: unauthorizedError,
    BusyError: busyError
}