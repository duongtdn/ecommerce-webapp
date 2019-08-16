" use strict"

require('dotenv').config()

const api = require('../src/api/main')

api.helpers({ Collections: require('./database') })

const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const app = express()

const path = require('path')
console.log(path.join(__dirname, '../assets'))
app.use('/public', express.static(path.join(__dirname, '../assets')))

let iHit = 0
app.use('/', (req,res,next) => { console.log(`server hit ${iHit++}`); next() }, api.generate())

const config = require('../webpack.dev.config')
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  watchOptions: { poll: 1000 },
  publicPath: config.output.publicPath,
  stats: {colors: true}
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}))

const PORT = 3400
app.listen(PORT, (err) => {
  if (err) {
    console.log('Failed to start API Server')
  } else {
    console.log(`API Server is running at port ${PORT}`)
  }
})
