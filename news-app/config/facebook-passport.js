const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();

module.exports = (passport) => {
    /*passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://www.example.com/auth/facebook/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOrCreate(..., function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
      }
    ));*/

    /* Facebook authentication */
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/news',
                                        failureRedirect: '/users/login' }));
}