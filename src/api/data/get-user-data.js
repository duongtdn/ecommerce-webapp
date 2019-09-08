"use strict"

const authen = require('../lib/authen')

function batchGetUserData(helpers) {
  return function(req, res) {
    helpers.Database.find(
      {
        Order: {key: {uid: req.uid}},
        Enroll: {key: {enrolledTo: req.uid}, projection: ['courseId', 'enrolledAt', 'status', 'order']}
      },
      (data) => {
        res.status(200).json({ orders: data.Order, enrolls: data.Enroll })
      }
    )
  }
}

module.exports = [authen, batchGetUserData]
