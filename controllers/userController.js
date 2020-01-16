var mongoose = require('mongoose');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var ObjectID = require('mongodb').ObjectID;
var fs = require("fs");

// --------- Login Page ------
module.exports.getLogin = function(req, res, next) {
	res.render('login', { error: req.flash('Error'), formData : req.flash('formdata')[0], success :req.flash('success'),title: "login"});
}

module.exports.login = function(req, res, next) {
	generateToken(req);
	User.findOne({'email' : req.body.email}, function(err, user) {
		if (err) {
			throw err;
		}
		if (user) {
			res.redirect('/display');
		}
	});

}

//--- Generate Token
function generateToken(req) {
	/* --------- Generate Token using passport-jwt and web Token----------- */
	var token = jwt.sign({email: req.user.email, name: req.user.name}, config.jwtSecret);
	req.session.token = token; // Save token in session
}

// --------- Registration Page ------
module.exports.getSignup = function(req, res) {
	res.render('signup', { error: req.flash('Error'), formData : req.flash('formdata')[0], title: "Signup"});
}

module.exports.signup = function(req, res) {
	generateToken(req);
	res.redirect('/login');
}

//---Logout
module.exports.logout = function(req, res) {
	req.logout();
	req.session.destroy(); // Session Destroy
	res.redirect('/login');
}

//--- User List
module.exports.userList = function(req, res) {
	User.find({} ,function(err,result){
		if(err){

		}
		else{
			res.render('display', { data : result, title: "Display"});
			/*console.log(result);*/
		}
	});

}

//--- User Edit -- Fetch data
module.exports.userEdit = function(req, res) {

	User.findOne({'_id' : req.params.id}, function(err, user) {
		if (err) {
			throw err;
		}
		if (user) {
			console.log('edit call')
			res.render('edit', { data : user, title: "Edit"});
		}
	});

}

//--- User Edit Update Data
module.exports.edit = function(req, res) {

	var query = {_id : new ObjectID(req.body.hdId)};
	var updateData = {$set : {
		email : req.body.email,
		name : req.body.name
	}};
	User.update( query,updateData,function(err,result){
		if(err){
			console.log(err);
		}else{
			res.redirect("/display");
		}

	});
}

//--- User Edit Delete Data
module.exports.delete = function(req, res) {

	var query = {_id : new ObjectID(req.params.id)};
	User.remove(query,function(err,result){
		if(err){

		}else{
			res.redirect("/display",{title: "Display"});
		}
	});
}
