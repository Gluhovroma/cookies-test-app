var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var pg = require('pg');
var UserData = require('./components/user-data.js');

module.exports = function(passport){

	var config = {
	  user: 'postgres', //env var: PGUSER
	  database: 'vitamin-cookies', //env var: PGDATABASE
	  password: '123', //env var: PGPASSWORD
	  host: 'localhost', // Server hosting the postgres database
	  port: 5432, //env var: PGPORT
	  max: 10, // max number of clients in the pool
	  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
	};

	var pool = new pg.Pool(config);
	var userData = new UserData(pool);

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
	console.log("serializeUser");		
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	console.log("deserializeUser");		
		userData.findById(id)
			.then(user => {				
				done(null, user);
			})
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			console.log("work");
			userData.findByName(username)
				.then((user) => {

					// // Username does not exist, log the error and redirect back
					if (!user){
						console.log('User Not Found with username '+username);
						return done(null, false);                 
					}
					// // User exists but wrong password, log the error 
					if (!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false); // redirect back to login page
					}
					// // User and password both match, return user from done method
					// // which will be treated like success					
					return done(null, user);
				},
				err => {					
					return done(err);
				})	
		}
	));

	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
	
	userData.createTable()
		.then(() => {
			userData.createUser('user', createHash(12345));
			userData.createUser('user1', createHash(12345));
			userData.createUser('user2', createHash(12345));	
		})
	
};
