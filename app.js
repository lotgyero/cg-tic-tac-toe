var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport')
const session = require('express-session')
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var menuRouter = require('./routes/menu');
var gameRouter = require('./routes/game');
var spectatorRouter = require('./routes/spectator');
var configRouter = require('./routes/config');

var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}))

// auth
require('./auth').init(app)
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Local session storage 
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    //console.log(JSON.stringify(req.session));
    //console.log(JSON.stringify(req.cookies));
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

app.use('/', indexRouter);
app.use('/menu', menuRouter);
app.use('/game', gameRouter);
app.use('/spectator', spectatorRouter);
app.use('/config', configRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
