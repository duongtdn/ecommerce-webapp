"use strict"

const React = require('react')
const { renderToString  } = require('react-dom/server')

// const AppShell = require('../../client/Template/AppShell')

const html = require('../html')

function getProgram(helpers) {
  return function(req, res, next) {
    helpers.Collections.Program.find({id: req.params.program}, data => {
      if (data.length > 0) {
        req.program = data[0]
        next()
      } else {
        res.status(404).send("Page not found")
      }
    })
  }
}

function getCourses(helpers) {
  return function(req, res, next) {
    const courses = req.program.courses
    helpers.Collections.Course.find({id : courses},
      ['id', 'title', 'snippet', 'description', 'thumbnail', 'picture', 'level', 'price', 'skills', 'certs', 'promo', 'programs'],
      data => {
        if (data.length > 0) {
          req.courses = data
          console.log(req.courses)
          next()
        } else {
          res.status(200).send("This Program does not have any course yet")
        }
      }
    )
  }
}

function render() {
  return function(req, res) {
    // const dom = renderToString(React.createElement(AppShell))
    // console.log(dom)
    res.writeHead( 200, { "Content-Type": "text/html" } )
    res.end(html({script: process.env.SCRIPT}))
  }
}

module.exports = [getProgram, getCourses, render]
