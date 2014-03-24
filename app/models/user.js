var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')
  , _ = require('underscore')

var UserSchema = BaseSchema.extend({
    authToken   : { type: String, default: utils.authToken, required: true, select: false, index: { unique: true }},
    phone       : { type: String, trim: true, set: setPhone, index: { sparse: true }},
    email       : { type: String, trim: true, set: setEmail, lowercase: true, index: { sparse: true }},
    firstName   : { type: String, trim: true },
    lastName    : { type: String, trim: true },
    facebook: {
        id    : { type: String, index: { unique: true, sparse: true }},
        token : { type: String, select: false }
    },
    twitter: {
        id    : { type: String, index: { unique: true, sparse: true }},
        token : { type: String, select: false }
    },
    google: {
        id    : { type: String, index: { unique: true, sparse: true }},
        token : { type: String, select: false }
    },
    verified: { 
        email    : { type: Boolean, default: false },
        phone    : { type: Boolean, default: false },
        twitter  : { type: Boolean, default: false },
        facebook : { type: Boolean, default: false },
        google   : { type: Boolean, default: false }
    }
});

/*******************************/
/* VIRTUAL FUNCTIONS
/*******************************/

UserSchema
    .virtual('name')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });

UserSchema
    .virtual('isVerified')
    .get(function() {
        return this.verified.email    || 
               this.verified.phone    ||
               this.verified.facebook ||
               this.verified.twitter  ||
               this.verified.google;  
    });

/*******************************/
/* STATIC FUNCTIONS
/*******************************/

_.extend(UserSchema.statics, {

    findByAuthToken: function(auth, next) {
        return User.findOne({ 'authToken':auth }, next);
    }, 

    findByPhone: function(phone, next) {
        return User.findOne({ 'phone':phone }, next);
    }, 

    findByEmail: function(email, next) {
        return User.findOne({ 'email':email }, next);
    },

    isEmailVerified: function(email, next) {
        var query = {
            'email': email,
            '$or': getVerifyQuery()
        }
        return User.count(query, function(err, count){
            if (err) return next(err);
            next(null, (count > 0));
        });
    },

    isPhoneVerified: function(phone, next) {
        var query = {
            'phone': phone,
            '$or': getVerifyQuery()
        }
        return User.count(query, function(err, count){
            if (err) return next(err);
            next(null, (count > 0));
        });
    },

    create: function(phone, email, first, last, next) {
        var data = {
            phone: phone,
            email: email,
            firstName: first,
            lastName: last
        }
        var user = new User(data);
        user.save(next);
    }

});

var User = mongoose.model('User', UserSchema);
module.exports = User;

/*******************************/
/* PRIVATE FUNCTIONS
/*******************************/

function getVerifyQuery() {
    return [{ 'verified.email'    : true },
            { 'verified.phone'    : true },
            { 'verified.facebook' : true },
            { 'verified.twitter'  : true },
            { 'verified.google'   : true }]
}

function setEmail(email) {
    return utils.isValidEmail(email) ? email.toLowerCase() : null;
}

function setPhone(phone) {
    if (phone) {
        phone = phone.replace(/\D/g,'').trim();
        if (phone.length == 11 && phone.slice(0,1) == "1") {
            phone = phone.slice(1);
        }
    }
    return (phone && phone.length >= 10) ? phone : null;
}