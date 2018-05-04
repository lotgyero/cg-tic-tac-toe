var express = require('express');
var router = express.Router();
var gameModel = require('../logic.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.redirect('/menu');
  gameModel.turn(req.query.player, req.query.id);
  res.render('index', {model: gameModel});
 //gameModel.state = 'active';
});

module.exports = router;
