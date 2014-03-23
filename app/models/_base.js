var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  // , extend = require('mongoose-schema-extend')
  , utils = require('../utils')

var OPTIONS = {
    virtuals: true,
    getters: true,
    hide: ['__v', '__t', '_id'] // fields to hide
}

/* =========================================================================
 *   
 *   Schema
 *   
 * ========================================================================= */

var base_data = {
  _id       : { type: String, default: utils.objectId, index: { unique: true } },
  modified  : { type: Date, default: Date.now, set: setDate },
  created   : { type: Date, default: Date.now, set: setDate, index: true }
};

exports.extend = function(data) {

    var scheme = _.extend({}, base_data, data);
    var Schema = new mongoose.Schema(scheme, defaultOptions());

    Schema.pre('save', function(next) {
        if (this.isModified()) {
            this.modified = Date.now();
        }
        next();
    });

    Schema.set('toJSON', OPTIONS);
    Schema.set('toObject', OPTIONS);

    _.extend(Schema.statics, {
        stream: function(options){
            if (!this.streamSchema) return null;

            if (!options) {
                var now = new Date();
                options = { 'created' : { $gt : now }};
            }

            var stream = this.streamSchema
                            .find(options)
                            .tailable()
                            .stream(); // start with events in last hour
            return stream;
        }
    });

    return Schema;
}

exports.cappedSchema = function(data, size, options) {
    var scheme = _.extend({}, base_data, data);
    options = _.extend({capped:size}, defaultOptions(), options);
    var Schema = new mongoose.Schema(scheme, options);
    return Schema;
}

 /* =========================================================================
 *   
 *   Private functions
 *   
 * ========================================================================= */

function defaultOptions() {
    return {
        toJSON: OPTIONS,
        toObject: OPTIONS
    }
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
