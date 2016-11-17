var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Content-Type, Authorization, Content-Length, X-Requested-With, X-Custom-Header');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
    	res.header('Access-Control-Allow-Origin', '*')
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));     !!!!!!!!!!!!!!!!!!
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(session({
  secret: 'keyboard cat'
}));

var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);



app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false },{limit: '50mb'}));
app.use(cookieParser());
// make express look in the public directory for assets (css/js/img)
//app.use(express.static(path.join(__dirname, 'public'))); !!!!!!!!!!!!!!!!!!!!!!!!!
app.use(express.static(__dirname + '/'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authenticate);
app.use('/api', api);

// set the home page route
app.get('/', function(req, res) {
	// ejs render automatically looks in the views folder
	res.render('index');
});


var initPassport = require('./passport-init');
initPassport(passport);




// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});