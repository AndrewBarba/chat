
var Errors = require('../errors')

/***********************/
/*    RATE LIMITTER    */
/***********************/

/***

A node js rate limitter that will prevent a single client from
making too many requests in a given period of time

***/

var REQUEST_TIME = 1000;

function RateLimiter(reqPerSecond, unique) {
    
    var _this = this;
    
    // global bucket queue
    _this.BUCKETS = {};

    // requests per second
    _this.reqPerSecond = reqPerSecond;

    // optional function that returns a unique identifier for a request
    // by default returns request IP address
    _this.unique = unique || function(req, next) {
        return next(req.ip);
    };

    // rate limitting function
    _this.rateLimit = function(req, res, next) {

        // look for unique id
        _this.unique(req, function(idOrSafe){

            // if passed true, move on
            if (idOrSafe && typeof idOrSafe == 'boolean') return next();
            
            // use passed in id or if null, use ip address
            var id = idOrSafe ? idOrSafe : req.ip;

            // grab data for current id
            var buckets = _this.BUCKETS;

            // get data for unique id
            var data = buckets[id];

            // if there's no data for this id, add it and move on
            // setTimeout to delete bucket in one second
            // this prevents memory getting to large if the hacker does not make any more requests
            if (!data) {
                buckets[id] = {
                    date: Date.now(),
                    count: 1
                }
                setTimeout(function(){
                    delete buckets[id];
                }, REQUEST_TIME);
                return next();
            }

            // grab current count and time since first request
            var diff = Date.now() - data.date;
            var count = data.count;

            // if its been less than a second since first request
            // check to see if client reached limit
            if (diff <= REQUEST_TIME) {
                if (count > (_this.reqPerSecond - 1)) {
                    return Errors.BusyError(res, 'Too many requests');
                } else {
                    data.count++;
                    return next();
                }
            }

            // its been more than 1 second since first request, move on
            next();
        });
    }
}

module.exports = function(reqPerSecond, unique) {
    var rateLimitter = new RateLimiter(reqPerSecond, unique);
    return rateLimitter.rateLimit;
}

