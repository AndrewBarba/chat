process.env.TZ = 'UTC'; // force UTC timezone
process.env.NODE_ENV = 'local';

var should = require('should')
  , app = require('../app')
  , utils = require('../app/utils')
  , mongoose = require('mongoose')
  , Errors = require('../app/errors')
  , config = require('../app/config')
  , async = require('async')
  , _ = require('underscore');

/*****************************
        TEMPLATE DATA
******************************/

// user 1
var u1 = null;
var u1_auth = null;
var u1_phone = '9085667524';
var u1_name = 'Andrew Barba';

// user 2
var u2 = null;
var u2_phone = '5550005555';
var u2_name = 'Test test';

// message 1
var m1 = null;
var m1_text = 'test 1';

/*****************************
             TESTS
******************************/

describe('Chat Test', function(){

    var User, Message, History;

    before(function(done){
        app(function(app){
            User = app.models.user;
            Message = app.models.message;
            History = app.models.history;
            done();
        });
    });

    // after(function(done){
    //     mongoose.connection.db.dropDatabase(done);
    // });

    // Database
    describe('Database Tests', function(){
        it('should be conntected to the database', function(){
            mongoose.connection.readyState.should.equal(1);
        });
    });

    // User
    describe('User Tests', function(){

        describe('Create', function(){
            it('should create a user', function(done){
                User.create(u1_phone, function(err, user){
                    should.not.exist(err);
                    should.exist(user);
                    should.not.exist(user.authToken);
                    user.phone.should.equal(u1_phone);
                    u1 = user;
                    done();
                });
            });

            it('should find existing user', function(done){
                User.create(u1_phone, function(err, user){
                    should.not.exist(err);
                    should.exist(user);
                    should.not.exist(user.authToken);
                    user.phone.should.equal(u1.phone);
                    user.id.should.equal(u1.id);
                    done();
                });
            });

            it('should create a seconduser', function(done){
                User.create(u2_phone, function(err, user){
                    should.not.exist(err);
                    should.exist(user);
                    should.not.exist(user.authToken);
                    user.phone.should.equal(u2_phone);
                    user.id.should.not.equal(u1.id);
                    u2 = user;
                    done();
                });
            });
        });

        describe('Lookup', function(){
            it('should find user by phone', function(done){
                User.lookup(u1_phone, function(err, user){
                    should.not.exist(err);
                    should.exist(user);
                    should.not.exist(user.authToken);
                    user.id.should.equal(u1.id);
                    done();
                });
            });

            it('should find user by id', function(done){
                User.lookup(u1.id, function(err, user){
                    should.not.exist(err);
                    should.exist(user);
                    should.not.exist(user.authToken);
                    user.phone.should.equal(u1.phone);
                    done();
                });
            });

            it('should find multiple users', function(done){
                User.lookupNumbers([u1_phone, u2_phone, 'xxx'], function(err, users){
                    should.not.exist(err);
                    should.exist(users);
                    users.length.should.equal(2);
                    done();
                });
            });
        });

        describe('Verify', function(){
            var verificationCode = null;

            it('should create verification code', function(done){
                u1.sendVerificationCode(function(err, code){
                    should.not.exist(err);
                    should.exist(code);
                    verificationCode = code;
                    done();
                });
            });

            it('should verify user', function(done){
                User.verify(verificationCode, u1.id, function(err, user){
                    should.not.exist(err);
                    should.exist(user);
                    should.exist(user.authToken);
                    user.verified.should.be.true;
                    u1_auth = user.authToken;
                    done();
                });
            });
        });

        describe('Auth', function(){
            it('should find user via auth token', function(done){
                User.findByAuthToken(u1_auth, function(err, user){
                    should.not.exist(err);
                    should.exist(user);
                    user.id.should.equal(u1.id);
                    done();
                });
            });
        });

        describe('Update', function(){
            it('should update user name', function(done){
                u1.update(u1_phone, u1_name, function(err, user){
                    should.not.exist(err);
                    should.exist(user);
                    user.phone.should.equal(u1_phone);
                    user.name.should.equal(u1_name);
                    user.verified.should.be.true;
                    u1 = user;
                    done();
                });
            });
        });
    });

    // Message
    describe('Message Tests', function(){

        describe('Send', function(){
            it('should send a message', function(done){
                Message.create(u2.id, u1, m1_text, function(err, message){
                    should.not.exist(err);
                    should.exist(message);
                    message.to.id.should.equal(u2.id);
                    message.from.id.should.equal(u1.id);
                    message.message.should.equal(m1_text);
                    m1 = message;
                    done();
                });
            });

            it('should fail to send from unverified user', function(done){
                Message.create(u1.id, u2, 'xxx', function(err, message){
                    should.exist(err);
                    should.not.exist(message);
                    done();
                });
            });

            it('should fail to send to non user', function(done){
                Message.create('xxx', u1, 'xxx', function(err, message){
                    should.exist(err);
                    should.not.exist(message);
                    done();
                });
            });
        });
    });












































});
