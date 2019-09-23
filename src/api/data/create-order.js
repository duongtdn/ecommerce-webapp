"use strict"

const {authen} = require('../lib/authen')

function _rand() {
  // return Math.random().toString(36).substr(2,9)
  return Math.floor(100000 + Math.random() * 900000)
}

function _isExpire(timestamp) {
  if (!timestamp) { return false }
  const now = (new Date()).getTime()
  return (parseInt(now) > parseInt(timestamp))
}

function validateOrder(helpers) {
  return function (req, res, next) {
    if (!req.body.order) {
      res.status(400).json({error: 'Bad Parameters'})
      return
    }

    const order = req.body.order
    if (!order.items || !order.delivery || !order.paymentMethod) {
      res.status(400).json({error: 'Bad Parameters'})
      return
    }

    const courseIds = []
    order.items.forEach(item => {
      if (item.type === 'course') {
        courseIds.indexOf(item.code) && courseIds.push(item.code)
      }
      if (item.type === 'bundle') {
        item.items.map(i=>i.code).forEach(c => courseIds.indexOf(c) && courseIds.push(c))
      }
    })
    const promotion = []
    order.items.forEach(item => item.promotion.forEach(p => (promotion.indexOf(p) === -1) && promotion.push(p)))
    helpers.Database.find(
      {
        Course: {key: {id: courseIds}, projection: ['price']},
        Promo: {key: {id: promotion}},
        User: {key: {uid: req.uid}, projection: ['rewards']}
      },
      (data) => {
        const courses = data.Course
        const promos = data.Promo
        // compare price for each item
        let error = ''
        order.items.forEach( item => {
          if (item.type === 'course') {
            const course = courses.find(c => c.id === item.code)
            let deduction = 0
            item.promotion.forEach(promo => {
              promos.filter(p => p.id === promo).forEach( p => {
                if (p.type === 'sale' && !_isExpire(p.expireIn)) { deduction += parseInt(p.deduction) }
              })
            })
            // here also need to check voucher
            const rewards = data.User[0].rewards.filter( _reward => _reward.scope.indexOf(course.id) !== -1 )
            rewards.forEach( reward => {
              if (reward.type === 'voucher' && !_isExpire(reward.expireIn)) {
                deduction += parseInt(reward.value)
              }
            })
            const offerPrice = course.price - deduction
            if (offerPrice !== item.price) {
              error = 'cart outdated'
              return
            }
          }
          if (item.type === 'bundle') {
            const promo = promos.find(p => p.id === item.code)
            if (promo.expireIn && _isExpire(promo.expireIn)) {
              error = 'expired'
              return
            }
            const subTotal = promo.deduction.reduce( (acc, cur) => {
              /* currently, bundle only apply to course, later will support other goods such as boards, sofware licenses... */
              const course = courses.find( course => course.id === cur.target)
              if (!course) { return acc }
              return acc + Math.floor(parseInt(course.price) - parseInt(cur.number))
            }, 0)
            if (subTotal !== item.price) {
              error = 'cart outdated'
              return
            }
          }
        })
        if (error.length === 0) {
          next()
        } else {
          res.status(400).json({ reason: error })
        }
      }
    )
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
    order.number = _rand()
    order.uid = req.uid
    order.status = 'new'
    order.createdAt = now.getTime()
    order.notes = [{ by: 'system', message: 'new order created', at: now.getTime() }]
    helpers.Database.Order.insert({order}, (err, data) => {
      if (err) {
        res.status(403).json({err})
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
