"use strict"

const React = require('react')
const { renderToString  } = require('react-dom/server')

const AppShell = require('../../../build/AppShell')

const html = require('../html')

function getProgram(helpers) {
  return function(req, res, next) {
    helpers.Collections.Program.find({}, data => {
      if (data.length > 0) {
        req.programs = data
        next()
      } else {
        res.status(404).send("Page not found / no program")
      }
    })
  }
}

function getCourses(helpers) {
  return function(req, res, next) {
    const program = req.programs.find( prog => prog.id === req.params.program)
    if (!program) {
      res.status(404).send("Page not found")
      return
    }
    const courses = program.courses
    helpers.Collections.Course.find({id : courses},
      ['id', 'title', 'snippet', 'description', 'thumbnail', 'picture', 'level', 'price', 'skills', 'certs', 'promo', 'programs'],
      data => {
        if (data.length > 0) {
          req.courses = data
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
    const dom = renderToString(React.createElement(AppShell.default, {
      path: req.path.replace(/^\//,''),
      programs: req.programs,
      courses: req.courses,
    }))
    res.writeHead( 200, { "Content-Type": "text/html" } )
    res.end(html({ dom, script: process.env.SCRIPT, data: {props: {programs: req.programs, courses: req.courses}} }))
  }
}

module.exports = [getProgram, getCourses, render]
