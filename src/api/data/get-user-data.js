"use strict"

const authen = require('../lib/authen')

function batchGetUserData(helpers) {
  return function(req, res) {
    helpers.Database.find(
      {
        Order: {key: {uid: req.uid}},
        Enroll: {key: {enrolledTo: req.uid}, projection: ['courseId', 'enrolledAt', 'status', 'order']},
        User: {key: {uid: req.uid}}
      },
      (data) => {
        if (data.User.uid) { delete data.User.uid }
        res.status(200).json({ orders: data.Order, enrolls: data.Enroll, vouchers: data.User[0].vouchers })
      }
    )
  }
}

module.exports = [authen, batchGetUserData]
