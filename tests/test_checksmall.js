var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080');
//socket.emit('print');
/*socket.on('printOut', function (data) {
    console.log(data);
});*/

socket.emit('start');
socket.emit('turn', {playerid: 1, squareid: 19});
socket.emit('turn', {playerid: 2, squareid: 20});
socket.emit('turn', {playerid: 3, squareid: 21});
socket.emit('turn', {playerid: 4, squareid: 25});
socket.emit('turn', {playerid: 5, squareid: 56});
socket.emit('turn', {playerid: 6, squareid: 31});
socket.emit('print');

socket.on('printOut', function (data) {
    console.log(data);
});

setTimeout( () => { process.exit(0); }, 500);