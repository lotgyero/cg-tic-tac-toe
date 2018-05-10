var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080');
//socket.emit('print');
/*socket.on('printOut', function (data) {
    console.log(data);
});*/

socket.emit('start');
socket.emit('turn', {playerid: 1, squareid: 1});
socket.emit('turn', {playerid: 2, squareid: 2});
socket.emit('turn', {playerid: 3, squareid: 3});
socket.emit('turn', {playerid: 4, squareid: 4});
socket.emit('turn', {playerid: 5, squareid: 5});
socket.emit('turn', {playerid: 6, squareid: 6});
socket.emit('print');

socket.on('printOut', function (data) {
    console.log(data);
});

setTimeout( () => { process.exit(0); }, 500);