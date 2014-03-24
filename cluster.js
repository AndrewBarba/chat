process.env.TZ = 'UTC'; // force UTC timezone

var cluster = require('cluster');

if (cluster.isMaster) {

    // check number of cpu's
    var cpuCount = require('os').cpus().length;
    console.log('CPUs: '+cpuCount);
    
    // fork process for each cpu
    for (var i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    // handle failures
    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' crashed');
        cluster.fork();
    });
} else {

    // start app
    require('./app')();
}