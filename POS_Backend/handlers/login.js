var Employee = require('../model/employee');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local');

exports.login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    //validation
    // req.checkBody('email', 'Email is required').notEmpty();
    // req.checkBody('password', 'Password is required').notEmpty();
    // req.checkBody('email', 'Email is not valid').isEmail();
    // // req.checkBody('password2', 'Passwords do not  match').equals(req.body.password);

    // var errors = req.validationErrors();

    // if(errors) {
    //     res.status(401).send('Errors found in your data');
    // } else {

    // }
    console.log("I was here 1");
    res.redirect('/');

};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated) {
        return next();
    } else {
        res.session.flash = {
            type: 'danger',
            intro: 'Error!',
            message: 'You are not logged in',
        };
        res.redirect('/login');
    }
}

exports.getLogin = function (req, res) {
    res.render('login', { csrfToken: req.csrfToken() });
}

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};