const VKontakteStrategy = require('passport-vkontakte').Strategy;

const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');

const vkConfig = require('./vk-keys.js');
const Users = require('../schemas/userSchema.js');

const app = express();

module.exports = (passport) => {
    passport.use(new VKontakteStrategy({
            clientID: vkConfig.VKONTAKTE_APP_ID,
            clientSecret: vkConfig.VKONTAKTE_APP_SECRET,
            callbackURL: vkConfig.CALLBACK_URL
        },
        (accessToken, refreshToken, profile, done) => {
            Users.findOrCreate({email: profile.email}, (err, user) => {
                return done(null, user);
            });
        }
    ));
}