"use strict"

const jwt = require('jsonwebtoken')

function createMember(helpers) {
  return function(req, res) {
    if (req.body && req.body.token && req.body.user) {
      jwt.verify(req.body.token, process.env.PRIVATE_AUTH_KEY, (err, decoded) => {
        if (err) {
          res.status(401).send('Unauthorized')
        } else {
          const uid = decoded.uid
          helpers.Database.MEMBER.insert({
            uid,
            email: req.body.user.username,
            fullName: req.body.user.profile.fullName
          })
          .then( () => res.status(200).send('Success'))
          .catch(err => {
            helpers.alert && helpers.alert({
              message: 'Database operation failed',
              action: 'Insert MEMBER',
              error: err
            })
            res.status(500).send('Failed to Access Database')
          })
        }
      })
    } else {
      res.status(400).send('Bad request')
      return
    }
  }
}

module.exports = createMember
