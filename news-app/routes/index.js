var express = require('express');
var router = express.Router();
var {ensureAuthenticated} = require('../config/auth.js');
const passport = require('passport');
const wrap = require('async-middleware').wrap;

/* GET home page. */
router.get('/', wrap((req, res, next) => {
  res.render('index');
}));


/* GET logout page */
router.get('/dashboard', wrap((req, res, next) => {
  res.render('dashboard');
}));


module.exports = router;
