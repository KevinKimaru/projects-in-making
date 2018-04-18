var loginHandler = require('../handlers/login');
var csrf = require('csurf');
var express = require('express');
var passport = require('passport');

module.exports = {
    registerRoutes: function (app) {
        app.get('/login', function (req, res, next) {
            csrf();
            next();
        },
            function (req, res) {
                errors = req.session.flash;
                res.render('login', { csrfToken: req.csrfToken(), layout: false, errors: errors });
            });

        var Employee = require('../model/employee');
        var bcrypt = require('bcrypt');
        var LocalStrategy = require('passport-local').Strategy;
        passport.use(new LocalStrategy({
            username: 'username',
            password: 'password'
        }, function (username, password, done) {
            console.log('Employee not found');
            Employee.findOne({ email: username, role: 'admin' }, function (err, employee) {
                if (err) return done(null, false);
                if (!employee) {
                    console.log('Employee not found');
                    return done(null, false);
                } else {
                    bcrypt.compare(password, employee.password, function (err, result) {
                        if (result) {
                            console.log('Successfully validated');
                            return done(null, employee);
                        } else {
                            console.log('Insuccessfully validated. ');
                            return done(null, false);
                        }
                    });
                }
            })
        }));
        passport.serializeUser(function (admin, done) {
            done(null, admin.id);
        });

        passport.deserializeUser(function (id, done) {
            Employee.findById(id, function (err, employee) {
                if (err) return done(err);
                done(err, employee);
            });
        });

        app.use(passport.initialize());
        app.use(passport.session());

        app.post('/login', function (req, res, next) {
            csrf();
            next();
        },
            passport.authenticate('local', {
                failureRedirect: '/login',
            }),
            function (req, res) {
                res.redirect('/');
            });

        app.get('/logout',
            function (req, res) {
                req.logout();
                res.redirect('/login');
            });
    },

    ensureAuthenticated: (req, res, next) => {
        if (!req.session.passport.user) {
            req.session.flash = {
                type: 'danger',
                intro: 'Error!',
                message: 'You are not logged in',
            };
            res.redirect('/login');
        } else {
            return next();
        }
    }
};