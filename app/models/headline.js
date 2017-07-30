const mongoose = require('mongoose')

const HeadlineSchema = new mongoose.Schema({
	img: String,
	title: String,
	url: String,
	tag: Number,
	contentId: String,
	classes: String,
	newsTime: String,
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

const Headline = module.exports = mongoose.model('Headline',HeadlineSchema)