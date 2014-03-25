
var info = function(str) {
    console.log('info: '+str);
}

var error = function(str) {
    console.log('error: '+str);
}

var _this = info;

_this.info = info;
_this.error = error;

module.exports = _this;