"use strict"

const Builder = require('express-api-builder')

const api = Builder()

api
  .add('/app-shell', {
    get: require('./page/get-app-shell')
  })
  .add('/order', {
    get: require('./page/get-app-shell')
  })
  .add('/', {
    get: require('./page/get-page-home')
  })
  .add('/home', {
    get: require('./page/get-page-home')
  })
  .add('/browse/:program', {
    get: require('./page/get-rendered-page')
  })
  .add('/course/:course', {
    get: require('./page/get-rendered-page')
  })
  .add('/data/content', {
    get: require('./data/get-data-content')
  })
  .add('/data/promotion', {
    get: require('./data/get-data-promo')
  })
  .add('/data/order', {
    post: require('./data/create-order'),
  })
  .add('/user', {
    get: require('./data/get-user-data')
  })

module.exports = api
