var socket = io();
var prevTurnSqrs = [];
var turnAllowed;

if (prevTurnSqrs.length == 0)
    turnAllowed = true;

var logger = {
    debug: function(msg, id) {
        if(id == 1)
            console.log(msg);
    }
};

socket.emit('get state');

socket.on('current state', function(msg) {
    //logger.debug(msg, 1);
    setCurrentState(msg);
});

socket.on('turn ends', function(msg) {
    logger.debug(msg,1);
    updateOnTurnEnds(msg);
});

var setCurrentState = function(obj) {
    var k;
    logger.debug(obj['small'].length, 1);

    for (k in Object.keys(obj.small)) {
        logger.debug('setCurrentState(): ' + k, 1);
        //logger.debug('setCurrentState(): ' + obj['small'][k], 1);
        //$('#sq'+el).html('<span class="small last">X</span>');
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

    for(el of prevTurnSqrs) {
        console.log('updateOnTurnEnds():' + el);
        $('#sq'+ el).children().toggleClass('old');
    }
    //old = msg['changes']['X'] + msg['changes']['0'];
    // Use this to change class later
    prevTurnSqrs = updPrevTurnSqrs;
    // Prevents multiply turn modals.
    turnAllowed = true;
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
    //logger.debug(turnAllowed, 1);
    socket.emit('turn', {'playerid': 1, 'squareid': obj.id});
    hideTurnField();
}