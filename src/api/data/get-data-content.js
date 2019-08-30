"use strict"

function getProgram(helpers) {
  return function(req, res, next) {
    helpers.Database.Program.find({}, data => {
      if (data.length > 0) {
        req.programs = data
        next()
      } else {
        res.status(404).json({message: 'no program'})
      }
    })
  }
}

function getCourses(helpers) {
  return function(req, res, next) {
    helpers.Database.Course.find({},
      ['id', 'title', 'snippet', 'description', 'thumbnail', 'picture', 'level', 'price', 'skills', 'certs', 'promo', 'programs', 'tags'],
      data => {
        req.courses = data
        next()
      }
    )
  }
}

function response() {
  return function(req, res) {
    res.status(200).json({ programs: req.programs, courses: req.courses })
  }
}

module.exports = [getProgram, getCourses, response]
