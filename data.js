var http = require('http')
var cheerio = require('cheerio')
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/zhibo8')
var fs = require('fs')
var request = require('request')
var app = require('express')()
var url = 'http://m.zhibo8.cc'
var newsUrl = 'http://m.zhibo8.cc/news.htm'

//申明一个mongoose对象
var HeadlineSchema = new mongoose.Schema({
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

HeadlineSchema.pre('save',function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt =  Date.now()
	}

	next()
})

HeadlineSchema.statics = {
	//取数据 全部
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}

var NewsContentSchema = new mongoose.Schema({
	img: String,
	title: String,
	time: String,
	content: String,
	tag: Number,
	id: String,
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

NewsContentSchema.pre('save',function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt =  Date.now()
	}

	next()
})

NewsContentSchema.statics = {
	//取数据 全部
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}

//commonnews
var CommonNewsSchema = new mongoose.Schema({
	img: String,
	title: String,
	url: String,
	tag: Number,
	contentId: String,
	newsTime: String,
	classes: String,
	createTime: String,
	date: { 
		type: Date, 
		default: Date.now 
	},
})

CommonNewsSchema.pre('save',function(next){
	

	next()
})

CommonNewsSchema.statics = {
	//取数据 全部
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}

var CommonNewsContentSchema = new mongoose.Schema({
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

CommonNewsContentSchema.pre('save',function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt =  Date.now()
	}

	next()
})

CommonNewsContentSchema.statics = {
	//取数据 全部
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}


var ScheduleSchema = new mongoose.Schema({
	schedule_time: String,
	content: [],
	tag: Number,
	target: Number,
	date: { 
		type: Date, 
		default: Date.now 
	},
})

ScheduleSchema.pre('save',function(next){
	
	next()
})

ScheduleSchema.statics = {
	//取数据 全部
	fetch: function(cb){
		return this
			.find({})
			.sort('-date')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	},
	findByFetchId:  function(fetchid, cb){
		return this
			.find({fetchid: fetchid}, cb) 
	}
}

var Headline = mongoose.model('Headline', HeadlineSchema)
var NewsContent = mongoose.model('NewsContent', NewsContentSchema)
var CommonNews = mongoose.model('CommonNews', CommonNewsSchema)
var CommonNewsContent = mongoose.model('CommonNewsContent', CommonNewsContentSchema)
var Schedule = mongoose.model('Schedule', ScheduleSchema)


//headline
let news = []
function filterNews(html) {
	var $ = cheerio.load(html)
	var headlines = $('.headline .content .list .ent .news_lite')	
	headlines.each(function(item, element) {
		let headline_url = $(this).find('h2').find('a').attr('href')
		let headline_img = $(this).find('h2').find('a').find('img').attr('src')
		let headline_title = $(this).find('h2').find('.line_tlt').text()
		let id = headline_url.split('/')[headline_url.split('/').length - 1].substring(0, headline_url.split('/')[headline_url.split('/').length - 1].indexOf('.'))
		let classes = headline_url.split('/')[headline_url.split('/').length - 3]
		let newsTime = headline_url.split('/')[headline_url.split('/').length - 2].split('-').join('_')

		let newsData = {
			_url : headline_url,
			img : headline_img,
		}
		news.push(newsData)

		if (id.length > 6) {
			var _id = id
			var _headline_url = headline_url
		}else{
			let id = ''
			var _headline_url = '' 
		}

		if (id !== '' && _headline_url !== '') {
			var headline =  new Headline({
				img: headline_img,
				url: _headline_url,
				title: headline_title,
				contentId: _id,
				classes: classes,
				newsTime: newsTime,
				tag: 1,
			})

			headline.save(function(err){
				if (err) {
					console.log(err)
				} 
			})
		}
		
	});
	//console.log(news)
	return news	
}

