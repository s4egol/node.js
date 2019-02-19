const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const wrap = require('async-middleware').wrap;
const {validateUserBody, validateUserRegistrationBody} = require('../validation/paramsValidation.js');

const User = require('../schemas/userSchema.js');

app.use(wrap(function (req, res) {
    return Promise.reject(x => {
        next(createError(500));
    })
}));

//Login
router.get('/login', wrap((req, res) => res.render("login")));

router.post('/login', validateUserBody(), wrap((req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/news',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}));

//Logout
router.get('/logout', wrap((req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}));

//Registration
router.get('/register', wrap((req, res) => res.render('register')));

router.post('/register', validateUserRegistrationBody(), wrap((req, res) => {
    const {email, password, password2} = req.body;

    let errors = [];

    if (!email || !password || !password2){
        errors.push({message: 'Please fill all fields'});
    }

    if (password != password2){
        errors.push({message: 'Passwords do not match'});
    }

    if (password.lenght < 6){
        errors.push({message: 'Password should be at least 6 characters'});
    }

    if (errors.length > 0) {
        res.render('register', { errors, email, password, password2});
    }
    else {
        User.findOne({email: email})
        .then((user) => {
            if (user) {
                errors.push({message: 'Email is already registered'});
                res.render('register', {errors, email, password, password2});
            } 
            else {
                const newUser = new User({
                    email: email,
                    password: password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser.save().then((err, obj) => {
                            req.flash('success_msg', 'You\'re registered and can log in');
                            res.redirect('/users/login');
                        }).catch(err => console.log(err));
                    })
                })
            }
        });
    }
}));

module.exports = router;
