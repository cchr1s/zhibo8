const express = require('express')
const router = express.Router()
const Headline = require('../models/headline')
const NewsContent = require('../models/newsContent')
const Schedule = require('../models/schedule')
const CommonNews = require('../models/commonNews')
const CommonNewsContent = require('../models/commonNewsContent')

router.get('/headline', (req, res) => {
  Headline.find({})
    .sort({ update_at : -1})
    .then(headline => {
     res.json(headline)         
    })
    .catch(err => {
     res.json(err)
    })
})

router.get('/newsContent', (req, res) => {
    NewsContent.find({})
        .sort({ update_at : -1})
        .then(newsContent => {
            res.json(newsContent)         
        })
        .catch(err => {
            res.json(err)
        })
})

router.get('/commonNews', (req, res) => {
  CommonNews.find({})
    .sort({date: 1})
    .then(commonNews => {
     res.json(commonNews)         
    })
    .catch(err => {
     res.json(err)
    })
})

router.get('/commonNewsContent', (req, res) => {
    CommonNewsContent.find({})
        .sort({ update_at : -1})
        .then(commonNewsContent => {
            res.json(commonNewsContent)         
        })
        .catch(err => {
            res.json(err)
        })
})

router.get('/schedule', (req, res) => {
    Schedule.find({})
        .sort({date: 1})
        .then(schedule => {
            res.json(schedule)         
        })
        .catch(err => {
            res.json(err)
        })
})

/*router.get('/schedule/:id', (req, res) => {
    Schedule.findById(req.params.id)
        .then(schedule => {
            res.json(schedule)         
        })
        .catch(err => {
            res.json(err)
        })
})*/




//module.exports = router
