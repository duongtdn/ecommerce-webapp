/*
  FOR NOW, SINCE THERE ARE FEW COURSES AND ONLY A SINGLE PROGRAM, IT IS OK TO LOAD ALL CONTENT AT STARTUP
  In future, seperated into
    + GET /data/programs
    + GET /data/courses
*/

"use strict"

function getProgram(helpers) {
  return function(req, res, next) {
    // fetch perform a scan through the whole table and take too much time
    // considering restructure PROGRAM table into a single item which contain all program in an array
    helpers.Database.PROGRAM.fetch()
    .then(data => {
      if (data.length > 0) {
        req.programs = data
        next()
      } else {
        res.status(404).json({message: 'no program'})
      }
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Read access to Database failed',
        action: `GET /data/content`,
        error: err
      })
      res.status(500).json({ reason: 'Read access to Database failed' })
    })
  }
}

function getCourses(helpers) {
  return function(req, res, next) {
    const all = []
    req.programs.forEach(program => {
      program.courses.forEach( id => !all.find(k => k.id === id) && all.push({ id }) )
    })
    helpers.Database.batchGet({
      COURSE: {
        keys: all,
      }
    })
    .then(data => {
      req.courses = data.COURSE
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Read access to Database failed',
        action: `GET /data/content`,
        error: err
      })
      res.status(500).json({ reason: 'Read access to Database failed' })
    })
  }
}

function response() {
  return function(req, res) {
    res.status(200).json({ programs: req.programs, courses: req.courses })
  }
}

module.exports = [getProgram, getCourses, response]
