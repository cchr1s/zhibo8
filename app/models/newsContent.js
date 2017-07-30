const mongoose = require('mongoose')

const NewsContentSchema = new mongoose.Schema({
	img: String,
	title: String,
	content: String,
	tag: Number,
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

const NewsContent = module.exports = mongoose.model('NewsContent', NewsContentSchema)