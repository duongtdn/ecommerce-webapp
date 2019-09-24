"use strict"

/* TBD: authen for admin user */
function authenAdmin() {
  return function(req, res, next) {
    next()
  }
}

function getOrder(helpers) {
  return function(req, res, next) {
    const query = req.query
    console.log(query)
    helpers.Database.Order.query(query, (data) => {
      res.status(200).json({ orders: data })
    })
  }
}

module.exports = [authenAdmin, getOrder]
