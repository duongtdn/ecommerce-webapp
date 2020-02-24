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
    helpers.Database.PROGRAM.fetch()
    .then(data => {
      if (data.length > 0) {
        req.programs = data
        next()
      } else {
        res.status(404).send("There is no program")
      }
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Read access to Database failed',
        action: `GET /browse/${req.params.program}`,
        error: err
      })
      res.status(500).json({ reason: 'Read access to Database failed' })
    })
  }
}

/*
  Depending on the path:
    + /browse/:program - all courses of that program are loaded
    + /course/:course - only that course is loaded
*/
function getCourses(helpers) {
  return function(req, res, next) {
    const all = []
    req.programs.forEach(program => {
      program.courses.forEach( id => !all.find(k => k.id === id) && all.push({ id }) )
    })
    helpers.Database.batchGet({
      COURSE: {
        keys: all,
        // projection: ['id', 'title', 'snippet', 'description', 'thumbnail', 'picture', 'level', 'price', 'skills', 'certs', 'programs', 'tags']
      }
    })
    .then(data => {
      req.courses = data.COURSE
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Read access to Database failed',
        action: `GET /browse/${req.params.program}`,
        error: err
      })
      res.status(500).json({ reason: 'Read access to Database failed' })
    })
  }
}

function getPromotion(helpers) {
  return function(req, res, next) {
    helpers.Database.PROMOTE.fetch()
    .then(data => {
      req.promos = data
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Read access to Database failed',
        action: `GET /browse/${req.params.program}`,
        error: err
      })
      res.status(500).json({ reason: 'Read access to Database failed' })
    })
  }
}

function render() {
  return function(req, res) {
    const dom = renderToString(React.createElement(AppShell.default, {
      path: req.path.replace(/^\//,''),
      programs: req.programs,
      courses: req.courses,
      promos: req.promos,
    }))
    res.writeHead( 200, { "Content-Type": "text/html" } )
    res.end(html({
      dom,
      script: process.env.SCRIPT,
      data: {
        props: {programs: req.programs, courses: req.courses, promos: req.promos }
      }
    }))
  }
}

module.exports = [getPrograms, getCourses, getPromotion, render]
