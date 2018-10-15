var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080');
//socket.emit('print');
socket.on('printOut', function (data) {
    console.log(data);
});

socket.on('turn ends', function (data) {
    console.log(data);
    console.log(data.small['X']);
});

socket.on('player action', function(msg) {
    console.log(msg);
});

socket.on('game starts', function(msg) {
    console.log(msg);
});

//console.log(typeof process.argv[2]);

var addPlayers = function(number) {
    socket.emit('get player id', { 'faction': 'X' });
    socket.emit('get player id', { 'faction': 'X' });
    socket.emit('get player id', { 'faction': 'X' });
    socket.emit('get player id', { 'faction': '0' });
    socket.emit('get player id', { 'faction': '0' });
    if(number >= 6)
        socket.emit('get player id', { 'faction': '0' });
}

var timeout = 1000;

switch (process.argv[2]){
    case '1': // simple turn test
        socket.emit('reset');
        socket.emit('print');
        //socket.emit('start');
        addPlayers(6);
        socket.emit('turn', {playerid: 1, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        socket.emit('turn', {playerid: 3, squareid: 3});
        socket.emit('turn', {playerid: 4, squareid: 4});
        socket.emit('turn', {playerid: 5, squareid: 5});
        socket.emit('turn', {playerid: 6, squareid: 6});
        socket.emit('print');
        break;
    case '2': // small world collision
        socket.emit('reset');
        addPlayers(6);
        socket.emit('turn', {playerid: 1, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        //socket.emit('print');
        socket.emit('turn', {playerid: 3, squareid: 3});
        socket.emit('turn', {playerid: 4, squareid: 1});
        socket.emit('turn', {playerid: 5, squareid: 2});
        socket.emit('turn', {playerid: 6, squareid: 3});
        socket.emit('print');
        break;
    case '12': // small world collision
        socket.emit('reset');
        addPlayers(6);
        socket.emit('turn', {playerid: 1, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        //socket.emit('print');
        socket.emit('turn', {playerid: 3, squareid: 3});
        socket.emit('turn', {playerid: 4, squareid: 1});
        socket.emit('turn', {playerid: 5, squareid: 2});
        socket.emit('turn', {playerid: 6, squareid: 4});
        socket.emit('print');
        break;

    case '112': // dependency change on collision
        socket.emit('reset');
        socket.emit('print');
        addPlayers(6);
        socket.emit('turn', {playerid: 1, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        socket.emit('turn', {playerid: 3, squareid: 3});
        socket.emit('turn', {playerid: 4, squareid: 1});
        socket.emit('turn', {playerid: 5, squareid: 2});
        socket.emit('turn', {playerid: 6, squareid: 4});
        socket.emit('turn', {playerid: 1, squareid: 5});
        socket.emit('turn', {playerid: 2, squareid: 4});
        socket.emit('turn', {playerid: 3, squareid: 3});
        socket.emit('turn', {playerid: 4, squareid: 6});
        socket.emit('turn', {playerid: 5, squareid: 7});
        socket.emit('turn', {playerid: 6, squareid: 8});
        socket.emit('print');
        break;

    case '122': // multiply collisions
        timeout = 10000;
        socket.emit('reset');
        addPlayers(6);

        function f1220() {
            socket.emit('turn', {playerid: 1, squareid: 1});
            socket.emit('turn', {playerid: 2, squareid: 2});
            socket.emit('turn', {playerid: 3, squareid: 3});
            socket.emit('turn', {playerid: 4, squareid: 1});
            socket.emit('turn', {playerid: 5, squareid: 2});
            socket.emit('turn', {playerid: 6, squareid: 5});
            socket.emit('print');
            console.log('case 122: after 1st turn ');
        };
        function f1221() {
            socket.emit('turn', {playerid: 1, squareid: 5});
            socket.emit('turn', {playerid: 2, squareid: 4});
            socket.emit('turn', {playerid: 3, squareid: 3});
            socket.emit('turn', {playerid: 4, squareid: 5});
            socket.emit('turn', {playerid: 5, squareid: 4});
            socket.emit('turn', {playerid: 6, squareid: 7});
            console.log('case 122: after 2nd turn ');
            socket.emit('print');
        }
        function f1222() {
            socket.emit('turn', {playerid: 1, squareid: 7});
            socket.emit('turn', {playerid: 2, squareid: 8});
            socket.emit('turn', {playerid: 3, squareid: 9});
            socket.emit('turn', {playerid: 4, squareid: 7});
            socket.emit('turn', {playerid: 5, squareid: 8});
            socket.emit('turn', {playerid: 6, squareid: 1});
            console.log('case 122: after 3d turn ');
            socket.emit('print');
        }
        function f1223() {
            socket.emit('turn', {playerid: 1, squareid: 1});
            socket.emit('turn', {playerid: 2, squareid: 3});
            socket.emit('turn', {playerid: 3, squareid: 3});
            socket.emit('turn', {playerid: 4, squareid: 2});
            socket.emit('turn', {playerid: 5, squareid: 5});
            socket.emit('turn', {playerid: 6, squareid: 2});
            socket.emit('print');
            console.log('case 122: after 4th turn ');
        }
        setTimeout(f1220, 2000);
        setTimeout(f1221, 4000);
        setTimeout(f1222, 8000);
        //setTimeout(f1223, 9000);
        break;

    case '3': // 2nd quadrant is taken by X
        socket.emit('reset');
        addPlayers(6);
        socket.emit('turn', {playerid: 1, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        socket.emit('turn', {playerid: 3, squareid: 3});
        socket.emit('turn', {playerid: 4, squareid: 4});
        socket.emit('turn', {playerid: 5, squareid: 5});
        socket.emit('turn', {playerid: 6, squareid: 6});

        socket.emit('turn', {playerid: 6, squareid: 9});
        socket.emit('turn', {playerid: 5, squareid: 8});
        socket.emit('turn', {playerid: 4, squareid: 7});
        socket.emit('turn', {playerid: 3, squareid: 3});
        socket.emit('turn', {playerid: 2, squareid: 2});
        socket.emit('turn', {playerid: 1, squareid: 2});

        socket.emit('print');
        break;
    case '13': // X semi-win
        timeout = 5000;
        socket.emit('reset');
        addPlayers(6);
        socket.emit('turn', {playerid: 1, squareid: 6});
        socket.emit('turn', {playerid: 2, squareid: 4});
        socket.emit('turn', {playerid: 3, squareid: 9});
        socket.emit('turn', {playerid: 4, squareid: 4});
        socket.emit('turn', {playerid: 5, squareid: 5});
        socket.emit('turn', {playerid: 6, squareid: 6});
        socket.emit('print');
        console.log('case 13: after 1st turn ');
        function f13() {
            socket.emit('turn', {playerid: 6, squareid: 9});
            socket.emit('turn', {playerid: 5, squareid: 8});
            socket.emit('turn', {playerid: 4, squareid: 7});
            socket.emit('turn', {playerid: 3, squareid: 4});
            socket.emit('turn', {playerid: 2, squareid: 6});
            socket.emit('turn', {playerid: 1, squareid: 3});
            console.log('case 13: after 2nd turn ');
            socket.emit('print');
        }
        function f23() {
            socket.emit('turn', {playerid: 1, squareid: 2});
            socket.emit('turn', {playerid: 2, squareid: 5});
            socket.emit('turn', {playerid: 3, squareid: 4});
            socket.emit('turn', {playerid: 4, squareid: 4});
            socket.emit('turn', {playerid: 5, squareid: 6});
            socket.emit('turn', {playerid: 6, squareid: 3});
            console.log('case 13: after 3d turn ');
            socket.emit('print');
        }
        function f33() {
            socket.emit('turn', {playerid: 1, squareid: 4});
            socket.emit('turn', {playerid: 2, squareid: 5});
            socket.emit('turn', {playerid: 3, squareid: 4});
            socket.emit('turn', {playerid: 4, squareid: 2});
            socket.emit('turn', {playerid: 5, squareid: 5});
            socket.emit('turn', {playerid: 6, squareid: 3});
            socket.emit('print');
            console.log('case 13: after 4th turn ');
        }
        setTimeout(f13, 1000);
        setTimeout(f23, 2000);
        setTimeout(f33, 3000);

        break;
    case '113': // X won
        timeout = 5000;
        socket.emit('reset');
        addPlayers(6);
        socket.emit('turn', {playerid: 1, squareid: 1});
        socket.emit('turn', {playerid: 2, squareid: 2});
        socket.emit('turn', {playerid: 3, squareid: 3});
        socket.emit('turn', {playerid: 4, squareid: 4});
        socket.emit('turn', {playerid: 5, squareid: 5});
        socket.emit('turn', {playerid: 6, squareid: 6});
        socket.emit('print');
        console.log('case 113: after 1st turn ');
        function f1() {
            socket.emit('turn', {playerid: 6, squareid: 9});
            socket.emit('turn', {playerid: 5, squareid: 8});
            socket.emit('turn', {playerid: 4, squareid: 7});
            socket.emit('turn', {playerid: 3, squareid: 3});
            socket.emit('turn', {playerid: 2, squareid: 2});
            socket.emit('turn', {playerid: 1, squareid: 2});
            console.log('case 113: after 2nd turn ');
            socket.emit('print');
        }
        function f2() {
            socket.emit('turn', {playerid: 1, squareid: 2});
            socket.emit('turn', {playerid: 2, squareid: 1});
            socket.emit('turn', {playerid: 3, squareid: 1});
            socket.emit('turn', {playerid: 4, squareid: 4});
            socket.emit('turn', {playerid: 5, squareid: 5});
            socket.emit('turn', {playerid: 6, squareid: 2});
            console.log('case 113: after 3d turn ');
            socket.emit('print');
        }
        function f3() {
            socket.emit('turn', {playerid: 1, squareid: 1});
            socket.emit('turn', {playerid: 2, squareid: 3});
            socket.emit('turn', {playerid: 3, squareid: 3});
            socket.emit('turn', {playerid: 4, squareid: 2});
            socket.emit('turn', {playerid: 5, squareid: 5});
            socket.emit('turn', {playerid: 6, squareid: 2});
            socket.emit('print');
            console.log('case 113: after 4th turn ');
        }
        setTimeout(f1, 2000);
        setTimeout(f2, 3000);
        setTimeout(f3, 4000);

        break;

    case '133': // X won for spectator reset game field check
        timeout = 6000;
        socket.emit('reset');
        addPlayers(6);

        function f0() {
            socket.emit('turn', {playerid: 1, squareid: 1});
            socket.emit('turn', {playerid: 2, squareid: 2});
            socket.emit('turn', {playerid: 3, squareid: 3});
            socket.emit('turn', {playerid: 4, squareid: 4});
            socket.emit('turn', {playerid: 5, squareid: 5});
            socket.emit('turn', {playerid: 6, squareid: 6});
            socket.emit('print');
            console.log('case 133: after 1st turn ');
        };
        function f1() {
            socket.emit('turn', {playerid: 6, squareid: 9});
            socket.emit('turn', {playerid: 5, squareid: 8});
            socket.emit('turn', {playerid: 4, squareid: 7});
            socket.emit('turn', {playerid: 3, squareid: 3});
            socket.emit('turn', {playerid: 2, squareid: 2});
            socket.emit('turn', {playerid: 1, squareid: 2});
            console.log('case 133: after 2nd turn ');
            socket.emit('print');
        }
        function f2() {
            socket.emit('turn', {playerid: 1, squareid: 2});
            socket.emit('turn', {playerid: 2, squareid: 1});
            socket.emit('turn', {playerid: 3, squareid: 1});
            socket.emit('turn', {playerid: 4, squareid: 4});
            socket.emit('turn', {playerid: 5, squareid: 5});
            socket.emit('turn', {playerid: 6, squareid: 2});
            console.log('case 133: after 3d turn ');
            socket.emit('print');
        }
        function f3() {
            socket.emit('turn', {playerid: 1, squareid: 1});
            socket.emit('turn', {playerid: 2, squareid: 3});
            socket.emit('turn', {playerid: 3, squareid: 3});
            socket.emit('turn', {playerid: 4, squareid: 2});
            socket.emit('turn', {playerid: 5, squareid: 5});
            socket.emit('turn', {playerid: 6, squareid: 2});
            socket.emit('print');
            console.log('case 133: after 4th turn ');
        }
        setTimeout(f0, 2000);
        setTimeout(f1, 3000);
        setTimeout(f2, 4000);
        setTimeout(f3, 5000);
        break;

    case '311': // Collision with a draw. For spectator mode.
            timeout = 9000;
            socket.emit('reset');
            addPlayers(6);

            function f0() {
                socket.emit('turn', {playerid: 1, squareid: 1});
                socket.emit('turn', {playerid: 2, squareid: 2});
                socket.emit('turn', {playerid: 3, squareid: 3});
                socket.emit('turn', {playerid: 4, squareid: 2});
                socket.emit('turn', {playerid: 5, squareid: 5});
                socket.emit('turn', {playerid: 6, squareid: 8});
                socket.emit('print');
                console.log('case 311: after 1st turn ');
            };
            function f1() {
                socket.emit('turn', {playerid: 4, squareid: 5});
                socket.emit('turn', {playerid: 5, squareid: 2});
                socket.emit('turn', {playerid: 6, squareid: 8});
                socket.emit('turn', {playerid: 3, squareid: 3});
                socket.emit('turn', {playerid: 2, squareid: 2});
                socket.emit('turn', {playerid: 1, squareid: 3});
                console.log('case 311: after 2nd turn ');
                socket.emit('print');
            }
            function f2() {
                socket.emit('turn', {playerid: 1, squareid: 1});
                socket.emit('turn', {playerid: 2, squareid: 1});
                socket.emit('turn', {playerid: 3, squareid: 2});
                socket.emit('turn', {playerid: 4, squareid: 8});
                socket.emit('turn', {playerid: 5, squareid: 8});
                socket.emit('turn', {playerid: 6, squareid: 9});
                console.log('case 311: after 3d turn ');
                socket.emit('print');
            }
            function f3() {
                socket.emit('turn', {playerid: 1, squareid: 1});
                socket.emit('turn', {playerid: 2, squareid: 3});
                socket.emit('turn', {playerid: 3, squareid: 7});
                socket.emit('turn', {playerid: 4, squareid: 5});
                socket.emit('turn', {playerid: 5, squareid: 5});
                socket.emit('turn', {playerid: 6, squareid: 6});
                socket.emit('print');
                console.log('case 311: after 4th turn ');
            }
            function f4() {
                socket.emit('turn', {playerid: 1, squareid: 2});
                socket.emit('turn', {playerid: 2, squareid: 2});
                socket.emit('turn', {playerid: 3, squareid: 4});
                socket.emit('turn', {playerid: 4, squareid: 2});
                socket.emit('turn', {playerid: 5, squareid: 2});
                socket.emit('turn', {playerid: 6, squareid: 7});
                socket.emit('print');
                console.log('case 311: after 4th turn ');
            }
            setTimeout(f0, 2000);
            setTimeout(f1, 3000);
            setTimeout(f2, 4000);
            setTimeout(f3, 5000);
            setTimeout(f4, 6000);
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
    case '7': // test state right after the start
        timeout = 2000;
        socket.emit('reset');
        socket.on('playerid', function(msg) {
            console.log('playerid received ' + msg.playerid);
        });
        addPlayers(6);
        socket.emit('get player id', { 'faction': '0' });
        setTimeout(function () {
                socket.emit('print');
            }, 1500);
        socket.emit('turn', {playerid: 1, squareid: 2});
        break;
    case '8': // poke players before the game starts
        socket.emit('reset');
        socket.on('playerid', function(msg) {
            console.log('playerid received ' + msg.playerid);
        });
        socket.emit('alive', {'playerid': 1});
        socket.emit('print');

        break;
    case '9': // poke players after the game starts
        timeout = 60000;
        socket.emit('reset');
        socket.on('playerid', function(msg) {
            console.log('playerid received ' + msg.playerid);
        });
        socket.on('disconnected players', function(msg) {
            console.log('disconnected players ' + msg.zombies);
        });
        addPlayers(6);
        //socket.emit('get player id', { 'faction': '0' });
        var keepThemAlive = function () {
            socket.emit('alive', {'playerid': 1});
            socket.emit('alive', {'playerid': 2});
            socket.emit('alive', {'playerid': 3});
            socket.emit('alive', {'playerid': 4});
        }
        setTimeout(keepThemAlive, 13000);
        setTimeout(keepThemAlive, 23000);
        setTimeout(keepThemAlive, 33000);
        setTimeout(keepThemAlive, 43000);
        setTimeout(keepThemAlive, 53000);
        var ch = function () { socket.emit('print'); };
        setTimeout(ch, 15000);
        setTimeout(ch, 25000);
        setTimeout(ch, 45000);
        break;

}

setTimeout( () => { process.exit(0); }, timeout);