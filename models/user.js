var mongoose = require('mongoose');
var config = require('../config');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { 
		type: 'String'
	},
	email: {
		type: 'String', 
		Unique: true 
	},
	password: { 
		type: 'String', 
	}
});

// Connect to database

mongoose.Promise = global.Promise;

mongoose.connect(config.mongoURL);  

var bcrypt = require('bcrypt-nodejs');

// Saves the user's password hashed
UserSchema.methods.generateHash = function(password) {  
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Create method to compare password input to password saved in database
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);  
