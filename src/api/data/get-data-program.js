"use strict"

function getProgram(helpers) {
  return function(req, res, next) {
    helpers.Collections.Program.find({}, data => {
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
    const program = req.programs.find( prog => prog.id === req.params.program)
    if (!program) {
      res.status(404).json({message: 'no program'})
      return
    }
    const courses = program.courses
    helpers.Collections.Course.find({id : courses},
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

  }
}