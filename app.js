var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');


var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);


var app = express();


// view engine setup
//app.set('views', path.join(__dirname, 'views'));     !!!!!!!!!!!!!!!!!!
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(session({
  secret: 'keyboard cat'
}));
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