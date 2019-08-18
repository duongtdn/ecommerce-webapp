"use strict"

const Builder = require('express-api-builder')

const api = Builder()

api
  .add('/app-shell', {
    get: require('./page/get-app-shell')
  })
  .add('/', {
    get: require('./page/get-page-home')
  })
  .add('/home', {
    get: require('./page/get-page-home')
  })
  .add('/browse/:program', {
    get: require('./page/get-page-program')
  })
  .add('/course/:course', {
    get: require('./page/get-page-course')
  })
  .add('/data', {
    get: require('./data/get-data')
  })

module.exports = api