/*//var newsContent = []
function filterContent(html){
	var $ = cheerio.load(html)
	let newsContent_title = $('h1').text()
	let newsContent_time = $('p').first().text()
	var newsContent_img = $('.signals').find('img').attr('t-rc')
	let newsContent_content = $('.signals').find('p').text()
	let pageUrl = $('.nav .float_right').attr('href')
	if(pageUrl){
		var id = pageUrl.split('/')[pageUrl.split('/').length - 1].substring(0, pageUrl.split('/')[pageUrl.split('/').length - 1].indexOf('.'))		
	}
	
	//if (newsContent_img !== undefined) {
		//let imgFileName = newsContent_img.split('/')		
		//downloadPic(newsContent_img, __dirname+'/static/img/'+ imgFileName[imgFileName.length-1])
	//}
	//	newsContent.push(newsContent_img)
	
	var newContent =  new NewsContent({
		title: newsContent_title,
		time: newsContent_time,
		img: newsContent_img,
		content: newsContent_content,
		id: id,
		tag: 2		
	})

	newContent.save(function(err){
		if (err) {
			console.log(err)
		} 
	})
	//	return newsContent
}*/

//commonnews
var _commonNews = []
function filterCommonNews(html) {
	var $ = cheerio.load(html)
	var headlines = $('.module .content .list .ent .lite')	
	headlines.each(function(item, element) {
		let type = $(this).attr('type')
		let headline_url = $(this).find('h2').find('a').attr('href')
		let headline_img = $(this).find('.icon_video').find('a').find('img').attr('src')
		let headline_title = $(this).find('h2').find('a').text()
		let createTime = $(this).find('.lite_bot').find('.pass_time').text()
		let id = headline_url.split('/')[headline_url.split('/').length - 1].substring(0, headline_url.split('/')[headline_url.split('/').length - 1].indexOf('.'))		
		let newsTime = headline_url.split('/')[headline_url.split('/').length - 2].split('-').join('_')

		let newsData = {
			_url : headline_url,
			img : headline_img,
		}
		_commonNews.push(newsData)

		if (id.length > 6) {
			var _id = id
			var _headline_url = headline_url
		}else{
			let id = ''
			var _headline_url = '' 
		}

		if (id !== '' && _headline_url !== '') {
			var commonNews =  new CommonNews({
				classes: type,
				img: headline_img,
				url: _headline_url,
				title: headline_title,
				createTime: createTime,
				contentId: _id,
				newsTime: newsTime,
				tag: 4,
			})

			commonNews.save(function(err){
				if (err) {
					console.log(err)
				} 
			})
		}
		
	});
	//console.log(commonNews)
	return _commonNews	
}

function filterNewsContent(html){
	var $ = cheerio.load(html)
	let newsContent_title = $('h1').text()
	let newsContent_time = $('p').first().text()
	var newsContent_img = $('.signals').find('img').attr('t-rc')
	let newsContent_content = $('.signals').find('p').text()
	let pageUrl = $('.nav .float_right').attr('href')
	if(pageUrl){
		var id = pageUrl.split('/')[pageUrl.split('/').length - 1].substring(0, pageUrl.split('/')[pageUrl.split('/').length - 1].indexOf('.'))		
	}

	var commonNewsContent =  new CommonNewsContent({
		title: newsContent_title,
		time: newsContent_time,
		img: newsContent_img,
		content: newsContent_content,
		id: id,
		tag: 5		
	})

	commonNewsContent.save(function(err){
		if (err) {
			console.log(err)
		} 
	})
	//	return newsContent
}

var target = 0 
function filterSchedule (html) {
	var $ = cheerio.load(html)
	let contents = $('.saishi').nextAll()
	
	var scheduleArray = []
	contents.each(function(item, element){
		target += 1
		let schedule_time = $(this).find('.head>h2').text()
		let content = $(this).find('.content .list .ent .lite')
		let scheduleData = {
			schedule_time: schedule_time,
			content : []
		}		
		content.each(function(item, element){
			let a = $(this).find('h2').find('a')
			let schedule_item_type = $(this).attr('type').trim()
			let schedule_item_matchId = a.find('table').attr('id') 
			let schedule_item_url = a.attr('href')
			let schedule_item_time = a.find('table').find('.s_time').text()
			let schedule_item_home = a.find('table').find('td').eq(1).text().trim()
			let schedule_item_homeimg = a.find('table').find('td').eq(1).find('.lazy').attr('data-original')
			let schedule_item_name = a.find('table').find('.s_name').text()
			let schedule_item_keyword = a.find('table').find('.s_keyword').text()
			let schedule_item_road = a.find('table').find('td').eq(3).text().trim()
			let schedule_item_roadimg = a.find('table').find('td').eq(3).find('.lazy').attr('data-original')
			let schedule_item_remind = a.find('table').find('.remind').text().trim()

			scheduleData.content.push({
				type : schedule_item_type,
				matchId : schedule_item_matchId,
				url : schedule_item_url,
				time : schedule_item_time,
				home : schedule_item_home,
				homeimg: schedule_item_homeimg == undefined ? '': schedule_item_homeimg,
				name : schedule_item_name,
				keyword : schedule_item_keyword,
				road : schedule_item_road,
				roadimg: schedule_item_roadimg == undefined ? '': schedule_item_roadimg,
				remind : schedule_item_remind,
				important: false
			})
			return 	scheduleData.content	
		})

		var schedule =  new Schedule({
			schedule_time : scheduleData.schedule_time,
			content : scheduleData.content,
			tag: 3,
			target: 11
		})

		schedule.save(function(err){
			if (err) {
				console.log(err)
			} 
		})				
		scheduleArray.push(scheduleData)
	})
	//console.log(scheduleArray[6].content)
	return scheduleArray	
}

