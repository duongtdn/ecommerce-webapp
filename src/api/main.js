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
    get: require('./page/get-page-browse')
  })
  .add('/course/:course', {
    get: require('./page/get-page-course')
  })
  .add('/data/content', {
    get: require('./data/get-data-content')
  })
  .add('/data/promo', {
    get: require('./data/get-data-promo')
  })

module.exports = api
