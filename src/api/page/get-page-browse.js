"use strict"

const html = require('../html')

function render() {
  return function(req, res) {
    res.writeHead( 200, { "Content-Type": "text/html" } )
    res.end(html({script: process.env.SCRIPT}))
  }
}

module.exports = [render]
