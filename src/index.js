/**
 * Module dependencies.
 */

var app = require('./app');
var gameModel = require('./logic');
var debug = require('debug')('cg-tic-tack-toe:server');
var http = require('http');
var logger = require('./logger');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.APP_PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * socket.io
 */
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  var turnCounter = gameModel.turn;

  /**
    * Maintenance event used while testing.
    */
  socket.on('print', function () {
    socket.emit('printOut', gameModel);
  });

  /**
    * The event fires when a player wants to join the game from the menu.
    */
  socket.on('get player id', function (msg) {
    logger.debug('get player id: ' + JSON.stringify(msg) + ' from: ' + socket.handshake.address);
    //TODO add socket id to the list for auth checks
    var result = gameModel.getPlayerId(msg, socket.handshake.address);
    socket.emit('playerid', result);
    io.sockets.emit('player online', result); // Tell the players he is online
    if(result.hasOwnProperty('begin') && result['begin'] === true) {
        logger.debug('the game has begun',4);
        logger.debug(result,4);
        // Delay the game start, since
        // the last player won't process the event properly.
        setTimeout(function(size) {
            io.sockets.emit('game starts', {'begin': true, 'size': size});
        }, 1000, gameModel.getFieldSize());
    }
  });

  /**
    * Fires when the server receives an action from a player.
    */
  socket.on('turn', function(data) {
    if(typeof data != 'undefined' && gameModel.playerAllowed(data) &&
        gameModel.winner === false) {
        var msg = gameModel.turn(data);
        if (typeof msg != 'undefined') {
          logger.debug('www turn(): ' + JSON.stringify(data));
          logger.debug('www turn(): ' + JSON.stringify(msg));
          io.sockets.emit('turn ends', msg);
        } else {
            io.sockets.emit('player action', { 'playerid': data.playerid });
            logger.debug('Action was allowed.');
        }
      }
  });

  /**
   * Fires on window refresh or initial window load.
   */
  socket.on('get state', function () {
      var msg = gameModel.getCurrentState();
      logger.debug('socket state():', 1);
      socket.emit('current state', msg);
    });

  /**
    * Reset the game
    * TODO Make this more secure
    */
  socket.on('reset', function () {
    logger.err('Got reset request from: ' + socket.handshake.address);
    gameModel.resetState();
  });

  // Used for player online status checking.
  socket.on('alive', function(msg) {
    gameModel.playerAlive(msg);
  });

});

/**
 * Checks the online status of players and sends the checking messages.
 */
var emitCheck = function() {
    var zombiePlayers = gameModel.pokePlayers();
    if(zombiePlayers.length > 0) {
        io.sockets.emit('disconnected players', {'zombies': zombiePlayers});
    }
    if(gameModel.isStarted()) {
        //logger.debug('check', 4);
        io.sockets.emit('check');
    }
};

/**
 * Emits check message each 10 seconds
 */
setInterval(emitCheck, 10000);

/**
 * menu room
 */
var menuSocket = io.of('/');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
