"use strict"

function rand() {
  return Math.random().toString(36).substr(2,9)
}

function isExpire(timestamp) {
  if (!timestamp) { return false }
  const now = (new Date()).getTime()
  return (parseInt(now) > parseInt(timestamp))
}

function authen() {
  return function (req, res, next) {
    req.uid = 'test-user'
    next()
  }
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
        Promo: {key: {id: promotion}, projection: ['target', 'deduction']},
      },
      (data) => {
        const courses = data.Course
        const promos = data.Promo
        // compare price for each item
        order.items.forEach( item => {
          if (item.type === 'course') {
            const course = courses.find(c => c.id === item.code)
            let deduction = 0
            item.promotion.forEach(promo => {
              promos.filter(p => p.id === promo).forEach( p => {
                if (p.type === 'sale' && !isExpire(p.expireIn)) { deduction += parseInt(p.deduction) }
              })
            })
            // here also need to check voucher
            const offerPrice = course.price - deduction
            if (offerPrice !== item.price) {
              res.status(400).json({reason: 'cart outdated'})
              return
            }
          }
          if (item.type === 'bundle') {
            const promo = promos.find(p => p.id === item.code)
            if (promo.expireIn && isExpire(promo.expireIn)) {
              res.status(400).json({reason: 'expired'})
              return
            }
            const subTotal = promo.deduction.reduce( (acc, cur) => {
              /* currently, bundle only apply to course, later will support other goods such as boards, sofware licenses... */
              const course = courses.find( course => course.id === cur.target)
              return acc + Math.floor(parseInt(course.price) - parseInt(cur.number))
            }, 0)
            if (subTotal !== item.price) {
              res.status(400).json({reason: 'cart outdated'})
              return
            }
          }
        })
      }
    )
    next()
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
    order.number = rand()
    order.uid = req.uid
    order.status = 'new'
    order.createdAt = now.getTime()
    order.notes = [{ by: 'system', message: 'new order created', at: now.getTime() }]
    helpers.Database.Order.insert({order}, (err, data) => {
      if (err) {
        res.status(500).json({err: 'Database Access Error'})
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
