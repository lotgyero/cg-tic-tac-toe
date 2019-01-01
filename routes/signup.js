var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
const logger = require('../logger');

// Replace with a passport check
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/menu');
    } else {
        next();
    }    
};

router.route('/')
    .get(sessionChecker, (req, res) => {
        res.sendFile('/git/cg-tic-tac-toe/public/signup.html');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            secret: req.body.secret
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/menu');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });
module.exports = router;
