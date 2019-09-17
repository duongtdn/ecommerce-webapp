"use strict"

import React, { Component } from 'react'

import { localeString } from '../../lib/util'

import storage from '../../lib/storage'

import env from '../../script/env'

function isExpire(timestamp) {
  if (!timestamp) {
    return false
  }
  const now = (new Date()).getTime()
  return (parseInt(now) > parseInt(timestamp))
}

class CourseInfo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const course = this.props.course
    return (
      <div>
        <p className="w3-text-grey" style={{fontStyle: 'italic'}} > {course.snippet} </p>
        <p className="w3-text-grey" style={{fontWeight: 'bold'}}> Skills </p>
        {
          course.skills.map(skill => (
            <p key={skill}  className="cursor-pointer w3-text-blue" style={{paddingLeft: '16px', fontWeight: 'bold'}} > + {skill} </p>
          ))
        }
        <p className="w3-text-grey" style={{fontWeight: 'bold'}}> Required for Certificates </p>
        {
          course.certs.map(cert => (
            <p key={cert}  className="cursor-pointer w3-text-blue" style={{paddingLeft: '16px', fontWeight: 'bold'}} > + {cert} </p>
          ))
        }
      </div>
    )
  }
}

class PurchaseBtn extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const course = this.props.course

    const orders = this.props.me.orders
    if (orders.some(order => order.items.some(item => this._isOrderedItem(item, course) || (item.type==='bundle' && item.items.some(item => this._isOrderedItem(item, course))) ))) {
      return this.renderOrderedBtn()
    }

    const enrolls = this.props.me.enrolls
    if (enrolls.some(enroll => enroll.courseId === course.id && enroll.status === 'new')) {
      return this.renderOrderedBtn()
    }

    const cart = storage.get(storage.key.CART) || []
    if (cart.some(_item => _item.code === course.id)) {
      return this.renderInCartBtn()
    } else {
      return this.renderPurchaseBtn()
    }
  }
  _isOrderedItem(item, course) {
    return item.type==='course' && item.code === course.id
  }
  renderInCartBtn() {
    return (
      <div style={{marginBottom: '32px'}} >
         <button className="w3-button w3-border w3-border-grey" onClick={e => this.props.navigate('order')}>
            In Cart
          </button>
      </div>
    )
  }
  renderOrderedBtn() {
    return (
      <div style={{marginBottom: '32px'}} >
         <button className="w3-button w3-border w3-border-grey" onClick={e => this.props.navigate('myorder')}>
            Ordered
          </button>
      </div>
    )
  }
  renderPurchaseBtn() {
    const course = this.props.course
    const promo = this.composePromo()
    const sale = promo.deduction ? Math.floor((parseInt(promo.deduction)/parseInt(course.price))*100) : null
    const price = {
      origin: course.price,
      offer: course.price - promo.deduction
    }
    const vouchers = this.props.me && this.props.me.vouchers ? this.props.me.vouchers.filter( _voucher => _voucher.scope.indexOf(course.id) !== -1 ) : []
    return (
      <div style={{marginBottom: '32px'}} >
        <div>
          <button className="w3-button w3-green w3-card-4" onClick = { e => this.onPurchase(price.offer)} >
            Enroll Now {sale ? <span> (-{sale}%) </span> : null}
          </button>
          {
            sale ?
              <div>
                <p>
                  <span className="w3-large w3-text-grey" style={{fontWeight: 'bold', textDecoration: 'line-through', marginRight: '16px'}}>
                    {localeString(price.origin, '.')} {'\u20ab'}
                  </span>
                  <span className="w3-text-red" style={{fontWeight: 'bold', marginRight: '16px'}}>
                    {localeString(price.offer, '.')} {'\u20ab'}
                  </span>
                </p>
                { this.props.promo.map( (p, index) => {
                  return (
                    <p key = {index} className="w3-text-red">
                      {p.type === 'sale' ?
                        `Save - ${localeString(p.deduction, '.')} \u20ab (${p.description})`
                        : p.type === 'gift' ? `Gift: ${p.description}`
                        : null
                      }
                    </p>
                  )
                })}
                { vouchers.map( voucher => {
                  return (
                    <p key = {voucher.code} className="w3-text-red">
                      { `Save - ${localeString(voucher.value, '.')} \u20ab (voucher ${voucher.code})`}
                    </p>
                  )
                })}
              </div>
              :
              <p>
                <span className="w3-large w3-text-orange" style={{fontWeight: 'bold', marginRight: '16px'}}>
                  {localeString(price.origin, '.')} {'\u20ab'}
                </span>
              </p>
          }
        </div>
      </div>
    )
  }
  composePromo() {
    const course = this.props.course
    const me = this.props.me
    const promo = { deduction: 0, gifts: false }
    this.props.promo.forEach( p => {
      if (p.type === 'sale' && !isExpire(p.expireIn)) { promo.deduction += parseInt(p.deduction) }
      if (p.type === 'gift' && !isExpire(p.expireIn)) { promo.gifts = true }
    })
    if (me && me.vouchers) {
      const vouchers = me.vouchers.filter( _voucher => _voucher.scope.indexOf(course.id) !== -1 )
      vouchers.forEach( voucher => {
        if (!isExpire(voucher.expireIn)) {
          promo.deduction += parseInt(voucher.value)
        }
      })
    }
    return promo
  }
  onPurchase(price) {
    const course = this.props.course
    const promotion = this.props.promo.filter( promo => promo.target.indexOf(course.id) !== -1 && promo.type !== 'bundle').map( promo => promo.id)
    const item = {
      code: course.id,
      name: course.title,
      type: 'course',
      checked: true,
      promotion,
      price
    }
    this.props.onPurchase && this.props.onPurchase(item)
  }
}

