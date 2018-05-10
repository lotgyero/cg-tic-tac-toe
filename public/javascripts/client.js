var socket = io();
var prevTurnSqrs = [];
var turnAllowed;
var players;
var playerid;

if (prevTurnSqrs.length == 0) {
    turnAllowed = true;
    var parsedUrl = new URL(window.location.href);
    playerid = parsedUrl.searchParams.get("playerid");
}

var logger = {
    debug: function(msg, id) {
        if(id == 2)
            console.log(msg);
    }
};

// Socket events processing
socket.on('current state', function(msg) {
    logger.debug('Asking for a state', 1);
    setCurrentState(msg);
});

socket.on('turn ends', function(msg) {
    logger.debug(msg,2);
    updateOnTurnEnds(msg);
});

socket.on('player action', function(msg) {
    logger.debug(msg,2);
    $('#pstatus' + msg.playerid).css('font-weight', '900');
});

socket.emit('get state');

var setCurrentState = function(obj) {
    var k;
    //logger.debug(obj['small'], 1);

    for (k in obj.small) {
        //logger.debug('setCurrentState(): ' + k, 1);
        if(obj.small.hasOwnProperty(k)) {
            //logger.debug('setCurrentState(): ' + k + ' ' + obj.small[k], 1);
            $('#sq'+k).html('<span class="small old">' + obj.small[k] + '</span>');
        }
    }

    if(obj.winner != false) {
        if(obj.winner === 'draw') {
            $('#win-placeholder').text('Игра закончена вничью');
        } else {
            $('#win-placeholder').text('Игра завершена. Победили ' + obj.winner);
        }
        turnAllowed = false;
    }

    players = obj.players;
};

var resetActions = function() {
    var id;
    // using global players
    for (var faction of ['X', '0']) {
        for (id of players[faction  ]) {
            $('#pstatus'+id).css('font-weight', 'normal');
        }
    }
};

var hideTurnField = function(){
    $('#turnModal').modal('hide');
    // Prevents multiply turn modals.
    turnAllowed = false;
};

var showTurnField = function(){
    if(turnAllowed == true)
        $('#turnModal').modal('show');
};

var updateOnTurnEnds = function(msg) {
    var i = 0;
    var el;
    var updPrevTurnSqrs = [];
    // Updating small squares
    for(el of msg['changes']['X']) {
        //console.log('updateOnTurnEnds() X:' + el);
        $('#sq'+el).html('<span class="small last">X</span>');
        updPrevTurnSqrs.push(el);
    }
    for(el of msg['changes']['0']) {
        //console.log('updateOnTurnEnds() 0:' + el);
        $('#sq'+el).html('<span class="small last">0</span>');
        updPrevTurnSqrs.push(el);
    }
    // Updating taken lines of small squares
    for(el of msg['small']['X']) {
        //console.log('updateOnTurnEnds() 0:' + el);
        $('#sq'+el).css('text-decoration','line-through white');
    }
    for(el of msg['small']['0']) {
        //console.log('updateOnTurnEnds() 0:' + el);
        $('#sq'+el).css('text-decoration','line-through white');
    }

    // Toggle the collision class for a last turn collision.
    for(el of msg['collision']) {
        $('#sq'+el).toggleClass('collision');
    }

    // Change the class for actions taken previously
    for(el of prevTurnSqrs) {
        logger.debug('updateOnTurnEnds():' + el,666);
        $('#sq'+ el).children().toggleClass('old');
    }
    //old = msg['changes']['X'] + msg['changes']['0'];
    // Use this to change class later
    resetActions();
    prevTurnSqrs = updPrevTurnSqrs;
    if(msg.winner != false) {
       if(msg.winner === 'draw') {
           $('#win-placeholder').text('Игра закончена вничью');
       } else {
           $('#win-placeholder').text('Игра завершена. Победили ' + msg.winner);
       }
       // Prevents multiply turn modals.
       turnAllowed = false;
    } else {
       turnAllowed = true;
    }
}

var dummyTurn = function(socket, id) {
    socket.emit('turn', {'playerid': 2, 'squareid': id+1});
    socket.emit('turn', {'playerid': 3, 'squareid': id+2});
    socket.emit('turn', {'playerid': 4, 'squareid': id+3});
    socket.emit('turn', {'playerid': 5, 'squareid': id+4});
    socket.emit('turn', {'playerid': 6, 'squareid': id+5});
}

var sendTurn = function(obj, socket)
{
    socket.emit('turn', {'playerid': Number(playerid), 'squareid': Number(obj.id)});
    hideTurnField();
}