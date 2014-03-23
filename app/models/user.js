var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')
  , _ = require('underscore')

var UserSchema = BaseSchema.extend({
    authToken   : { type: String, default: utils.authToken, required: true, select: false, index: { unique: true }},
    phone       : { type: String, trim: true, set: setPhone, index: { unique: true, sparse: true }},
    email       : { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true }},
    firstName   : { type: String, trim: true },
    lastName    : { type: String, trim: true }
});

/*******************************/
/* VIRTUAL FUNCTIONS
/*******************************/

UserSchema
    .virtual('name')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });

/*******************************/
/* STATIC FUNCTIONS
/*******************************/

_.extend(UserSchema.statics, {

    findByAuthToken: function(auth, next) {
        return User.findOne({ 'auth':auth }, next);
    }, 

    findByPhone: function(phone, next) {
        return User.findOne({ 'phone':phone }, next);
    }, 

    findByEmail: function(email, next) {
        return User.findOne({ 'email':email }, next);
    }

});

var User = mongoose.model('User', UserSchema);
module.exports = User;

/*******************************/
/* PRIVATE FUNCTIONS
/*******************************/

function setPhone(phone) {
    if (phone) {
        phone = phone.replace(/\D/g,'').trim();
        if (phone.length == 11 && phone.slice(0,1) == "1") {
            phone = phone.slice(1);
        }
    }
    return (phone && phone.length >= 10) ? phone : null;
}