class PurchaseBundleBtn extends Component {
  constructor(props) {
    super (props)
  }
  render() {
    if (!this.props.promo) {
      return null
    }
    const bundle = this.props.promo.filter( promo => promo.type === 'bundle')
    if (!bundle || bundle.length === 0) {
      return null
    }
    return (
      <div style={{marginBottom: '32px'}} >
        <h4 className="w3-text-blue"> <i className="fas fa-dollar-sign" /><i className="fas fa-dollar-sign" /> Bundle Offer </h4>
        {
          bundle.map( offer => {
            if (offer.expireIn && isExpire(offer.expireIn)) { return null }
            const bundlePrice = this.calculateOfferBundlePrice(offer)
            const orders = this.props.me.orders
            const cart = storage.get(storage.key.CART) || []
            const purchaseBtn = (orders.some(order => order.items.some(item => item.type==='bundle' && item.code === offer.id))) ?
              <button className="w3-button w3-border w3-border-grey" onClick={e => this.props.navigate('myorder')}>
                Ordered
              </button>
              :
                (cart.some(_item => _item.code === offer.id)) ?
                  <button className="w3-button w3-border w3-border-grey" onClick={e => this.props.navigate('order')}>
                    In Cart
                  </button>
                :
                  <button className="w3-button w3-blue w3-card-4" onClick = { e => this.onPurchase(offer, bundlePrice)} >
                    Purchase Bundle (-{bundlePrice.saved}%)
                  </button>
            return (
              <div key = {offer.id}>
                <p> Buy {offer.deduction.length} at once, get super discount </p>
                <ul className='w3-ul'>
                  { offer.deduction.map( promo => {
                    /* currently, bundle only apply to course, later will support other goods such as boards, sofware licenses... */
                    const course = this.props.courses.find( course => course.id === promo.target)
                    if (!course) { return null }
                    if (this.isPurchased(course)) { return null }
                    const price = {
                      origin: parseInt(course.price),
                      offer: Math.floor(parseInt(course.price) - parseInt(promo.number))
                    }
                    return (
                      <li key={promo.target}>
                        <div className="w3-text-blue-grey"> {course.title} </div>
                        <div>
                          <span className="w3-text-grey" style={{textDecoration: 'line-through', marginRight: '16px'}}> {localeString(price.origin, '.')} {'\u20ab'} </span>
                          <span className="w3-text-red w3-small"> {localeString(price.offer, '.')} {'\u20ab'} </span>
                        </div>
                      </li>
                    )
                  })}
                  <li style={{fontWeight: 'bold'}}>
                    Bundle price: <span className="w3-text-red"> {localeString(bundlePrice.subTotal, '.')} {'\u20ab'} </span> {' '}
                    <span className="w3-small" style={{fontStyle: "italic"}} > saved {localeString(bundlePrice.deduction, '.')} {'\u20ab'} </span>
                  </li>
                </ul>
                <p>
                  {purchaseBtn}
                </p>

              </div>
            )
          })
        }
      </div>
    )
  }
  calculateOfferBundlePrice(offer) {
    const subTotal = offer.deduction.reduce( (acc, cur) => {
      /* currently, bundle only apply to course, later will support other goods such as boards, sofware licenses... */
      const course = this.props.courses.find( course => course.id === cur.target)
      if (this.isPurchased(course)) { return acc }
      return acc + Math.floor(parseInt(course.price) - parseInt(cur.number))
    }, 0 )
    const originPrice = offer.deduction.reduce( (acc, cur) => {
      const course = this.props.courses.find( course => course.id === cur.target)
      if (this.isPurchased(course)) { return acc }
      return acc + parseInt(course.price)
    }, 0 )
    const saved= Math.floor((originPrice-subTotal)*100/originPrice)
    return {subTotal, saved, deduction: originPrice-subTotal}
  }
  onPurchase(offer, bundlePrice) {
    const items = offer.deduction.map( cur => {
      /* currently, bundle only apply to course, later will support other goods such as boards, sofware licenses... */
      const course = this.props.courses.find( course => course.id === cur.target)
      if (this.isPurchased(course)) { return undefined }
      return {
        code: course.id,
        name: course.title,
        type: 'course',
      }
    }).filter( cur => cur !== undefined)

    this.props.onPurchase && this.props.onPurchase({
      code: offer.id,
      type: offer.type,
      name: offer.description,
      items,
      checked: true,
      promotion: [offer.id],
      price: bundlePrice.subTotal
    })
  }
  isPurchased(course) {
    return false // todo: check whether course is purchased
  }
}

