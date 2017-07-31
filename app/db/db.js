const mongoose = require('mongoose')
const config = require('config-lite')
const env = process.env.NODE_ENV || 'development'
var dburl = 'mongodb://cc_owner:cc?@127.0.0.1:/27017/zhibo8'

//kaifamoshi
if (env = 'development') {
	// mongodb 连接🔗
	var dburl = 'mongodb://localhost:27017/zhibo8'
}

mongoose.connect(dburl)

// 此处防止 node.js - Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connect error'))
db.once('open', function () {
	console.log('Mongodb started successfully')
})


var userSchema = mongoose.Schema({
	tel: Number,
	password: String,
	name: String,
	token: String,
	create_time: Date
})

var model = {
	// 在此处扩展 model，例如：
	// Article: mongoose.model('Article', articleSchema),
	User: mongoose.model('User', userSchema)
}

module.exports = model
