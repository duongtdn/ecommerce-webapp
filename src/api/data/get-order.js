"use strict"

function authen() {
  return function (req, res, next) {
    req.uid = 'test-user'
    next()
  }
}

function getOrder(helpers) {
  return function(req, res) {
    helpers.Database.Order.find({uid: req.uid}, (data) => {
      res.status(200).json({ orders: data })
    })
  }
}

module.exports = [authen, getOrder]
