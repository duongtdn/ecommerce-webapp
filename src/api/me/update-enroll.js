/*
  THIS MODULE IS NOT FULLY TESTED YET
  this module is only for user to update thier enroll status
  only the status can be updated from active -> studying, studying -> completed (?) by user
*/

"use strict"

const {authen} = require('../lib/authen')

function validateParams() {
  return function(req, res, next) {
    const courseId = req.body.courseId
    const status = req.body.status
    if (!courseId || !status || status !== 'studying') { // TBD: completed is allowed or not?
      res.status(400).json({ error: 'Bad parameters'})
      return
    } else {
      req.courseId = courseId
      req.status = status
      next()
    }
  }
}

function checkPermission(helpers) {
  return function(req, res, next) {
    helpers.Database.ENROLL.find({
      courseId: `= ${req.courseId}`,
      enrollTo: `= ${req.uid}`
    })
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({ error: "Resource not found" })
      } else {
        const enroll = data[0]
        if (req.status === 'studying' && enroll.status !== 'active') {
          res.status(403).json({ error: "Not Allow" })
          return
        }
        // TBD: will allow user to set status to 'completed' or not? if yes, need to check again the requirement to complete a course
        next()
      }
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Read access to Database failed',
        action: 'PUT /me/enroll',
        error: err
      })
      res.status(500).json({ reason: 'Read access to Database failed' })
    })
  }
}

function updateEnrollStatus(helpers) {
  return function(req, res, next) {
    helpers.Database.ENROLL.update({ enrollTo: req.uid, courseId: req.courseId }, {
      status: req.status
    })
    .then( () =>  res.status(200).json({ status: req.status }))
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Write access to Database failed',
        action: 'PUT /me/enroll',
        error: err
      })
      res.status(500).json({ reason: 'Write access to Database failed' })
    })
  }
}

module.exports = [authen, validateParams, checkPermission, updateEnrollStatus]
