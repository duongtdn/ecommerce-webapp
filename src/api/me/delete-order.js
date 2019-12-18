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
    const notes = {}
    notes[(new Date()).getTime()] = `User has deleted the order. Reason: ${reason}`
    helpers.Database.ORDER.update({uid, number}, { status: 'deleted', notes })
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

module.exports = [authen, deleteOrder]
