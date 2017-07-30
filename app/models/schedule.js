const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema({
	schedule_time: String,
	content: [],
	tag: Number,
	date: { 
		type: Date, 
		default: Date.now 
	},
})

const Schedule = module.exports = mongoose.model('Schedule', ScheduleSchema)