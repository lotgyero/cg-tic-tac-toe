/*
* Game logic.
*/

var Math = require('mathjs');

var logger = require('./logger');

const baseNumber = 9; // Number of small squares in a big one

const PLAYER_TO = 4; // User online check timeout PLAYER_TO * 10 secs

/**
* Create DB connection pool  (Postgres)

$ PGUSER=dbuser \
  PGHOST=database.server.com \
  PGPASSWORD=secretpassword \
  PGDATABASE=mydb \
  PGPORT=5432 \
  npm run devstart
*/
const { Pool, Client } = require('pg')
const pool = new Pool();


/**
 * Checks whether the small grid square is free or not.
 */
var actionAllowed = function(obj, squareId) {
    if(obj.small[squareId] == 'X' || obj.small[squareId] == '0'
    || squareId < 1 || squareId > 81)
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

/**
 * Produces lines with small squares, taken by the teams.
 */
var getSmallDiff = function(obj) {
    var result = {'X': [], '0': []}
    for(var i = 1; i < obj.turnBuf.length; i++)
    {
        if(!actionAllowed(obj, obj.turnBuf[i])) {
            logger.debug('getSmallDiff() not allowed: turnBuf[i] ' + obj.turnBuf[i], 5);
            continue;
        }
        if(obj.players['X'].includes(i)) {
            result['X'].push(obj.turnBuf[i]);
        } else {
            result['0'].push(obj.turnBuf[i]);
        }
    }
    logger.debug('getSmallDiff() X: ' + JSON.stringify(result['X']));
    logger.debug('getSmallDiff() 0: ' + JSON.stringify(result['0']));
    return result;
}

/**
 * Produces lines with small squares, taken by the teams.
 */
var getBigId = function(line) {
    return Math.fix(line[0] / 9) + 1;
}

/**
 * Utility f() that is used to output changes with the turn ends.
 */
var printChanges = function(result) {
    logger.debug('printChanges(): result small ' + JSON.stringify(result.small));
    logger.debug('printChanges(): result big ' + JSON.stringify(result.big));
    logger.debug('printChanges(): result winner ' + JSON.stringify(result.winner));
    logger.debug('printChanges(): result changes ' + JSON.stringify(result.changes));
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
 * Get random int value
 */
var randomIntInc = function(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

/**
 * Built string representation of a player e.g. X1 or 03
 */
var getPlayerIdRepr = function(id) {
    var result = '';
    if (id >= 1 && id <= 3)
        result = 'X' + id;
    if (id >= 4 && id <= 6)
        result = '0' + (id - 3);
    return result;
}

/**
 * Main game model.
 */
var gameModel = {
    bigSize: 9,
    smallSize: 9,
    state : 'stopped', // game current state
    turnCounter: 1, // turn counter
    players : { 'X': [1, 2, 3], '0': [ 4, 5, 6 ]}, // players' ids
    usedSlots: [], // Player ids used
    big : ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E','E', 'E'], // left to right, top to bottom
    small : {}, // left to right, top to bottom, inside big square, then the next one
    dependencies: { 1: 2, 2: 3, 3: 1, 4: 5, 5: 6, 6: 4 }, // Player actions inter-dependencies
    turnBuf : [ 0, 0, 0, 0, 0, 0, 0], // current turn actions
    playerPokeArea : [ 0, 0, 0, 0, 0, 0, 0], // check player online using the structure
    winner: false, // winner flag|info
    gameId: 0,// Id of this game
    playersDB : [0,0,0,0,0,0], // Id Players for save to DB
    start: function() {
        this.state = 'in progress';
        logger.info('gameModel.start');
    },
    turn: function(data) { // Fires when the player sends an action msg
        // Check for values
        var playerId = data.playerid;
        var squareId = data.squareid;
        if (typeof playerId == 'undefined'|| typeof squareId == 'undefined' ){
            logger.info('gameModel.turn(): invalid input data.');
        }

        if ( this.turnBuf[playerId] != 0 ) {
            logger.info('gameModel.turn(): this turn action has been already taken.');
        } else if ( squareId < 1 || squareId > 81 ) {
            logger.debug('gameModel.turn(): wrong square-id.');
        } else {
            logger.debug('turn() playerId ' + playerId + ' sqareId ' + squareId);
            this.turnBuf[playerId] = squareId;

            //RRR save turn to DB
            vals = [this.gameId, this.playersDB[playerId], playerId, squareId];
            pool.query('INSERT INTO turns(gameid, playerid, playernum, square) VALUES($1, $2, $3, $4)', vals, (err, res) => 
            {
                if (err) {
                    logger.debug('DB error by inserting new turn: ' + err.stack)
                } 
            });

            var result = this.endTurn();
            logger.info('gameModel.turn() ' + JSON.stringify(result['changes']));
            // TODO could be an empty object, if all players collide with each other
            if (typeof result['changes'] != 'undefined') {
                logger.debug('gameModel.turn(): the end of the ' + this.turnCounter);
                printChanges(result);

                //RRR save team_turn to DB
                vals = [this.gameId, 
                        result.winner,
                        JSON.stringify(result.small),
                        JSON.stringify(result.big),
                        JSON.stringify(result.changes),
                        JSON.stringify(result.collision),
                        JSON.stringify(result.deps),
                ];
                pool.query('INSERT INTO team_turns(gameid, winner, small, big, changes, collision, deps) VALUES($1, $2, $3, $4, $5, $6, $7)', vals, (err, res) => 
                {
                    if (err) {
                        logger.debug('DB error by inserting new team_turn: ' + err.stack)
                    }

                });

                return result;
            }
        }
    },
    print: function() { // utility
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
    useDependencies: function() // calculate the actual square ids using dependencies
    {
        var temp = [0];
        var bigSquareId;
        logger.debug('useDependencies()');
        for(var i=0; i < this.turnBuf.length; i++) {
            if(this.turnBuf[i] <= 0) {
                continue;
            }
            bigSquareId = this.turnBuf[this.dependencies[i]];
            temp.push(baseNumber * (bigSquareId - 1) + this.turnBuf[i]);
            //logger.debug('useDependencies() playerid ' + ( i ) + ' bsI ' + bigSquareId);
        }
        this.turnBuf = temp;
    },
    changeDependencies: function() // Change dependency matrix on collision
    {
        // Swap 1 with 4, 2 with 5, 3 with 6
        logger.debug('changeDependencies()');
        var userIds;
        var result = {};
        var tmp = 0;
        for(var i = 1; i <= 3; i++)
        {
            tmp = this.dependencies[i];
            this.dependencies[i] = this.dependencies[i + 3];
            this.dependencies[i + 3] = tmp;
            result[getPlayerIdRepr(i)] = getPlayerIdRepr(this.dependencies[i]);
            result[getPlayerIdRepr(i + 3)] = getPlayerIdRepr(this.dependencies[i + 3]);
        }
        /* random deps between faction members
        for(var elem in this.players)
        {
            userIds = Array.from(this.players[elem]);
            var randId;
            for(var el=0; el < this.players[elem].length; el++)
            {
                randId = Math.floor(Math.random() * userIds.length);
                randValue = userIds[randId];
                this.dependencies[this.players[elem][el]] = randValue;
                result[elem+(el+1)] = getPlayerIdRepr(randValue);
                userIds.splice(randId, 1);
            }
        }*/
        logger.debug('changeDependencies()' + JSON.stringify(result));
        return result;
    },
    endTurn: function() // fires when the turn ends
    // TODO refactor to make it smaller
    {
        //logger.debug("hit endTurn()", 9);
        // The square has been already used in  one of the previous turns.
        for(var i = 1; i < this.turnBuf.length; i++) {
            if (this.turnBuf[i] === 0) {
                return {};
            }
        }
        // Calculate the actual square ids and put them into the current turnBuf.
        this.useDependencies();
        // The game sends its changes to clients using the structure
        var result = {'small': [],
            'big': [],
            'winner': '',
            'changes': [],
            'collision': []
        };
        result['changes'] = getSmallDiff(this);
        // Set the small grid according with the current turn.
        // Set small square to an empty value, in case of collision.
        for(i = 1; i < this.turnBuf.length; i++) {
            // this is the pair with already processed collision
            if(this.turnBuf[i] === 0) {
                continue;
            }
            // the square had been taken or out of the game field
            if(!actionAllowed(this, this.turnBuf[i])) {
                logger.debug('endTurn(): used square hit ' + this.turnBuf[i], 4);
                this.turnBuf[i] = 0;
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
                //logger.debug("X " + i);
            }
            else {
                this.small[this.turnBuf[i]] = '0';
                //logger.debug('0 ' + i);
            }
        }
        result['deps'] = {};
        this.turnCounter += 1;
        if (result.collision.length >= 1){
            result['deps'] = this.changeDependencies();
        }

        result['small'] = this.checkSmall();
        result['big'] = this.checkBig(result);
        result['winner'] = this.checkWinner(result['big']);

        this.turnBuf = [ 0, 0, 0, 0, 0, 0, 0];
        this.winner = result['winner'];
        return result;
    },
    checkWinner: function(changes) { // Check for win conditions
        var winner = [];
        var i;
        var rows;
        var dummyGame = {'small': this.big};

        for (var symbol of ['X','0']) {
            for(i = 0; i < changes[symbol].length; i++) {
                rows = checkRows(dummyGame, changes[symbol][i], symbol);
                logger.debug('checkRows() rows: ' + rows, 5);
                if(rows.length == 3)
                    winner.push(symbol);
            }
        }

        if (winner.length == 0)
            return false;
        else if (winner.indexOf('X') != -1 && winner.indexOf('0') != -1)
            return 'draw';
        else if (winner.indexOf('X') != -1)
            return 'X';
        else if (winner.indexOf('0') != -1)
            return '0';
    },
    checkBig: function(input) { // Check for a big line set
        var result = {'X': [], '0': []};
        var bigId;
        var line = [];

        for(key in input['small']['X']) {
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
    checkSmall: function() { // Check for a small line set
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
    getCurrentState: function () { // Returns current game status for a player
        var players_done = [];
        for(var i =1; i < this.turnBuf.length; i ++) {
            if(this.turnBuf[i] > 0)
                players_done.push(i);
        }
        return {'small': this.small,
                'big': this.big,
                'winner': this.winner,
                'players': this.players,
                'playerPokeArea': this.playerPokeArea,
                'players_done': players_done,
                'state': this.state,
                'used_slots': this.usedSlots
        };
    },
    ping: function() { // TODO remove this
        return {state: this.state, turn: this.turnCounter};
    },
    getPlayerId: function(obj, ipaddress) { // Fires when player connects and begins the game if full set.
        //logger.debug('getPlayerId():');
        var result = {'playerid': 0};
        if(typeof obj.faction != 'undefined'
        && (obj.faction == 'X' || obj.faction == '0')) {
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
        // RRR save game to DB
        gameId = this.gameId;
        if(gameId == 0 && result.playerid == 1) {
            vals = [null];
            pool.query('INSERT INTO games(players) VALUES($1) RETURNING *', vals, (err, res) => 
            {
              if (err) {
                logger.debug('DB error by inserting new game: ' + err.stack)
              } else {
                logger.debug('after game insert: ');
                logger.debug(res.rows[0]);
                gameId = res.rows[0]['id'];
                this.gameId = gameId;
              }
            });
        }
        // RRR save player to DB
        var self = this;
        function savePlayer2Stor() {
            vals = [result.playerid, gameId, getPlayerIdRepr(result.playerid), ipaddress,  null ];
            pool.query('INSERT INTO players(playernum, gameid, gamerole, ipaddress, userid) VALUES($1, $2, $3, $4, $5) RETURNING *', vals, (err, res) => 
            {
                if (err) {
                    logger.debug('DB error by inserting new player: ' + err.stack)
                } else {
                    logger.debug('after player insert:');
                    logger.debug(res.rows[0]);
                    id = res.rows[0]['id'];
                    logger.debug(self.playersDB);
                    self.playersDB[result.playerid] = id;
                }
            });
        };
        timeout = 1500; //(gameId==0) ? 3000 : 1;
        setTimeout(savePlayer2Stor, timeout);
        return result;
    },
    resetState: function() { // reset the game state on restart and while testing.
        this.big = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E','E', 'E'];
        this.small = {};
        this.winner = false;
        this.dependencies = { 1: 2, 2: 3, 3:1, 4:5, 5:6, 6:4 };
        this.turnBuf = [ 0, 0, 0, 0, 0, 0, 0];
        this.playerPokeArea = [ 0, 0, 0, 0, 0, 0, 0];
        this.turnCounter = 1;
        this.usedSlots = [];
        this.state = 'stopped';
        this.gameId = 0;
    },
    playerAllowed: function(obj) { // Player id sanity checks
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
    playerAlive: function(msg) { // Reset the playerPokeArea counters if the player answers the check.
        //logger.debug('playerAlive(): playerid ' + msg.playerid);
        this.playerPokeArea[msg.playerid] = 0;
    },
    pokePlayers: function() { // Check for players online status
        var pokePlayersArray = [];
        if(!this.isStarted())
            return pokePlayersArray;

        for (var i = 1; i < this.playerPokeArea.length; i++) {
            //logger.debug('pokePlayers(): i ' + i,4);
            if(this.usedSlots.includes(i) === true) {
                this.playerPokeArea[i] += 1;
            }
            //logger.debug('pokePlayers(): playerPokeArea[i] ' + this.playerPokeArea[i],4);
            if(this.playerPokeArea[i] >= PLAYER_TO && this.usedSlots.includes(i) === true) {
                logger.debug('pokePlayers(): TO ' + this.playerPokeArea[i]);
                pokePlayersArray.push(i);
                this.playerPokeArea[i] = 0;
            }
        }
        this.usedSlots = this.usedSlots.filter(x => !pokePlayersArray.includes(x));
        return pokePlayersArray;
    },
    isStarted: function() { // Utility
        return this.state == 'in progress'
    },
    getFieldSize: function() { //Utility used for game field size operations.
        return this.bigSize * this.smallSize;
    }
}

module.exports = gameModel;
