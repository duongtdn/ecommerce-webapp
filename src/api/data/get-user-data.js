"use strict"

function authen() {
  return function (req, res, next) {
    req.uid = 'test-user'
    next()
  }
}

function batchGetUserData(helpers) {
  return function(req, res) {
    helpers.Database.find(
      {
        Order: {key: {uid: req.uid}},
      },
      (data) => {
        res.status(200).json({ orders: data.Order })
      }
    )
  }
}

module.exports = [authen, batchGetUserData]
