var socket = io();
var prevTurnSqrs = [];
var turnAllowed = false;
var players;
var playerid;
var reloadTO = 120000; //msecs

if (prevTurnSqrs.length == 0) {
    //turnAllowed = true;
    var parsedUrl = new URL(window.location.href);
    playerid = parsedUrl.searchParams.get("playerid");
}

var logger = {
    debug: function(msg, id) {
        if (id == 5) console.log(msg);
    }
};

// Socket events processing
// Used on window refresh and initial run
socket.on('current state', function(msg) {
    setCurrentState(msg);
});

// Change the game field when the turn ends.
socket.on('turn ends', function(msg) {
    logger.debug(msg,2);
    updateOnTurnEnds(msg);
});

// A player made an action, so set activity zone marker.
socket.on('player action', function(msg) {
    logger.debug(msg,2);
    $('#pstatus' + msg.playerid).css('font-weight', '900');
});

// The event fires when the game starts.
socket.on('game starts', function(msg) {
    $('#gamestate-placeholder').html('Игра началась.');
    logger.debug('game starts',3);
    turnAllowed = true;
});

// The event fires on a regular basis to check players status.
socket.on('check', function() {
    logger.debug('check event', 3);
    socket.emit('alive', {'playerid': playerid});
});

// Server notifies about player diconnection with this event
socket.on('disconnected players', function(msg) {
    logger.debug('disconnected players ' + msg.zombie, 3);
    disconnectPlayers(msg);
});

// Server notifies about player reconnection with this event
socket.on('player online', function(msg) {
    logger.debug('player online' + msg.playerid, 3);
    connectPlayer(msg);
});

socket.emit('get state');

// Used with 'current state' event to display the current game state.
var setCurrentState = function(obj) {
    var k;

    if(obj.state === 'in progress'
        && obj.hasOwnProperty('players_done')
        && !obj['players_done'].includes(Number(playerid))) {
        turnAllowed = true;
    }

    for (k of obj.players_done) {
        $('#pstatus'+k).css('font-weight', '900');
        if(!obj.used_slots.includes(k))
            $('#pstatus'+k).css('color', 'red');
    }

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
        $('#gamestate-placeholder').html('');
    }
    else {
        if(obj.state ==='in progress')
            $('#gamestate-placeholder').html('Игра началась.');
    }

    players = obj.players;
};

// Used to reset activity area markers when the turn ends.
var resetActions = function() {
    var id;
    // using global players
    for (var faction of ['X', '0']) {
        for (id of players[faction]) {
            $('#pstatus'+id).css('font-weight', 'normal');
        }
    }
};

// Used to set activity area marker when player disconnects.
var disconnectPlayers = function(obj) {
    for (var id of obj.zombies) {
        $('#pstatus'+id).css('color', 'red');
    }
};

// Set the player status on re-/connection.
var connectPlayer = function(obj) {
    $('#pstatus'+obj.playerid).css('font-weight', 'normal');
    $('#pstatus'+obj.playerid).css('color', 'black');
};

// Hides game action modal window.
var hideTurnField = function(){
    $('#turnModal').modal('hide');
    // Prevents multiply turn modals.
    turnAllowed = false;
};

// Shows game action modal window.
var showTurnField = function(){
    if(turnAllowed == true)
        $('#turnModal').modal('show');
};

// Updates the game field with the last run actions.
var updateOnTurnEnds = function(msg) {
    var i = 0;
    var el;
    var updPrevTurnSqrs = [];

    // toggle collision class
    for(el of prevTurnSqrs){
        if($('#sq'+el).hasClass('collision'))
            $('#sq'+el).toggleClass('collision');
    }

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
    for(line of msg['small']['X']) {
        //logger.debug(el, 5);
        for(el of line) {
            $('#sq'+el).css('text-decoration','line-through white');
        }
    }
    for(line of msg['small']['0']) {
        //console.log('updateOnTurnEnds() 0:' + el);
        for(el of line) {
            $('#sq'+el).css('text-decoration','line-through white');
        }
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
    // Use this to change class later
    resetActions();
    prevTurnSqrs = updPrevTurnSqrs;
    if(msg.winner != false) {
       $('#gamestate-placeholder').html('');
       if(msg.winner === 'draw') {
           $('#win-placeholder').text('Игра закончена вничью');
       } else {
           $('#win-placeholder').text('Игра завершена. Победили ' + msg.winner);
       }
       // Prevents multiply turn modals.
       turnAllowed = false;
       setTimeout(function() { location.reload(); },reloadTO);
    } else {
       turnAllowed = true;
    }
}

// Sends the player action data to the server.
var sendTurn = function(obj, socket)
{
    socket.emit('turn', {'playerid': Number(playerid), 'squareid': Number(obj.id)});
    hideTurnField();
}