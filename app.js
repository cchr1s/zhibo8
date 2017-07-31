const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const logger = require('morgan')
const routes = require('./app/router/user.js')
const config = require('config-lite')
const compression = require('compression')
const app = express()


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression({ threshold: 0 }))
app.use('/api', routes)

app.use(express.static(path.resolve(__dirname, './dist')))
console.log(__dirname)
// 因为是单页应用 所有请求都走/dist/index.html
app.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
    console.log(html)
    res.send(html)
})

app.listen(3000, function () {
	console.log(`Server running in port ${config.port}`)
})
