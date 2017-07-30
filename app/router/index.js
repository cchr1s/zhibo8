var User = require('../controllers/user')
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()
var express = require('express')
const router = express.Router()
const news = require('./news')
var app = express()


//User(router)
//news(router)
//module.exports = function(app){	
	//pre handle user
	/*app.use(function(req, res, next){
		var _user = req.session.user
		app.locals.user = _user

		next()

	})*/

	//index 
	/*app.get('/', (req,res) => {
	  	res.send('Hello Express!')
	})*/

	//app.use('/api',news)

	//user
	/*app.post('/user/signup', User.signup)
	app.post('/user/signin', User.signin)
	app.get('/signin', User.showSignin)
	app.get('/signup', User.showSignup)
	app.get('/logout', User.logout)
	app.get('/admin/userlist',User.signinRequired, User.adminRequired, User.list)*/
//}

//module.exports = router