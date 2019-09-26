"use strict"

const {authen} = require('../lib/authen')

function validateCode(helpers) {
  return function(req, res, next) {
    const uid = req.uid
    const code = req.body.code
    helpers.Database.Activation.find({uid, code}, data => {
      const activation = data[0]
      if (activation) {
        req.activation = activation
        next()
      } else {
        res.status(403).json({ error: 'Invalid activation code' })
      }
    })
  }
}

function createEnroll(helpers) {
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
        tests: {} // TBD, should tests is created along with enroll ?
      }
    })
    helpers.Database.Enroll.batchInsert({ enrolls }, err => {
      if (err) {
        res.status(403).json({ error: 'Could not create enroll' })
      } else {
        req.enrolls = enrolls
        next()
      }
    })
  }
}

function updateOrderStatus(helpers) {
  return function(req, res, next) {
    const number = req.activation.order
    helpers.Database.Order.update({ uid: req.uid, number, status: 'fulfill' }, err => {
      if (err) {
        helpers.alert && helpers.alert({
          message: 'Could not update order status to fulfill',
          action: 'POST /me/enroll',
          data: {uid: req.uid, order: number}
        })
      }
      next()
    })
  }
}

function removeActivationCode(helpers) {
  return function(req, res, next) {
    helpers.Database.Activation.delete({ uid: req.uid, code: req.body.code })
    next()
  }
}

function sendNotification(helpers) {
  return function(req, res, next) {
    helpers.notify && helpers.notify({
      reason: 'enroll-created',
      recipient: req.uid,
      data: req.enrolls
    })
    next()
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

module.exports = [authen, validateCode, createEnroll, updateOrderStatus, removeActivationCode, sendNotification, response]
