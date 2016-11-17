var express = require('express');
var router = express.Router();

module.exports = function(passport){

		
	router.post('/login',function(req, res, next) {
	  passport.authenticate('login', function(err, user) {
	  	
	  	if (err) { return next(err); }
	  	
    	if (!user) { 
    		return res.status(200).send({state: 'failure', user: null, message: "Invalid username or password"}); 

    	}
	    req.logIn(user, function(err) {
	       res.status(err ? 500 : 200).send(err ? err : {state: 'success', user: req.user ? req.user : null});
	      
	    });
	  })(req, res, next);
	});

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;

}