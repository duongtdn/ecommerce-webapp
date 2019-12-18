"use strict"

function getPromos(helpers) {
  return function(req, res, next) {
    helpers.Database.PROMOTE.fetch()
    .then(data => {
      req.promos = data
      next()
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Read access to Database failed',
        action: `GET /data/promotion`,
        error: err
      })
      res.status(500).json({ reason: 'Read access to Database failed' })
    })
  }
}


function response() {
  return function(req, res) {
    res.status(200).json({ promos: req.promos })
  }
}

module.exports = [getPromos, response]
