var socket = io();
var playerid;
var glFaction;

// TODO Move logger to file
var logger = {
    debug: function(msg, id) {
        if(id == 1)
            console.log(msg);
    }
};

// Socket events processing
socket.on('connection', function(socket) {
    socket.join('menu');
});
socket.on('playerid', function(msg) {
    logger.debug('playerid received ' + msg.playerid, 1);
    if(msg.playerid != 0) {
        window.location.href = '../game?faction='+glFaction+'&playerid='+msg.playerid;
    } else {
    // TODO raise modal
    }
    playerid = msg.playerid;
});


var getPlayerId = function(faction) {
    socket.emit('get player id', {'faction': faction});
    glFaction = faction;
}

