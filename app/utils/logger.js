
exports.info = function(str) {
    console.log('info: '+str);
}

exports.error = function(str) {
    throw new Error(str)
}