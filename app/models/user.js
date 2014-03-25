
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , BaseSchema = require('./_base')
  , utils = require('../utils')
  , _ = require('underscore')
  , SMS = require('../services/sms')

var UserSchema = BaseSchema.extend({
    authToken        : { type: String, default: utils.authToken, required: true, select: false, index: { unique: true }},
    phone            : { type: String, trim: true, set: setPhone, required: true, index: { sparse: true }},
    name             : { type: String, trim: true },
    verified         : { type: Boolean, default: false },
    verificationCode : { type: String, default: null, select: false }
});

UserSchema.pre('save', function(next){
    if (this.isModified('phone')) {
        this.verified = false;
    }
    next();
});

/*******************************/
/* STATIC FUNCTIONS
/*******************************/

_.extend(UserSchema.statics, {

    findByAuthToken: function(auth, next) {
        return User.findOne({ 
            'authToken': auth 
        }, next);
    }, 

    lookup: function(phoneOrId, next) {
        return User.findOne({
            $or : [{ _id: phoneOrId },
                   { phone: phoneOrId }]
        }, next);
    },

    lookupNumbers: function(numbers, next) {
        numbers = _.map(numbers, setPhone);
        return User.find({
            phone : { $in: numbers }
        }, next);
    },

    create: function(phone, next) {
        this.lookup(setPhone(phone), function(err, user){
            if (err) return next(err);
            if (user) return next(null, user, true);
            var data = {
                phone: phone
            }
            var user = new User(data);
            user.save(next);
        });
    },

    verify: function(code, userId, next) {
        var query = {
            _id: userId,
            verificationCode: code
        };
        User
            .findOne(query)
            .select('+authToken +verificationCode') 
            .exec(function(err, user){
                if (err) return next(err);
                if (!user) return next(new Error('User and verification code do not match'));
                user.verificationCode = null;
                user.verified = true;
                user.save(next);
            });
    }

});

_.extend(UserSchema.methods, {
    
    sendVerificationCode: function(next) {
        var code = phoneVerificationCode();
        this.verificationCode = code;
        this.save(function(err, user){
            if (err) return next(err);

            var text = 'Code: '+code+'\nEnter the code above to verify your phone number';
            SMS.sendText(user.phone, text, function(err){
                if (err) return next(err);
                next();
            });
        });
    },

    update: function(phone, name, next) {
        if (setPhone(phone)) {
            this.phone = setPhone(phone);
        }
        if (name && name.length) {
            this.name = name;
        }
        this.save(next);
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
        if (phone.length == 11 && phone.slice(0,1) == '1') {
            phone = phone.slice(1);
        }
    }
    return (phone && phone.length >= 10) ? phone : null;
}

function phoneVerificationCode() {
    return utils.randomNumberString(6);
}