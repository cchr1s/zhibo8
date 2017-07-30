const mongoose = require('mongoose')

const CommonNewsSchema = new mongoose.Schema({
	img: String,
	title: String,
	url: String,
	tag: Number,
	contentId: String,
	newsTime: String,
	type: String,
	createTime: String,
	date: { 
		type: Date, 
		default: Date.now 
	},
})

const CommonNews = module.exports = mongoose.model('CommonNews',CommonNewsSchema)