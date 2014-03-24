var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')
  , _ = require('underscore')

var UserSchema = BaseSchema.extend({
    authToken   : { type: String, default: utils.authToken, required: true, select: false, index: { unique: true }},
    phone       : { type: String, trim: true, set: setPhone, required: true, index: { sparse: true }},
    email       : { type: String, trim: true, set: setEmail, lowercase: true, index: { sparse: true }},
    firstName   : { type: String, trim: true },
    lastName    : { type: String, trim: true },
    verified    : { 
        phone: { type: Boolean, default: false },
        code: { type: String, trim: true, default: null, select: false }
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
        return this.verified.phone;
    });

/*******************************/
/* STATIC FUNCTIONS
/*******************************/

_.extend(UserSchema.statics, {

    findByAuthToken: function(auth, next) {
        return User
                 .findOne({ 'authToken':auth })
                 .select('+verified.code')
                 .exec(next);
    }, 

    findByPhone: function(phone, next) {
        return User.findOne({ 'phone':phone }, next);
    }, 

    isVerified: function(phone, next) {
        var query = {
            'phone': phone,
            'verified.phone': true
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

_.extend(UserSchema.methods, {
    
    requestVerificationCode: function(next) {
        var code = phoneVerificationCode();
        this.verified.code = code;
        this.save(function(err){
            if (err) return next(err);
            // send code via sms
            next();
        });
    },

    verify: function(code, next) {
        if (this.verified.code == code) {
            this.verified.phone = true;
            this.verified.code = null;
            this.save(next);
        } else {   
            return next(new Error('The codes do not match'));
        }
    }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

/*******************************/
/* PRIVATE FUNCTIONS
/*******************************/

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

function phoneVerificationCode() {
    return utils.randomNumberString(6);
}