"use strict"

function validateQuery() {
  return function(req, res, next) {
    console.log(req.path)
    if (req.query && (req.query.p || req.query.c)) {
      next()
    } else {
      res.status(400).json({ error: 'Bad parameter'})
    }
  }
}

function getProgram(helpers) {
  return function(req, res, next) {
    if (!req.query.p) {
      next()
      return
    }
    helpers.Database.PROGRAM.find({id: `= ${req.query.p}`})
    .then(data => {
      if (data && data.length > 0) {
        req.program = data[0]
        next()
      } else {
        res.status(404).json({ error: 'Resource not found'})
      }
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Read access to Database failed',
        action: `PROGRAM.find({id: = ${req.query.p}})`,
        error: err
      })
      res.status(500).json({ error: 'Read access to Database failed' })
    })
  }
}

function getCourses(helpers) {
  return function(req, res, next) {
    if (req.query.p) {
      if (!req.program || !req.program.courses) {
        res.status(500).json({ error: 'Logic failed' })
        return
      }
      const all = []
      req.program.courses.forEach( id => !all.find(k => k.id === id) && all.push({ id }) )
      helpers.Database.batchGet({
        COURSE: { keys: all, }
      })
      .then(data => {
        if (data && data.COURSE) {
          req.courses = data.COURSE
          next()
        } else {
          res.status(404).json({ error: 'Resource not found'})
        }
      })
      .catch(err => {
        helpers.alert && helpers.alert({
          message: 'Read access to Database failed',
          action: `BatchGET COURSE: {key: ${all}}`,
          error: err
        })
        res.status(500).json({ error: 'Read access to Database failed' })
      })
    } else {
      helpers.Database.COURSE.find({id: `= ${req.query.c}`})
      .then(data => {
        if (data && data.length > 0) {
          req.courses = data
          next()
        } else {
          res.status(404).json({ error: 'Resource not found'})
        }
      })
      .catch(err => {
        helpers.alert && helpers.alert({
          message: 'Read access to Database failed',
          action: `COURSE.find({id: = ${req.query.c}})`,
          error: err
        })
        res.status(500).json({ error: 'Read access to Database failed' })
      })
    }
  }
}

function response () {
  return function(req, res) {
    res.status(200).json({ courses: req.courses })
  }
}

module.exports = [validateQuery, getProgram, getCourses,  response]
