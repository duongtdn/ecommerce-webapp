"use strict"

const authen = require('../lib/authen')

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
