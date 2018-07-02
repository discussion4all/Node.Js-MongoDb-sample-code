var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var User = require('./models/user');
var passport = require('passport');
var flash = require('connect-flash'); 
var routes = require('./routes');
var expressValidator = require('express-validator');
var $ = require('jquery');

var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "views")));

app.use(express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(flash());
app.use(expressValidator());

app.use(passport.initialize());

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use('/', routes);

app.listen(3000, function() {
  console.log("Express running on port : 3000");
});

module.exports = app;