var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , extend = require('mongoose-schema-extend')
  , utils = require('../utils')

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

var BaseSchema = new mongoose.Schema(base_data);

BaseSchema.cappedSchema = function(data, size, options) {
  var scheme = _.extend({}, base_data, data);
  if (!options) options = {};
  return new mongoose.Schema(scheme, _.extend(options, {capped:size}));
}


/* =========================================================================
 *   
 *   Options
 *   
 * ========================================================================= */

BaseSchema.set('toObject', { 
    getters: true, 
    virtuals: true 
});

BaseSchema.set('toJSON', {
    virtuals: true,
    getters: true,
    hide: ['__v', '__t'] // fields to hide
});

BaseSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.modified = Date.now();
    }
    next();
});

_.extend(BaseSchema.statics, {
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
})

 /* =========================================================================
 *   
 *   Private functions
 *   
 * ========================================================================= */

function getDate(date) {
    if (typeof date === 'number') return date;
    return date ? date.getTime() : null;
}

function setDate(date) {
    var saveDate = date;
    if (typeof date !== 'object') saveDate = new Date(date);
    return saveDate;
}

// BaseSchema.dataScheme = base_data;
module.exports = BaseSchema;