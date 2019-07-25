" use strict"

require('dotenv').config()

const api = require('../src/api/main')

// api.helpers({ Collections: require('./database') })

const express = require('express')
const app = express()

app.use('/', api.generate())

const PORT = 3400
app.listen(PORT, (err) => {
  if (err) {
    console.log('Failed to start API Server')
  } else {
    console.log(`API Server is running at port ${PORT}`)
  }
})
