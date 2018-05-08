var logger = {
    debug: function (msg, id) {
        if(id == 1)
            console.log(msg);
    },
    info: function (msg) {
        console.log(msg);
    },
    warn: function (msg) {
      console.log(msg);
    },
    err: function (msg) {
        console.log(msg);
    }
}

module.exports = logger;