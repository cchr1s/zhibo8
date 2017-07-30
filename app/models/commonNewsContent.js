const mongoose = require('mongoose')

const CommonNewsContentSchema = new mongoose.Schema({
	img: String,
	title: String,
	time: String,
	content: String,
	tag: Number,
	id: String,
/*	classes: String,
	newsTime: String,*/
	meta: {
		createAt: {
			type: Date,
		default:
			Date.now()
		},
		updateAt: {
			type: Date,
		default:
			Date.now()
		}
	}
})

var CommonNewsContent = module.exports = mongoose.model('CommonNewsContent', CommonNewsContentSchema)