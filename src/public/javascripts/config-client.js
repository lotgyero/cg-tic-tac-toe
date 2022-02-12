var socket = io();

// TODO Move logger to file
var logger = {
    debug: function(msg, id) {
        if(id == 1)
            console.log(msg);
    }
};

// Socket events processing


var restartGame = function() {
    socket.emit('reset');
}