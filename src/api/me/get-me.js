"use strict"

const {authen} = require('../lib/authen')

function getOrder(helpers) {
  return function(req, res, next) {
    // There should no Limit in order queried.
    // Because if order for a course is not loaded to client, that course can be purchased again for that user.
    helpers.Database.ORDER.find({uid: `= ${req.uid}`},null,null,{ScanIndexForward: false})
    .then( data => {
      if (data && data.length > 0) {
        req.orders = data
        req.orders.forEach(order => delete order.uid && delete order.activationCode)
      }
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'Find items in ORDER',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

function getEnroll(helpers) {
  return function(req, res, next) {
    helpers.Database.ENROLL.find({enrollTo: `= ${req.uid}`})
    .then( data => {
      if (data && data.length > 0) {
        req.enrolls = data
        req.enrolls.forEach(enroll => delete enroll.enrollTo)
      }
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'Find items in ENROLL',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

function getMember(helpers) {
  return function(req, res, next) {
    helpers.Database.MEMBER.find({uid: `= ${req.uid}`})
    .then( data => {
      const member = data[0]
      req.rewards = []
      if (member.rewards) {
        for (let code in member.rewards) {
          req.rewards.push({code, ...member.rewards[code]})
        }
      }
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'Find items in MEMBER',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

function final() {
  return function(req, res) {
    res.status(200).json({ orders: req.orders || [], enrolls: req.enrolls || [], rewards: req.rewards })
  }
}

module.exports = [authen, getOrder, getEnroll, getMember, final]
