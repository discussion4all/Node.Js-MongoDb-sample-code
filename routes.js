var express = require('express');
var router = express.Router();
var passport = require('passport');
require('./passport')(passport);
var multer = require('multer');
var userController = require('./controllers/userController');

/* -----------------------Route For Login Process --------------------- */
router.get('/login', userController.getLogin);

router.post('/login', function(req, res, next) {
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		req.flash('formdata', req.body);
		req.flash('Error', messages);
	}
	next();
}, passport.authenticate('local-login', {
	failureRedirect : '/login', 
	failureFlash : true
}), userController.login);

/* -------------------- Route for Registration Process ---------------- */
router.get('/registration', userController.getSignup);
router.post('/registration', function(req, res, next) {
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		req.flash('formdata', req.body);
		req.flash('Error', messages);
	}
	next();
},  passport.authenticate('local-signup', {
	failureRedirect : '/registration', 
	failureFlash : true
}), userController.signup);

/* --------------- Middleware for get Token  --------- */
var authorizeToken = function(req, res, next){
	// Set authorization header for token
	if(req.session.token) {
		req.headers.authorization = 'JWT ' + req.session.token; 
		next();
	} else {
		return res.status(403).send({success: false, message: 'Unauthorized.'});
	}
};

/* ------------- Middleware for authenticate token ----------- */
var passportAuthentication =  passport.authenticate('jwt', {session: false});

router.get('/display', authorizeToken, passportAuthentication, userController.userList);

router.get('/edit/:id', authorizeToken, passportAuthentication, userController.userEdit);

router.post('/edit', authorizeToken, passportAuthentication, userController.edit);


router.get('/delete/:id', authorizeToken, passportAuthentication, userController.delete);

router.get('/logout', userController.logout);

module.exports = router;