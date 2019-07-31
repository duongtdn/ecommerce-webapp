" use strict"

require('dotenv').config()

const api = require('../src/api/main')

// api.helpers({ Collections: require('./database') })

const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const app = express()

app.use('/', api.generate())

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
