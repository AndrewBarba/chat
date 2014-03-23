
var utils = require('../utils');

module.exports = function() {
    var models = utils.loadFiles(__dirname);
    return models;
}