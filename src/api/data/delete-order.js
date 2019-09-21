"use strict"

const {authen} = require('../lib/authen')

function deleteOrder(helpers) {
  return function(req, res, next) {
    const uid = req.uid
    const number = req.body.number
    if (!number) {
      res.status(400).json({ error: 'Bad parameters'})
      return
    }
    const reason = req.body.reason
    const notes = { by: 'user', message: `User has deleted the order. Reason: ${reason}`, at: (new Date()).getTime() }
    helpers.Database.Order.update({uid, number, status: 'deleted', notes}, (err) => {
      if (err) {
        res.status(err).json({ error: `Cannot update order from database. Error code: ${err}` })
      } else {
        res.status(200).json({ status: 'success' })
      }
    })
  }
}

module.exports = [authen, deleteOrder]
