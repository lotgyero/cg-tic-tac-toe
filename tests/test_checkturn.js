var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080');
//socket.emit('print');
socket.on('printOut', function (data) {
    console.log(data);
});

socket.on('turn ends', function (data) {
    console.log(data);
});

socket.on('player action', function(msg) {
    console.log(msg);
});

socket.on('game starts', function(msg) {
    console.log(msg);
});

//console.log(typeof process.argv[2]);

var addUsers = function() {
    socket.emit('get player id', { 'faction': 'X' });
    socket.emit('get player id', { 'faction': 'X' });
    socket.emit('get player id', { 'faction': 'X' });
    socket.emit('get player id', { 'faction': '0' });
    socket.emit('get player id', { 'faction': '0' });
    socket.emit('get player id', { 'faction': '0' });
}

switch (process.argv[2]){
    case '1': // simple turn test
        socket.emit('reset');
        socket.emit('print');
        socket.emit('start');
        socket.emit('turn', {playerid: 1, squareid: 19});
        socket.emit('turn', {playerid: 2, squareid: 20});
        socket.emit('turn', {playerid: 3, squareid: 21});
        socket.emit('turn', {playerid: 4, squareid: 28});
        socket.emit('turn', {playerid: 5, squareid: 29});
        socket.emit('turn', {playerid: 6, squareid: 30});
        socket.emit('print');
        break;
    case '2': // small world collision
        socket.emit('reset');
        socket.emit('turn', {playerid: 1, squareid: 25});
        socket.emit('turn', {playerid: 2, squareid: 81});
        socket.emit('print');
        socket.emit('turn', {playerid: 3, squareid: 23});
        socket.emit('turn', {playerid: 4, squareid: 25});
        socket.emit('turn', {playerid: 5, squareid: 56});
        socket.emit('turn', {playerid: 6, squareid: 31});
        socket.emit('print');
        break;

    case '3': // X wins
        socket.emit('reset');
        socket.emit('start');
        socket.emit('turn', {playerid: 1, squareid: 19});
        socket.emit('turn', {playerid: 2, squareid: 20});
        socket.emit('turn', {playerid: 3, squareid: 21});
        socket.emit('turn', {playerid: 4, squareid: 28});
        socket.emit('turn', {playerid: 5, squareid: 29});
        socket.emit('turn', {playerid: 6, squareid: 30});

        socket.emit('turn', {playerid: 6, squareid: 36});
        socket.emit('turn', {playerid: 5, squareid: 38});
        socket.emit('turn', {playerid: 4, squareid: 39});
        socket.emit('turn', {playerid: 3, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        socket.emit('turn', {playerid: 1, squareid: 3});

        socket.emit('turn', {playerid: 6, squareid: 46});
        socket.emit('turn', {playerid: 3, squareid: 10});
        socket.emit('turn', {playerid: 4, squareid: 47});
        socket.emit('turn', {playerid: 2, squareid: 11});
        socket.emit('turn', {playerid: 5, squareid: 48});
        socket.emit('turn', {playerid: 1, squareid: 12});
        socket.emit('print');
        break;

    case '4': // draw conditions test
        socket.emit('reset');
        socket.emit('start');
        socket.emit('turn', {playerid: 1, squareid: 19});
        socket.emit('turn', {playerid: 2, squareid: 20});
        socket.emit('turn', {playerid: 3, squareid: 21});
        socket.emit('turn', {playerid: 4, squareid: 28});
        socket.emit('turn', {playerid: 5, squareid: 29});
        socket.emit('turn', {playerid: 6, squareid: 30});

        socket.emit('turn', {playerid: 6, squareid: 39});
        socket.emit('turn', {playerid: 5, squareid: 38});
        socket.emit('turn', {playerid: 4, squareid: 37});
        socket.emit('turn', {playerid: 3, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        socket.emit('turn', {playerid: 1, squareid: 3});

        socket.emit('turn', {playerid: 6, squareid: 46});
        socket.emit('turn', {playerid: 3, squareid: 10});
        socket.emit('turn', {playerid: 4, squareid: 47});
        socket.emit('turn', {playerid: 2, squareid: 11});
        socket.emit('turn', {playerid: 5, squareid: 48});
        socket.emit('turn', {playerid: 1, squareid: 12});
        socket.emit('print');
        break;

    case '5': // semi-win conditions test
        socket.emit('reset');
        socket.emit('start');
        socket.emit('turn', {playerid: 1, squareid: 19});
        socket.emit('turn', {playerid: 2, squareid: 20});
        socket.emit('turn', {playerid: 3, squareid: 21});
        socket.emit('turn', {playerid: 4, squareid: 28});
        socket.emit('turn', {playerid: 5, squareid: 81});
        socket.emit('turn', {playerid: 6, squareid: 30});

        socket.emit('turn', {playerid: 6, squareid: 39});
        socket.emit('turn', {playerid: 5, squareid: 38});
        socket.emit('turn', {playerid: 4, squareid: 37});
        socket.emit('turn', {playerid: 3, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        socket.emit('turn', {playerid: 1, squareid: 3});

        socket.emit('turn', {playerid: 6, squareid: 46});
        socket.emit('turn', {playerid: 3, squareid: 10});
        socket.emit('turn', {playerid: 4, squareid: 47});
        socket.emit('turn', {playerid: 2, squareid: 11});
        socket.emit('turn', {playerid: 5, squareid: 48});
        //socket.emit('turn', {playerid: 1, squareid: 12});
        socket.emit('print');
        break;
    case '6': // test state before the start
        socket.emit('reset');
        socket.emit('print');
        socket.emit('turn', {playerid: 5, squareid: 1});
        socket.emit('get player id', { 'faction': 'X' });
        socket.emit('turn', {playerid: 1, squareid: 2});
        socket.emit('print');
        break;

    case '7': // test state after the start
        socket.emit('reset');
        socket.on('playerid', function(msg) {
            console.log('playerid received ' + msg.playerid);
        });
        addUsers();
        socket.emit('get player id', { 'faction': '0' });
        socket.emit('print');
        socket.emit('turn', {playerid: 1, squareid: 2});
        break;
}

setTimeout( () => { process.exit(0); }, 1000);