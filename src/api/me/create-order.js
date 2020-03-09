"use strict"

const jwt = require('jsonwebtoken')
const {authen} = require('../lib/authen')

function _rand() {
  return Math.floor(100000 + Math.random() * 900000)
}

function _ustring(ln) {
  return Math.random().toString(36).substr(2,ln)
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
        courseIds.indexOf(item.code) === -1 && courseIds.push(item.code)
      }
      if (item.type === 'bundle') {
        item.items.map(i=>i.code).forEach(c => courseIds.indexOf(c) === -1 && courseIds.push(c))
      }
    })
    const promotion = []
    // here I load promotion from order sent by client. I need to re-validate it later
    order.items.forEach(item => item.promotion.forEach(p => (promotion.indexOf(p) === -1) && promotion.push(p)))
    helpers.Database.batchGet({
      COURSE: {
        keys: courseIds.map(id => {return { id }}),
        projection: ['id', 'price']
      },
      PROMOTE: {
        keys: promotion.map(id => {return { id }})
      },
      MEMBER: {
        keys: [{ uid: req.uid }],
        projection: ['rewards']
      }
    })
    .then( data => {
      const courses = data.COURSE
      const promos = data.PROMOTE
      // compare price for each item
      let error = ''
      order.items.forEach( item => {
        if (item.type === 'course') {
          const course = courses.find(c => c.id === item.code)
          let deduction = 0
          item.promotion.forEach(promo => {
            promos.filter(p => p.id === promo).forEach( p => {
              // here should validate the promotion
              if (p.type === 'sale' && !_isExpire(p.expireIn) && p.target.indexOf(course.id) !== -1) { deduction += parseInt(p.deduction) }
            })
          })
          const rewards = []
          for (let code in data.MEMBER[0].rewards) {
            const reward = data.MEMBER[0].rewards[code]
            if (reward.scope.indexOf(course.id) !== -1) {
              rewards.push(reward)
            }
          }
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
          // validate if bundle offer is expired
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
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'BatchGet COURSE, PROMOTE, MEMBER',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}


/*
  order.billTo is ignored for the time being
*/
function insertOrderToDB(helpers) {
  return function(req, res, next) {
    const now = new Date()
    const order = req.body.order
    order.number = `${_rand()}-${_ustring(12)}`
    order.uid = req.uid
    order.status = 'new'
    order.createdAt = now.getTime()
    order.notes = {}
    order.notes[now.getTime()] = 'new order created'
    if (order.paymentMethod === 'cod') {
      order.activationCode = _ustring(8).toUpperCase()
    }
    helpers.Database.ORDER.insert(order)
    .then(_ => next())
    .catch(err => {
      console.log(err)
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'Inser to ORDER',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

function insertActivationCodeToDB(helpers) {
  return function(req, res, next) {
    const order = req.body.order
    if (order.paymentMethod !== 'cod') {
      next()
    } else {
      const courses = []
      order.items.forEach( item => {
        if (item.type === 'course') {
          courses.push(item.code)
        } else if (item.type === 'bundle') {
          item.items.forEach( item => {
            if (item.type === 'course') {
              courses.push(item.code)
            }
          })
        }
      })
      const code = {
        uid: req.uid,
        code: order.activationCode,
        order: {number: order.number, createdAt: order.createdAt},
        courses
      }
      helpers.Database.ACTIVECODE.insert(code)
      .then(_ => next())
      .catch(err => {
        helpers.alert && helpers.alert({
          message: 'Database operation failed',
          action: 'Insert to ACTIVECODE',
          error: err
        })
        res.status(500).json({ reason: 'Failed to Access Database' })
      })
    }
  }
}

function sendNotification(helpers) {
  return function(req, res, next) {
    const token = jwt.sign({uid: req.uid}, process.env.PRIVATE_AUTH_KEY)
    helpers.notify && helpers.notify({
      template: 'order-created',
      recipient: token,
      data: req.body.order
    })
    .then(next)
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Cannot send notification',
        action: 'Send Notification',
        error: err
      })
      next()
    })
  }
}

function reponse() {
  return function(req, res) {
    const order = {...req.body.order}
    delete order.uid
    delete order.activationCode
    res.status(200).json({ order })
  }
}

module.exports = [authen, validateOrder, insertOrderToDB, insertActivationCodeToDB, sendNotification, reponse]
