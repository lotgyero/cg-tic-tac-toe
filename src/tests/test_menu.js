var io = require('socket.io-client');
//var nsp = io.of('/menu');
var socket = io.connect('http://localhost:8080');
//var socket = nsp('http://localhost:8080');

socket.on('connection', function(socket) {
    //socket.join('menu');
});
socket.on('playerid', function(msg) {
    console.log(msg);
});

//console.log(typeof process.argv[2]);

switch (process.argv[2]){
    case '1': // simple menu check
        socket.emit('reset');
        socket.emit('get player id', {'faction': 'X'});
        socket.emit('get player id', {'faction': 'X'});
        socket.emit('get player id', {'faction': 'X'});
        socket.emit('get player id', {'faction': 'X'});
        socket.emit('get player id', {'faction': 'X'});

        socket.emit('get player id', {'faction': '0'});
        socket.emit('get player id', {'faction': '0'});
        socket.emit('get player id', {'faction': '0'});
        socket.emit('get player id', {'faction': '0'});
        socket.emit('get player id', {'faction': '0'});
        
        break;
    case '2': // small world collision
        /*socket.emit('reset');
        socket.emit('turn', {playerid: 1, squareid: 25});
        socket.emit('turn', {playerid: 2, squareid: 81});
        socket.emit('print');
        socket.emit('turn', {playerid: 3, squareid: 23});
        socket.emit('turn', {playerid: 4, squareid: 25});
        socket.emit('turn', {playerid: 5, squareid: 56});
        socket.emit('turn', {playerid: 6, squareid: 31});
        socket.emit('print');*/
        break;
}

setTimeout( () => { process.exit(0); }, 1000);