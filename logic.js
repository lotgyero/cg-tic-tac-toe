/*
* Game logic.
*
*
*/

/**
 * Checks whether the small grid square is free or not.
 */
var checkAction = function(obj, squareId) {
    if(obj.small[squareId] == 'X' || obj.small[squareId] == '0')
        return false;
    return true;
}

/**
 * Looks for a collision inside current buffer actions.
 */
var checkTurnAction = function(obj, squareId, playerId) {
    for(var i = 1; i < obj.turnBuf.length; i++) {
        if( i == playerId) {
            continue;
        }
        if(obj.turnBuf[i] == squareId)
            return true;
    }
    return false;
}

/**
 * Main game model.
 */
var gameModel = {
    state : 'stopped', // game current state
    turnCounter: 1, // turn counter
    players : { 'X': [1, 2, 3], '0': [ 4, 5, 6 ]}, // players' ids
    big : ['E', '0', '0', '0', '0', '0', '0', '0','0', '0'], // left to right, top to bottom
    small : {}, // left to right, top to bottom, inside big square, then the next one
    dependencies: { 1: 2, 2: 3, 3:1, 4:5, 5:6, 6:4 },
    turnBuf : [ 0, 0, 0, 0, 0, 0, 0], // current turn actions
    start: function() {
        this.state = 'in progress';
    },
    turn: function(data) {
        // Check for values
        var playerId = data.playerid;
        var squareId = data.squareid;
        if (typeof playerId == 'undefined'|| typeof squareId == 'undefined' ){
            console.log('gameModel.turn(): invalid input data.');
        }
        if ( this.turnBuf[playerId] != 0 ) {
            console.log(data, playerId, squareId);
            console.log(this.turnBuf);
            console.log('gameModel.turn(): this turn action has been already taken.');
        } else if ( squareId < 1 || squareId > 81 ) {
            console.log('gameModel.turn(): wrong square-id.');
        } else if (!checkAction(this, squareId)) {
            console.log('gameModel.turn(): wrong action - the square has been used.');
        } else {
            this.turnBuf[playerId] = squareId;
            if (this.endTurn()) {
                console.log('gameModel.turn(): the end of the ' + this.turnCounter);
            }
        }
    },
    print: function() {
        console.log('state '+ this.state);
        console.log('turn '+ this.turnCounter);
        console.log('big '+ this.big);
        var s = 'small: ';
        for (var key in this.small) {
            s += ' ' + key + ': ' + this.small[key];
            //console.log('small.'+ key + ' ' + this.small[key]);
        }
        console.log(s);
        console.log('turn_buf '+ this.turnBuf);
    },
    endTurn: function()
    {
        for(var i = 1; i < this.turnBuf.length; i++) {
            if (this.turnBuf[i] == 0) {
                return false;
            }
        }
        //console.log(this);
        // Set the small grid according with the current turn.
        // Set small square to an empty value, in case of collision.
        for(i = 1; i < this.turnBuf.length; i++) {
            if(checkTurnAction(this, this.turnBuf[i], i)) {
                this.small[this.turnBuf[i]] = 'E';
                continue;
            }

            if ( this.players['X'].includes(i) )
            {
                this.small[this.turnBuf[i]] = 'X';
                console.log("X " + i);
            }
            else {
                this.small[this.turnBuf[i]] = '0';
                console.log('0 ' + i);
            }
         }
        this.turnCounter += 1;
        this.turnBuf = [ 0, 0, 0, 0, 0, 0, 0];
        this.checkSmall();
        this.checkBig();
        this.checkEndGame();
        return true;
    },
    checkEndGame: function() {
        return false;
    },
    checkBig: function() {
        return false;
    },
    checkSmall: function() {
        return false;
    },
    ping: function() {
        return {state: this.state, turn: this.turnCounter};
    },
    incTurn: function() {
        this.turnCounter += 1;

    }
}

module.exports = gameModel;
