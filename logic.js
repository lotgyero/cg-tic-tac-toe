/*
* Game logic.
*
*
*/

var Math = require('mathjs');

var logger = require('./logger');

var baseNumber = 9;

var PLAYER_TO = 4;

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
 * There couldn't be more then two equal square ids in one turn.
 */
var isTurnCollision = function(obj, squareId, playerId) {
    for(var i = 1; i < obj.turnBuf.length; i++) {
        if( i == playerId) {
            continue;
        }
        if(obj.turnBuf[i] == squareId) {
            return i;
        }
    }
    return 0;
}

var getSmallDiff = function(obj) {
    var result = {'X': [], '0': []}
    for(var i = 1; i < obj.turnBuf.length; i++)
    {
        if(obj.players['X'].includes(i)) {
            result['X'].push(obj.turnBuf[i]);
        } else {
            result['0'].push(obj.turnBuf[i]);
        }
    }
    logger.debug('getSmallDiff() X:',1);
    logger.debug(result['X'],1);
    logger.debug('getSmallDiff() 0:',1);
    logger.debug(result['0'],1);
    return result;
}

var getBigId = function(line) {
    return Math.fix(line[0] / 9) + 1;
}

var printChanges = function(result) {
    logger.debug('printChanges(): result small ' + result.small);
    logger.debug('printChanges(): result big ' + result.big);
    logger.debug('printChanges(): result won ' + result.won);
    logger.debug('printChanges(): result changes ' + result.changes);
}

var checkBigRows = function (obj, bigSquareId,symbol) {
    return false;
}

/**
 * Checks for a row completion for a team in a small square.
 */
var checkRows = function(obj, squareId, symbol) {
    var a = squareId % baseNumber;
    var base = squareId - a;
    var b = base / baseNumber;

    if(a == 1) {
        if (obj.small[base + 2] == symbol && obj.small[base + 3] == symbol) {
            return [squareId, base + 2, base + 3];
        } else if (obj.small[base + 4] == symbol && obj.small[base + 7] == symbol) {
            return [squareId, base + 4, base + 7];
        } else if (obj.small[base + 5] == symbol && obj.small[base + 9] == symbol) {
            return [squareId, base + 5, base + 9];
        }
    } else if (a == 2) {
        if (obj.small[base + 1] == symbol && obj.small[base + 3] == symbol) {
            return [squareId, base + 1, base + 3];
        } else if (obj.small[base + 5] == symbol && obj.small[base + 8] == symbol) {
            return [squareId, base + 5, base + 8];
        }
    } else if (a == 3) {
        if (obj.small[base + 1] == symbol && obj.small[base + 2] == symbol) {
            return [squareId, base + 1, base + 2];
        } else if (obj.small[base + 5] == symbol && obj.small[base + 7] == symbol) {
            return [squareId, base + 5, base + 7];
        } else if (obj.small[base + 6] == symbol && obj.small[base + 9] == symbol) {
            return [squareId, base + 5, base + 9];
        }
    } else if (a == 4) {
        if (obj.small[base + 1] == symbol && obj.small[base + 7] == symbol) {
            return [squareId, base + 1, base + 7];
        } else if (obj.small[base + 5] == symbol && obj.small[base + 6] == symbol) {
            return [squareId, base + 5, base + 6];
        }
    } else if (a == 5) {
        if (obj.small[base + 1] == symbol && obj.small[base + 9] == symbol) {
            return [squareId, base + 1, base + 9];
        } else if (obj.small[base + 2] == symbol && obj.small[base + 8] == symbol) {
            return [squareId, base + 2, base + 8];
        } else if (obj.small[base + 3] == symbol && obj.small[base + 7] == symbol) {
            return [squareId, base + 3, base + 7];
        } else if (obj.small[base + 4] == symbol && obj.small[base + 6] == symbol) {
            return [squareId, base + 4, base + 6];
        }
    } else if (a == 6) {
        if (obj.small[base + 3] == symbol && obj.small[base + 9] == symbol) {
           return [squareId, base + 3, base + 9];
        } else if (obj.small[base + 4] == symbol && obj.small[base + 5] == symbol) {
           return [squareId, base + 4, base + 5];
        }
    } else if (a == 7) {
        if (obj.small[base + 1] == symbol && obj.small[base + 4] == symbol) {
           return [squareId, base + 1, base + 4];
        } else if (obj.small[base + 8] == symbol && obj.small[base + 9] == symbol) {
           return [squareId, base + 8, base + 9];
        } else if (obj.small[base + 5] == symbol && obj.small[base + 3] == symbol) {
           return [squareId, base + 5, base + 3];
        }
    } else if (a == 8) {
        if (obj.small[base + 7] == symbol && obj.small[base + 9] == symbol) {
         return [squareId, base + 7, base + 9];
        } else if (obj.small[base + 2] == symbol && obj.small[base + 5] == symbol) {
         return [squareId, base + 2, base + 5];
        }
    } else if (a == 9) {
        if (obj.small[base + 1] == symbol && obj.small[base + 5] == symbol) {
           return [squareId, base + 1, base + 5];
        } else if (obj.small[base + 7] == symbol && obj.small[base + 8] == symbol) {
           return [squareId, base + 7, base + 8];
        } else if (obj.small[base + 3] == symbol && obj.small[base + 6] == symbol) {
           return [squareId, base + 3, base + 6];
        }
    }
    return [];
}


