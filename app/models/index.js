
var utils = require('../utils');

module.exports = function(app) {
    var models = utils.loadFiles(__dirname);
    return models;
}