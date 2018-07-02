var LocalStrategy = require('passport-local').Strategy; 
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./models/user');
var config = require('./config');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(_id, function(err, user) {
			done(err, user);
		});
	});

	//----------- For login Process -----------

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		User.findOne({'email':  email}, function(err, user) {
			if (err) {
				req.flash('formdata', req.body);
				return done(err);
			}
			if (!user) {
				req.flash('formdata', req.body);
				return done(null, false, req.flash('Error', 'User not found.'));
			}
			if (!user.validPassword(req.body.password)) {
				req.flash('formdata', req.body);
				return done(null, false, req.flash('Error', 'Authentication failed. Wrong password.'));
			}
			return done(null, user);
		});
	
	}));	

	//-------- For Signup (Registration Process) ------------

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true 
	},
	function(req, email, password, done) {
		User.findOne({'email':  email }, function(err, user) {
			if (err) {
				req.flash('formdata', req.body);
				return done(err);
			}
			if (user) {
				req.flash('formdata', req.body);
				return done(null, false, req.flash('Error', 'This email is already registerd.'));
			} else {
				var newUser = new User();

				newUser.email = req.body.email;
				newUser.password = newUser.generateHash(req.body.password);
				newUser.name = req.body.name;
				newUser.user_type = req.body.user_type;

				newUser.save(function(err) {
					if (err) {
						console.log(err);

						return done(null, false, req.flash(err));
					}
					return done(null, newUser);
				});
			}
		});
		
	}));

	// ------------- Use of passport-jwt for authenticate token

	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
	opts.secretOrKey = config.jwtSecret;

	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		User.findOne({email: jwt_payload.email}, function(err, user) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	}));
}