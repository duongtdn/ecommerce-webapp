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

function response() {
  return function(req, res) {
    res.status(200).json({ programs: req.programs })
  }
}

module.exports = [getProgram, response]