class CourseDetail extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const course = this.props.course
    return (
      <div>
        <div dangerouslySetInnerHTML={{__html: course.description}} style={{margin: '16px 0'}} />

        <p style={{fontWeight: 'bold'}}>Skills to be gained</p>
        <ul className="w3-ul">
          {
            course.skills.map(skill => (<li key={skill} className="w3-border-0">{skill}</li> ))
          }
        </ul>

        <p style={{fontWeight: 'bold'}}>This course is required for certificates</p>
        <ul className="w3-ul">
          {
            course.certs.map(cert => (<li key={cert} className="w3-border-0">{cert}</li> ))
          }
        </ul>
      </div>
    )
  }
}

export default class Course extends Component {
  constructor(props) {
    super(props)
    this.onPurchase = this.onPurchase.bind(this)
  }
  render() {
    const courseId = this.props.path.match(/\/.*$/)[0].replace('/','')
    const course = this.props.courses.find(course => course.id === courseId)
    if (!course) { return (<div className="w3-container w3-text-red"> 404 Page not found </div>) }
    const promo = this.props.promos? this.props.promos.filter( promo => promo.target.indexOf(course.id) !== -1 ) : []
    return (
      <div className="">

        <div className="w3-container">
          <h2 style = {{fontWeight: 'bold'}}> {course.title} </h2>
          <span className="w3-tag w3-green">  {course.level} </span>
        </div>

        <div className="w3-row">
          <div className = "w3-half w3-container">
            <CourseInfo  course = {course} />
            <br />
            {
              this.props.me && this.props.me.enrolls && this.props.me.enrolls.find( e => e.courseId === courseId && /(^active$|^studying$|^completed$)/i.test(e.status) ) ?
              <div style={{marginBottom: '32px'}}> <a href={`${env.elearn}/${courseId}`} className="w3-button w3-blue" target="_blank">Study Now</a> </div>
              :
              <div>
                <PurchaseBtn course = {course} promo = {promo} onPurchase = {this.onPurchase} {...this.props} />
                <PurchaseBundleBtn courses = {this.props.courses} promo = {promo} onPurchase = {this.onPurchase} {...this.props} />
              </div>
            }
          </div>
            <div className="w3-half w3-container" style={{maxWidth: '480px', marginBottom: '32px'}}>
              <div className="embed-responsive">
                <iframe src={course.picture.uri} />
              </div>
            </div>
        </div>

        <div className="w3-container">
          <h3 className="w3-text-blue" >COURSE INFORMATION</h3>
          <CourseDetail course = {course} />
        </div>

      </div>
    )
  }
  onPurchase(item) {
    const _addToCart = () => {
      const cart = storage.get(storage.key.CART) || []
      if (cart.some(_item => _item.code === item.code)) {
        // item is already in cart
        return
      }
      cart.push(item)
      storage.update(storage.key.CART, cart)
      this.props.showPopup('yesno', {message: 'Item added to Cart. Do you want to checkout cart now?', yesLabel: 'Checkout Cart', noLabel: 'Not right now'})
      .then( _ => this.props.navigate('order') )
      .catch(function(){})
    }
    if (this.props.user) {
      _addToCart()
    } else {
      this.props.showPopup('login', {message: 'Please login to make purchase'})
      .then( _ => { _addToCart() })
      .catch(function(){})
    }
  }
}
