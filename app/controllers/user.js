const express = require('express')
const model = require('../db/db.js')
const router = express.Router()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/createToken.js')
const sha1 = require('sha1')
const checkToken = require('../middleware/checkToken.js')

// 注册
const Register = (req, res) => {
	let userRegister = new model.User({
		tel: req.body.tel,
		password: sha1(req.body.password),
		name: req.body.name,
		token: createToken(this.tel)
	})

	// 将 objectid 转换为 用户创建时间
	userRegister.create_time = moment(objectIdToTimestamp(userRegister._id))
		.format('YYYY-MM-DD HH:mm:ss');

	model.User.findOne({
		tel: (userRegister.tel)
	}, (err, doc) => {
		if(err) console.log(err)
		// 用户名已存在，不能注册
		if(doc) {
			res.json({
				success: false
			})
		} else {
			userRegister.save(err => {
				if(err) console.log(err)
				console.log('register success')
				res.json({
					success: true
				})
			})
		}
	})
}

// 登录
const Login = (req, res) => {
	//console.log(res.body)
	let userLogin = new model.User({
		tel: req.body.tel,
		name: req.body.name,
		password: sha1(req.body.password),
		token: createToken(this.tel)
	})
	//console.log(userLogin)
	model.User.findOne({ tel: userLogin.tel }, (err, doc) => {
		if(err) console.log(err)
		if(!doc) {
			console.log("账号不存在");
			res.json({
				info: false
			})
		} else if(userLogin.password === doc.password) {
			console.log('登录成功')
			//console.log(req.body)
			var name = req.body.name;
			res.json({
				success: true,
				name: doc.name,
				// 账户创建日期
				time: moment(objectIdToTimestamp(doc._id))
					.format('YYYY-MM-DD HH:mm:ss'),
				// token 信息验证
				token: createToken(name)
			})
		} else {
			console.log('密码错误')
			res.json({
				success: false
			})
		}
	})
}


// 所有用户打印
const User = (req, res) => {
	model.User.find({}, (err, doc) => {
		if(err) console.log(err)
		res.send(doc)
	})
}

module.exports = (router) => {
	router.post('/register', Register)
	router.post('/login', Login)
	router.get('/user', checkToken, User)
}
