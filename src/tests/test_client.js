var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080');
socket.on('printOut', function (data) {
    console.log(data);
});
//socket.emit('start');
socket.on('ping', function (data) {
    console.log(data);
});

//socket.emit('turn_up', { my: 'data' });
//socket.emit('turn', {playerid: 1, squareid: 25});
//socket.emit('turn', {playerid: 2, squareid: 25});
/*socket.emit('turn', {playerid: 2, squareid: 81});
socket.emit('print');
socket.emit('turn', {playerid: 3, squareid: 23});
socket.emit('turn', {playerid: 4, squareid: 25});
socket.emit('turn', {playerid: 5, squareid: 56});
socket.emit('turn', {playerid: 6, squareid: 31});
*/
socket.emit('print');

setTimeout( () => { process.exit(0); }, 500);