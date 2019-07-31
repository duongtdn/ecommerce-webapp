"use strict"

const Builder = require('express-api-builder')

const api = Builder()

api
  .add('/', {
    get: require('./page/get-page-home')
  })
  .add('/home', {
    get: require('./page/get-page-home')
  })
  .add('/browse/:catalog', {
    get: require('./page/get-page-browse')
  })

module.exports = api
