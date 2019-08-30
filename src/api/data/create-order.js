"use strict"

function rand() {
  return Math.random().toString(36).substr(2,9)
}

function authen() {
  return function (req, res, next) {
    req.uid = 'test-user'
    next()
  }
}

function validateOrder() {
  return function (req, res, next) {
    if (!req.body.order) {
      res.status(400).json({error: 'Bad Parameters'})
      return
    }
    /* TODO: validate order items
              - get information (price) of items
              - get relevent promotion
              - re-calculate actual item price, then compare
    */
    next()
  }
}


/*
  order.uid is hashkey while order.number is range key
  order.billTo is ignored for the time being
*/
function insertOrderToDB(helpers) {
  return function(req, res, next) {
    const now = new Date()
    const order = req.body.order
    order.number = rand()
    order.uid = req.uid
    order.status = 'new'
    order.createdAt = now.getTime()
    order.notes = [{ by: 'system', message: 'new order created', at: now.getTime() }]
    helpers.Database.Order.insert({order}, (err, data) => {
      if (err) {
        res.status(500).json({err: 'Database Access Error'})
      } else {
        next()
      }
    })
  }
}

function reponse() {
  return function(req, res) {
    const order = {...req.body.order}
    delete order.uid
    res.status(200).json({ order })
  }
}

module.exports = [authen, validateOrder, insertOrderToDB, reponse]