http.get(url, function(res){
	var html = ''
	res.setEncoding('utf-8');
	res.on('data', function(data){
		html += data
	})

	res.on('end', function(){
		//delete
		var tag = {'tag': '1'}
		Headline.remove(tag, function(err, res){
			if (err) {
				console.log(err)
			}
		})
		/*var tag = {'tag': '2'}
		NewsContent.remove(tag, function(err, res){
			if (err) {
				console.log(err)
			}
		})*/
		var tag = {'tag': '3'}
		Schedule.remove(tag, function(err, res){
			if (err) {
				console.log(err)
			}
		})
		//deleteImg()

		filterNews(html)
		/*var t = filterNews(html)		
		for(let i =0; i < t.length;i++){			
			http.get('http:' + t[i]._url, function(res){
				var html = ''
				res.setEncoding('utf-8');
				res.on('data', function(data){
					html += data
				})

				res.on('end', function(){
					filterContent(html)										
				})				
			})

			//let imgFileName = t[i].img.split('/')		
			//downloadPic(t[i].img, __dirname+'/static/img/'+ imgFileName[imgFileName.length-1])
		}*/

		//schedule
		filterSchedule(html)													 
	})	
					
}).on('error', function(){
	console.log("获取数据出错。。")
})

//commonnews
http.get(newsUrl, function(res){
	var html = ''
	res.setEncoding('utf-8');
	res.on('data', function(data){
		html += data
	})

	res.on('end', function(){
		//delete
		var tag = {'tag': '4'}
		CommonNews.remove(tag, function(err, res){
			if (err) {
				console.log(err)
			}
		})
		var tag = {'tag': '5'}
		CommonNewsContent.remove(tag, function(err, res){
			if (err) {
				console.log(err)
			}
		})
		//deleteImg()

		var t = filterCommonNews(html)		
		for(let i =0; i < t.length;i++){			
			http.get('http:' + t[i]._url, function(res){
				var html = ''
				res.setEncoding('utf-8');
				res.on('data', function(data){
					html += data
				})

				res.on('end', function(){
					filterNewsContent(html)										
				})				
			})
		}												 
	})	
					
}).on('error', function(){
	console.log("获取数据出错。。")
})

function deleteImg(path){
	//delete news img
	let imgFiles = []
	if (fs.existsSync(__dirname)) {
		imgFiles = fs.readdirSync(__dirname + '/static/img')

		Array.prototype.indexOf = function (val) {
			for( let i = 0; i < this.length; i++){
				if(this[i] == val) return i;
			}
			return -1;
		}
		Array.prototype.remove = function (val) {
			let index = this.indexOf(val)
			if (index > -1) {
				this.splice(index, 1)
			}
		}
		imgFiles.remove('clock1.png') //except clock1
		imgFiles.remove('zan.png')
		imgFiles.remove('host.png')
		imgFiles.remove('visit.png')

		imgFiles.forEach((file, index) => {
			let curPath = __dirname + '/static/img/' + file
			fs.unlinkSync(curPath)
		})
		console.log('delete all')
	}	
}
//download img
/*function downloadPic(src, path){
	request(src).pipe(fs.createWriteStream(path)).on('close',function(){
		console.log('img saved!')
	})
}*/