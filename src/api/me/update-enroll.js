/*
  THIS MODULE IS NOT FULLY TESTED YET
  this module is only for user to update thier enroll status
  only the status can be updated from active -> studying, studying -> completed (?) by user
*/

"use strict"

const {authen} = require('../lib/authen')

function validateParams() {
  return function(req, res, next) {
    const courseId = req.params.courseId
    const status = req.body.status
    if (!courseId || !status || status !== 'studying') { // TBD: completed is allowed or not?
      res.status(400).json({ error: 'Bad parameters'})
      return
    } else {
      next()
    }
  }
}

function checkPermission(helpers) {
  return function(req, res, next) {
    helpers.Database.Enroll.find({ courseId: req.courseId, enrolledTo: req.uid }, (data) => {
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
  }
}

function updateEnrollStatus(helpers) {
  return function(req, res, next) {
    helpers.Database.Enroll.update({ courseId: req.courseId, enrolledTo: req.uid, status: req.status }, (error) => {
      if (error) {
        res.status(403).json({ error: "Cannot update" })
      } else {
        res.status(200).json({ status: req.status })
      }
    })
  }
}

module.exports = [authen, validateParams, checkPermission, updateEnrollStatus]
