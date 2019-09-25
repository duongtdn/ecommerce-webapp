"use strict"

const {authen} = require('../lib/authen')

function batchGetUserData(helpers) {
  return function(req, res) {
    /* need a condition to filter expired order and rewards when querying database
       may be done in database driver
    */
    helpers.Database.find(
      {
        Order: {key: {uid: req.uid}},
        Enroll: {key: {enrollTo: req.uid}, projection: ['courseId', 'enrollAt', 'status', 'order']},
        User: {key: {uid: req.uid}}
      },
      (data) => {
        data.User.forEach(user => user.uid && delete user.uid)
        data.Enroll.forEach(enroll => enroll.enrollTo && delete enroll.enrollTo)
        data.Order.forEach(order => order.uid && delete order.uid && delete order.activationCode)
        res.status(200).json({ orders: data.Order, enrolls: data.Enroll, rewards: data.User[0].rewards })
      }
    )
  }
}

module.exports = [authen, batchGetUserData]
