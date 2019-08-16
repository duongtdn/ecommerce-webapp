"use strict"

const html = require('../html')

function render() {
  return function(req, res) {
    console.log('Hit /app-shell')
    res.writeHead( 200, { "Content-Type": "text/html" } )
    res.end(html({script: process.env.SCRIPT}))
  }
}

module.exports = render
