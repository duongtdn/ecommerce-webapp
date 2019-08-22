"use strict"

const React = require('react')
const { renderToString  } = require('react-dom/server')

const AppShell = require('../../../build/AppShell')

const html = require('../html')

/*
  for improvement
    - it is possible to make a single batch request and retrieve all data
*/

function getPrograms(helpers) {
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
    helpers.Collections.Course.find({},
      ['id', 'title', 'snippet', 'description', 'thumbnail', 'picture', 'level', 'price', 'skills', 'certs', 'promo', 'programs', 'tags'],
      data => {
        req.courses = data
        next()
      }
    )
  }
}

function getPromotion(helpers) {
  return function(req, res, next) {
    helpers.Collections.Promo.find({},
      data => {
        req.promos = data
        next()
      }
    )
  }
}

function getTags(helpers) {
  return function(req, res, next) {
    helpers.Collections.Tag.find({},
      data => {
        req.tags = data
        next()
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
      promos: req.promos,
      tags: req.tags
    }))
    res.writeHead( 200, { "Content-Type": "text/html" } )
    res.end(html({
      dom,
      script: process.env.SCRIPT,
      data: {
        props: {programs: req.programs, courses: req.courses, promos: req.promos, tags: req.tags }
      }
    }))
  }
}

module.exports = [getPrograms, getCourses, getPromotion, getTags, render]
