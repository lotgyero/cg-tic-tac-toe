var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
const logger = require('../logger');


router.route('/')
    .get((req, res) => {
        res.sendFile('/git/cg-tic-tac-toe/public/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            secret = req.body.secret;
            logger.debug('login ' + username + ' ' + secret);
            User.findOne({ where: { username: username } }).then(function (user) {
                logger.debug('after findOne ' + JSON.stringify(user));
            if (!user) {
                res.redirect('/menu');
            } else if (!user.validSecret(secret)) {
                res.redirect('/menu');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/menu');
            }
        })
});

module.exports = router;
