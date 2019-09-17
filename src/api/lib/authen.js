"use strict"

const jwt = require('jsonwebtoken')

function authen() {
  return function(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader === 'undefined') {
      res.status(401).json({ explaination: 'Unauthorized' })
      return
    }

    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;

    jwt.verify(token, process.env.PRIVATE_AUTH_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ explaination: 'Unauthorized' })
      } else {
        req.uid = decoded.uid
        next()
      }
    })
  }
}

module.exports = { authen }
