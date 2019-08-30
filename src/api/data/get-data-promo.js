"use strict"

function getPromos(helpers) {
  return function(req, res, next) {
    helpers.Database.Promo.find({}, data => {
      req.promos = data
      next()
    })
  }
}

function getTags(helpers) {
  return function(req, res, next) {
    helpers.Database.Tag.find({}, data => {
        req.tags = data
        next()
      }
    )
  }
}

function response() {
  return function(req, res) {
    res.status(200).json({ promos: req.promos, tags: req.tags })
  }
}

module.exports = [getPromos, getTags, response]
