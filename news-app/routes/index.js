var express = require('express');
var router = express.Router();
var {ensureAuthenticated} = require('../config/auth.js');
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


/* GET logout page */
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
});


module.exports = router;
