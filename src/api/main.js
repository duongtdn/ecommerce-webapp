"use strict"

const Builder = require('express-api-builder')

const api = Builder()

// page navigation
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

// data
api
  .add('/data/content', {
    get: require('./data/get-data-content')
  })
  .add('/data/promotion', {
    get: require('./data/get-data-promo')
  })
  .add('/data/order', {
    get: require('./data/get-order'),
  })
  .add('/data/course', {
    get: require('./data/get-courses')    // GET /data/course?p=p1 || GET /data/course?c=c1+c2+c3
  })
  .add('/data/program', {
    get: require('./data/get-programs')
  })

// user data
api
  .add('/me', {
    get: require('./me/get-me'),
    post: require('./me/create-membership')
  })
  .add('/me/order', {
    post: require('./me/create-order'),
    delete: require('./me/delete-order')
  })
  .add('/me/enroll', {
    put: require('./me/update-enroll'),
    post: require('./me/create-enroll')
  })
  .add('/me/reward', {
    delete: require('./me/delete-reward')
  })


module.exports = api
