" use strict"

require('dotenv').config()

const api = require('../src/api/main')

// helpers database driver
const DatabaseHelper = require('@realmjs/dynamodb-helper')
const aws = { region: process.env.REGION, endpoint: process.env.ENDPOINT }
if (process.env.PROXY) {
  console.log('# User proxy-agent')
  process.env.NODE_TLS_REJECT_UNAUTHORIZED= '0'
  const proxy = require('proxy-agent')
  aws.httpOptions = { agent: proxy(process.env.PROXY) }
}
const dbh = new DatabaseHelper({ aws, measureExecutionTime: true })
dbh.addTable(['PROGRAM', 'COURSE', 'PROMOTE', 'ORDER', 'ENROLL', 'MEMBER', 'ACTIVECODE', 'PROGRESS'])
api.helpers({ Database: dbh.drivers})

// helpers alert & notify
api.helpers({
  alert({message, action, error}) {
    console.log(`\nALERT: -----------------------------------------------------------`)
    console.log(`--> by action: ${action}`)
    console.log(`--> ${message}`)
    console.log(error)
    console.log(`------------------------------------------------------------------`)
  },
  notify({template, recipient, data}) {
    return new Promise( (resolve, reject) => {
      console.log(`\nNOTIFICATION:  -------------------------------------------------`)
      console.log(`--> template: ${template}`)
      console.log(`--> to: ${recipient}`)
      console.log(`${JSON.stringify(data)}`)
      console.log(`------------------------------------------------------------------`)
      resolve()
    })
  }
})

const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const app = express()

const path = require('path')
console.log(`Assets path: ${path.join(__dirname, '../assets')}`)
app.use('/public', express.static(path.join(__dirname, '../assets')))
app.use('/', express.static(path.join(__dirname, '../build')))

app.use('/', (req,res,next) => { console.log(`${req.method.toUpperCase()} request to: ${req.path}`); next() }, api.generate())

const config = require('../webpack.dev.config')
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  watchOptions: { poll: 1000 },
  publicPath: config.output.publicPath,
  stats: {colors: true}
}))

app.use(webpackHotMiddleware(compiler, {
  // log: console.log
}))

const PORT = 3200
app.listen(PORT, (err) => {
  if (err) {
    console.log('Failed to start API Server')
  } else {
    console.log(`API Server is running at port ${PORT}\n`)
  }
})
