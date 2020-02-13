"use strict"

const jwt = require('jsonwebtoken')
const {authen} = require('../lib/authen')

function validateCode(helpers) {
  return function(req, res, next) {
    const uid = req.uid
    const code = req.body.code
    helpers.Database.ACTIVECODE.find({
      code: `= ${code}`
    })
    .then( data => {
      const activation = data[0]
      if (activation && activation.uid === uid) {
        req.activation = activation
        next()
      } else {
        res.status(403).json({ error: 'Invalid activation code' })
      }
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Could not read activation code. Database operation failed',
        action: 'POST /me/enroll',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

function registerTests(helpers) {
  req.tests = {} // register new test, then provide test here
}

function createEnrollAndProgress(helpers) {
  return function(req, res, next) {
    const uid = req.uid
    const courses = req.activation.courses
    const enrolls = courses.map( course => {
      return {
        courseId: course,
        enrollTo: uid,
        enrollAt: (new Date()).getTime(),
        resolvedBy: 'user',
        order: req.activation.order,
        status: 'active',
        comments: [{by: 'system', message: 'user activate course by code'}],
      }
    })
    const progresses = courses.map( course => {
      return {
        uid,
        id: course,
        study: {},
        test: req.tests[course]
      }
    })
    helpers.Database.batchWrite({
      ENROLL: {
        insert: enrolls
      },
      PROGRESS: {
        insert: progresses
      },
      ACTIVECODE: {
        remove: [{ code: req.body.code }]
      }
    })
    .then(data => {
      req.enrolls = enrolls
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Could not create enroll or remove activation code. Database operation failed',
        action: 'POST /me/enroll',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

function updateOrderStatus(helpers) {
  return function(req, res, next) {
    const uid = req.uid
    const number = req.activation.order
    helpers.Database.ORDER.update({uid, number}, {
      status: 'fulfill',
      fulfillAt: (new Date()).getTime()
    })
    .then(_ => next())
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Could not set order to fulfill. Database operation failed',
        action: 'POST /me/enroll',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

function sendNotification(helpers) {
  return function(req, res, next) {
    const token = jwt.sign({uid: req.uid}, process.env.PRIVATE_AUTH_KEY)
    helpers.notify && helpers.notify({
      template: 'enroll-created',
      recipient: token,
      data: req.enrolls
    })
    .then(next)
    .catch(err => {
      helpers.alert && helpers.alert({
        info: 'Cannot send notification',
        error: err
      })
      next()
    })
  }
}

function response() {
  return function(req, res) {
    const enrolls = req.enrolls.map( e => {
      const enroll = {...e}
      enroll.enrollTo && delete enroll.enrollTo
      return e
    })
    res.status(200).json({ enrolls })
  }
}

module.exports = [authen, validateCode, createEnrollAndProgress, updateOrderStatus, sendNotification, response]