/**
 * Main game model.
 */
var gameModel = {
    state : 'stopped', // game current state
    turnCounter: 1, // turn counter
    players : { 'X': [1, 2, 3], '0': [ 4, 5, 6 ]}, // players' ids
    usedSlots: [],
    big : ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E','E', 'E'], // left to right, top to bottom
    small : {}, // left to right, top to bottom, inside big square, then the next one
    dependencies: { 1: 2, 2: 3, 3:1, 4:5, 5:6, 6:4 },
    turnBuf : [ 0, 0, 0, 0, 0, 0, 0], // current turn actions
    playerPokeArea : [ 0, 0, 0, 0, 0, 0, 0], // check player online using the structure
    winner: false,
    start: function() {
        this.state = 'in progress';
    },
    turn: function(data) {
        // Check for values
        var playerId = data.playerid;
        var squareId = data.squareid;
        if (typeof playerId == 'undefined'|| typeof squareId == 'undefined' ){
            logger.info('gameModel.turn(): invalid input data.');
        }

        if ( this.turnBuf[playerId] != 0 ) {
            logger.debug(data, playerId, squareId);
            logger.debug(this.turnBuf);
            logger.info('gameModel.turn(): this turn action has been already taken.');
        } else if ( squareId < 1 || squareId > 81 ) {
            logger.debug('gameModel.turn(): wrong square-id.');
        } /*else if (!checkAction(this, squareId)) {
            logger.info('gameModel.turn(): wrong action - the square has been used.');
        }*/ else {
            if (!checkAction(this, squareId)) {
                logger.info('gameModel.turn(): wrong action - the square has been used.');
                this.turnBuf[playerId] = -1;
            } else {
                this.turnBuf[playerId] = squareId;
            }
            var result = this.endTurn();
            logger.info('gameModel.turn() ' + result['changes']);
            // TODO could be an empty object, if all players collide with each other
            if (typeof result['changes'] != 'undefined') {
                logger.debug('gameModel.turn(): the end of the ' + this.turnCounter);
                printChanges(result);
                return result;
            }
        }
    },
    print: function() {
        logger.debug('state '+ this.state);
        logger.debug('turn '+ this.turnCounter);
        logger.debug('big '+ this.big);
        var s = 'small: ';
        for (var key in this.small) {
            s += ' ' + key + ': ' + this.small[key];
        }
        logger.debug(s);
        logger.debug('turn_buf '+ this.turnBuf);
    },
    useDependencies: function()
    {
        var temp = [0];
        var bigSquareId;
        logger.debug('useDependencies()', 3);
        for(var i=0; i < this.turnBuf.length; i++) {
            if(this.turnBuf[i] <= 0) {
                continue;
            }
            bigSquareId = this.turnBuf[this.dependencies[i]];
            temp.push(baseNumber * (bigSquareId - 1) + this.turnBuf[i]);
            logger.debug(bigSquareId);
        }
        logger.debug(temp, 3);
        this.turnBuf = temp;
    },
    endTurn: function()
    {
        for(var i = 1; i < this.turnBuf.length; i++) {
            if (this.turnBuf[i] === 0) {
                return {};
            }
        }

        // The square has been already used in  one of the previous turns.
        for(var i = 1; i < this.turnBuf.length; i++) {
            if (this.turnBuf[i] === 0) {
                return {};
            }
        }

        // Calculate the actual square ids and put them into the current turnBuf.
        this.useDependencies();
        // logger.debug(this);

        // The game sends its changes to clients using the structure
        var result = {'small': [],
            'big': [],
            'winner': '',
            'changes': [],
            'collision': []
        };

        // Set the small grid according with the current turn.
        // Set small square to an empty value, in case of collision.
        for(i = 1; i < this.turnBuf.length; i++) {
            // this is the pair with already processed collision
            if(this.turnBuf[i] === 0) {
                continue;
            }
            var collisionPlayerId = isTurnCollision(this, this.turnBuf[i], i);
            if(collisionPlayerId > 0) {
                this.small[this.turnBuf[i]] = 'C';
                // put the square into collision list
                result.collision.push(this.turnBuf[i]);
                this.turnBuf[i] = 0;
                this.turnBuf[collisionPlayerId] = 0;
                continue;
            }

            if ( this.players['X'].includes(i) )
            {
                this.small[this.turnBuf[i]] = 'X';
                logger.debug("X " + i);
            }
            else {
                this.small[this.turnBuf[i]] = '0';
                logger.debug('0 ' + i);
            }
        }
        this.turnCounter += 1;

        result['small'] = this.checkSmall();
        result['big'] = this.checkBig(result);
        result['winner'] = this.checkWinner(result['big']);
        result['changes'] = getSmallDiff(this);
        this.turnBuf = [ 0, 0, 0, 0, 0, 0, 0];
        this.winner = result['winner'];
        return result;
    },
    // { 'X': [1,2], '0': [3] }
    checkWinner: function(changes) {
        var winner = [];
        var id;
        var i;
        var rows;
        var dummyGame = {'small': this.big};

        for (var symbol of ['X','0']) {
            for(i = 0; i < changes[symbol].length; i++) {
                rows = checkRows(dummyGame, changes[symbol][i], symbol);
                if(rows.length == 3)
                    winner.push(symbol);
            }
        }

        if (winner.length == 0)
            return false;
        else if (winner.length == 1)
            return winner[0];
        else if (winner.length == 2)
            return 'draw';
    },
    checkBig: function(input) {
        var result = {'X': [], '0': []};
        var bigId;
        var line = [];

        //for (var k in input['small']) {
        //    logger.info(input['small'][k]);
        //}

        //logger.info('checkBig(): ' + input['small']);
        for(key in input['small']['X']) {
            //logger.info(input['small']['X'][key]);
            bigId = getBigId(input['small']['X'][key]);
            if(this.big[bigId] == 'E') {
                result['X'].push(bigId);
                this.big[bigId] = 'X';
            }
        }
        for(key in input['small']['0']) {
            //logger.info(input['small']['0'][key]);
            bigId = getBigId(input['small']['0'][key]);
            if(this.big[bigId] == 'E') {
                result['0'].push(bigId);
                this.big[bigId] = '0';
            }
        }
        return result;
    },
    checkSmall: function() {
        var result = {'X': [], '0': []};
        logger.debug('gameModel.checkSmall(): enter');
        for(var i = 1; i < this.turnBuf.length; i++) {
            if(this.turnBuf[i] === 0) {
                continue;
            }
            if(this.players['X'].includes(i)) {
                var intResult = checkRows(this, this.turnBuf[i], 'X');
                if (intResult.length > 0)
                    logger.debug('gameModel.checkSmall(): small row for X team ' + intResult);
                result['X'].push(intResult);
            }
            else {
                var intResult = checkRows(this, this.turnBuf[i], '0');
                if (intResult.length > 0)
                    logger.debug('gameModel.checkSmall(): small row for 0 team' + intResult);
                result['0'].push(intResult);
            }
        }
        return result;
    },
    getCurrentState: function () {
        return {'small': this.small,
                'big': this.big,
                'winner': this.winner,
                'players': this.players,
                'playerPokeArea': this.playerPokeArea
        };
    },
    ping: function() {
        return {state: this.state, turn: this.turnCounter};
    },
    incTurn: function() {
        this.turnCounter += 1;

    },
    getPlayerId: function(obj) {
        var result = {'playerid': 0};
        if(typeof obj.faction != 'undefined'
            && (obj.faction == 'X' || obj.faction == '0')) {
            logger.debug('get player id',3);
            for(var playerid of this.players[obj.faction]) {
                if(!this.usedSlots.includes(playerid)) {
                    result.playerid = playerid;
                    this.usedSlots.push(playerid);
                    break;
                }
            }
        }
        if (this.usedSlots.length == this.players['X'].length + this.players['X'].length &&
            this.state == 'stopped' )
        {
            this.start();
            result['begin'] = true;
        }
        return result;
    },
    resetState: function() {
        this.big = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E','E', 'E'];
        this.small = {};
        this.dependencies = { 1: 2, 2: 3, 3:1, 4:5, 5:6, 6:4 };
        this.turnBuf = [ 0, 0, 0, 0, 0, 0, 0];
        this.playerPokeArea = [ 0, 0, 0, 0, 0, 0, 0];
        this.turnCounter = 1;
        this.usedSlots = [];
        this.state = 'stopped';
    },
    actionAllowed: function(obj) {
        //logger.debug(obj,4);
        if ( this.state == 'in progress'
            && obj.hasOwnProperty('playerid')
            && obj.playerid >= 1
            && obj.playerid <= this.players['X'].length + this.players['X'].length
            && this.usedSlots.includes(obj.playerid))
        {
            return true;
        }
        return false;
    },
    playerAlive: function(msg) {
        this.playerPokeArea[msg.playerid] = 0;
    },
    pokePlayers: function() {
        var pokePlayersArray = [];
        if(!this.isStarted())
            return pokePlayersArray;

        for (var i = 1; i < this.playerPokeArea.length; i++) {
            if(this.usedSlots.includes(i)) {
                this.playerPokeArea[i] += 1;
            }
            logger.debug(this.playerPokeArea[i],4);
            if(this.playerPokeArea[i] >= PLAYER_TO && this.usedSlots.includes(i)) {
                pokePlayersArray.push(i);
                this.playerPokeArea[i] = 0;
            }
        }
        logger.debug('pokePlayersArray:', 4);
        logger.debug(pokePlayersArray,4);
        logger.debug('usedSlots() before:', 4);
        logger.debug(this.usedSlots, 4);
        this.usedSlots = this.usedSlots.filter(x => !pokePlayersArray.includes(x));
        logger.debug('usedSlots() after:', 4);
        logger.debug(this.usedSlots, 4);
        return pokePlayersArray;
    },
    isStarted: function() {
        return this.state == 'in progress'
    }
}

module.exports = gameModel;
