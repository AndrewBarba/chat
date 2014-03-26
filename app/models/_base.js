var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , utils = require('../utils')

var BASE_SCHEME = {
    _id       : { type: String, default: utils.objectId, index: { unique: true } },
    created   : { type: Date, default: Date.now, set: setDate, get: getDate, index: true }
}

var HIDE = [ '__v', '__t', '_id' ];

var OPTIONS = {
    virtuals: true,
    getters: true,
    transform: function(doc, ret, options) {
        var hide = HIDE.concat(doc.getHideKeys());
        hide.forEach(function(key){
            delete ret[key]
        });
    }
}

/* =========================================================================
 *   
 *   Schema
 *   
 * ========================================================================= */

function getSchema(data, options) {
    
    // build schema
    var scheme = _.extend({}, BASE_SCHEME, data);
    var schema = new Schema(scheme, defaultOptions(options));

    _.extend(schema.methods, {
        getHideKeys: function() {
            return []; // override
        }
    });

    return schema;
}

exports.extend = function(data, options) {
    var schema = getSchema(data, options);
    return schema;
}

exports.cappedSchema = function(data, size, options) {
    var schema = getSchema(data, _.extend({capped:size}, options));
    return schema;
}

/* =========================================================================
 *   
 *   Private functions
 *   
 * ========================================================================= */

function defaultOptions(options) {
    return _.extend({
        toJSON: OPTIONS,
        toObject: OPTIONS
    }, options);
}

function getDate(date) {
    if (typeof date === 'number') return date;
    return date ? date.getTime() : null;
}

function setDate(date) {
    var saveDate = date;
    if (typeof date !== 'object') saveDate = new Date(date);
    return saveDate;
}
