
var _ = require('underscore')
  , fs = require('fs')
  , crypto = require('crypto')
  , _this = module.exports

exports.loadFiles = function(dir, param) {
    var files = {};
    fs.readdirSync(dir).forEach(function(file) {
            
        // skip index files
        if (file == 'index.js') return;

        var components = file.split('.')
        
        // skip non .js files
        if (components.pop() != 'js') return;

        // get name of file
        var name = components.join('.');

        // use the name of the file as the key name
        // replace - with _ for anming purposes
        var keyName = name.replace(/-/g,'_');
        
        // require the file and add to the module exports
        files[keyName] = (param) ? require(dir + '/' + name)(param) : require(dir + '/' + name);
    });
    return files;
}

exports.randomHex = function (x) {
    var num = Math.ceil(x/2);
    var odd = x % 2 !== 0;
    var buf = crypto.pseudoRandomBytes(num);
    var hexVal = buf.toString('hex');
    return (odd) ? hexVal.substring(1) : hexVal;
}

exports.randomNumberString = function(x) {
    var ans = '';
    for (var i = 0; i < x; i++) {
        ans += Math.floor(Math.random() * 10);
    }
    return ans;
}

exports.guid = function(x) {
    if (!x) x = 8;
    var s = "";
    for (var i = 0; i < x/4; i++) s += _this.randomHex(4);
    return s;
}

exports.objectId = function() {
    return _this.guid(24);
}

exports.authToken = function() {
    return _this.guid(128);
}

// load all utils in this folder
_.extend(module.exports, this.loadFiles(__dirname));