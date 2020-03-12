"use strict"

const {authen} = require('../lib/authen')

function validateParams() {
  return function(req, res, next) {
    if (req.body.orders) {
      next()
    } else {
      res.status(400).json({ error: 'Bad parameters'})
    }
  }
}

function getOrderAndActivateCode(helpers) {
  return function(req, res, next) {
    const keys = req.body.orders.map( order => {
      return {uid: req.uid, createdAt: order}
    })
    helpers.Database.batchGet({
      ORDER: { keys, projection: ['createdAt', 'status', 'activationCode'] }
    })
    .then( data => {
      req.code = []
      req.orders = []
      if (data.ORDER && data.ORDER.length > 0) {
        data.ORDER.forEach( order => {
          if (order.status === 'new') {
            req.orders.push(order.createdAt)
          }
          if (order.activationCode) {
            req.code.push(order.activationCode)
          }
        })
      }
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'BatchGet order',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })

    // helpers.Database.ORDER.find({uid: `= ${req.uid}`, createdAt: `= ${parseInt(req.body.createdAt)}`})
    // .then( data => {
    //   if (data && data.length > 0) {
    //     req.code = data[0].activationCode
    //     next()
    //   } else {
    //     res.status(404).json({ error: 'Not found'})
    //   }
    // })
    // .catch(err => {
    //   helpers.alert && helpers.alert({
    //     message: 'Database operation failed',
    //     action: 'FIND order',
    //     error: err
    //   })
    //   res.status(500).json({ reason: 'Failed to Access Database' })
    // })
  }
}

function deleteOrder(helpers) {
  return function(req, res, next) {
    const params = {
      ORDER: {
        remove: req.orders.map( order => {
          return {uid: req.uid, createdAt: order}
        })
      },
    }
    if (req.code && req.code.length > 0) {
      params.ACTIVECODE = {
        remove: req.code.map(code => {
          return { code }
        })
      }
    }
    helpers.Database.batchWrite(params)
    .then( () => res.status(200).json({ status: 'success' }))
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'DELETE /me/order',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

module.exports = [authen, validateParams, getOrderAndActivateCode, deleteOrder]
