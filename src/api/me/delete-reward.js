"use strict"

const {authen} = require('../lib/authen')

function validateParams() {
  return function(req, res, next) {
    if (req.body.rewards && req.body.rewards.length && req.body.rewards.length > 0) {
      next()
    } else {
      res.status(400).json({ error: 'Bad parameters'})
    }
  }
}

function deleteRewards(helpers) {
  return function(req, res) {
    const uid = req.uid
    const rewards = req.body.rewards.map(reward => {
      return `rewards.${reward}`
    })
    helpers.Database.MEMBER.remove({ uid }, rewards)
    .then(() => res.status(200).json({ status: 'success' }))
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'MEMBER remove rewards',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

module.exports = [authen, validateParams, deleteRewards]
