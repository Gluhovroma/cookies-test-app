var express = require('express');
var pg = require('pg');
var multer = require('multer');
var CookiesData = require('../components/cookies-data.js');

var config = {
  user: 'postgres', //env var: PGUSER
  database: 'vitamin-cookies', //env var: PGDATABASE
  password: '123', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

var cookiesData = new CookiesData(pool);

cookiesData.createTable();


pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	if(file.fieldname == 'photo_file'){
  		cb(null, './public/imgs/')
  	}  	
  },
  filename: function (req, file, cb) { 
  	if(file.fieldname == 'photo_file') {  		
  	   cb(null, Date.now()+ '.jpg');  				
  	}  	 
  }
})

var upload = multer({ storage: storage });
var photoUpload = upload.single('photo_file');


function isAuthenticated (req, res, next) {
	
	if (req.isAuthenticated()){
		return next();
	}

	return res.send(401, {message: "Ошибка авторизации."});
};


var router = express.Router();

//Register the authentication middleware
router.use('/add-cookies', isAuthenticated);
router.use('/like-cookies', isAuthenticated);
router.use('/dislike-cookies', isAuthenticated);


router.route('/cookies/?:offset?:filter?')

	.get(function(req, res) {	

		cookiesData.getCookies(req.query.offset, req.query.filter)
		   .then(result => {
		   		return res.send(200, result);		   	   
		   },
		   err => {
				return res.send(500, err);
		   })	
	}) 	

router.route('/add-cookies')
	.post(photoUpload, function(req, res){
		console.log("im post");
		var cookies = {
			'title': req.body.title,
			'description': req.body.description,
			'img': '',
			'userId': 1
		}

		if (req.file) {
			cookies.img = '/public/imgs/'+ req.file['filename'];
		}	
		
		cookiesData.saveCookies(cookies)
			.then(() => {
				res.send(200, null);
			})
	})	

router.route('/like-cookies/:id')
	.get(function(req, res){
		console.log(req.user);
		cookiesData.likeCookies(req.user[0].id, req.params.id)
			.then(() => {
				return res.send(200, null)
			},
			err => {
				return res.send(500, err)
			})
	})	

router.route('/dislike-cookies/:id')
	.get(function(req, res){
		cookiesData.dislikeCookies(req.user[0].id, req.params.id)
			.then(() => {
				return res.send(200, null)
			},
			err => {
				return res.send(500, err)
			})
	})	

module.exports = router;