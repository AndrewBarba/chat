
var _ = require('underscore')
  , fs = require('fs')

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

// load all utils in this folder
_.extend(module.exports, this.loadFiles(__dirname));