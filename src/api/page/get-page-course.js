"use strict"

const React = require('react')
const { renderToString  } = require('react-dom/server')

const AppShell = require('../../../build/AppShell')

const html = require('../html')

function validateParams() {
  return function(req, res, next) {
    if (req.params.course) {
      req.courseId = req.params.course
      next()
    } else {
      req.status(400).send('Bad parameter')
    }
  }
}

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

function getCourse(helpers) {
  return function(req, res, next) {
    helpers.Collections.Course.find({id : req.courseId},
      ['id', 'title', 'snippet', 'description', 'thumbnail', 'picture', 'level', 'price', 'skills', 'certs', 'promo', 'programs', 'tags'],
      data => {
        if (data.length > 0) {
          req.courses = data
          next()
        } else {
          res.status(404).send("Page not found")
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

module.exports = [validateParams, getProgram, getCourse, render]
