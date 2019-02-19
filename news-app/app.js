var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newsRouter = require('./routes/news');

const app = express();

require('dotenv').config();
const VKONTAKTE_APP_ID = process.env.VKONTAKTE_APP_ID;
const VKONTAKTE_APP_SECRET = process.env.VKONTAKTE_APP_SECRET;

//passport config
require('./config/passport.js')(passport);

//vk passport config
require('./config/vk-passport.js')(passport, VKONTAKTE_APP_ID, VKONTAKTE_APP_SECRET);

//db connection
const connectionString = require('./config/keys.js').ConnectionString;
mongoose.connect(connectionString, { useNewUrlParser: true});

// view engine setup
app.use(expressLayout);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get('/auth/vkontakte', passport.authenticate('vkontakte'));
app.get('/auth/vkontakte/callback', passport.authenticate('vkontakte', { 
      successRedirect: '/news',
      failureRedirect: '/users/login' })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.redirect('error');
});

module.exports = app;
