//TODO introduce logging levels in config

let GMT3_OFFSET = 10800000;


var logger = {
    debug: function (msg, id) {
        //if(id == 9)
        this.console(msg, 'DEBUG');
    },
    info: function (msg) {
        this.console(msg, 'INFO');
    },
    warn: function (msg) {
        this.console(msg, 'WARN');
    },
    err: function (msg) {
        this.console(msg, 'ERR');
    },
    console: function (msg, severity) {
        d = new Date();
        if (typeof(msg) == 'object') {
            logEntry = d + ' ' + severity + ' ' + JSON.stringify(msg);
        } else {
            logEntry = d + ' ' + severity + ' ' + msg;
        }
        console.log(logEntry);
    }
}

module.exports = logger;