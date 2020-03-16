"use strict"

import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

import xhttp from '@realmjs/xhttp-request'

import { getDay, localeString } from '../../lib/util'

import storage from '../../lib/storage'

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
        <p className="w3-text-grey" style={{fontWeight: 'bold'}}> <FormattedMessage id="label.skills" /> </p>
        {
          course.skills.map(skill => (
            <p key={skill}  className="cursor-pointer w3-text-blue" style={{paddingLeft: '16px', fontWeight: 'bold'}} > + {skill} </p>
          ))
        }
        <p className="w3-text-grey" style={{fontWeight: 'bold'}}> <FormattedMessage id="label.required_for_certificates" /> </p>
        {
          course.certs.map(cert => (
            <p key={cert}  className="cursor-pointer w3-text-blue" style={{paddingLeft: '16px', fontWeight: 'bold'}} > + {cert} </p>
          ))
        }
      </div>
    )
  }
}

const PurchaseBtn = injectIntl(class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      usedVouchers: [],
      sync: false
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.me.rewards.length > 0 && state.usedVouchers.length === 0 && !state.sync) {
      const course = props.course
      const rewards = [...props.me.rewards.filter( _reward=> _reward.type === 'voucher' && _reward.scope.indexOf(course.id) !== -1 && !isExpire(_reward.expireIn))]
      return {
        sync: true,
        usedVouchers: rewards.map(reward => reward.__code)
      }
    }
    return null
  }
  render() {
    const course = this.props.course

    const orders = this.props.me.orders
    if (orders.some(order => !/(^deleted$|^expired$)/.test(order.status) && order.items.some(item => this._isOrderedItem(item, course) || (item.type==='bundle' && item.items.some(item => this._isOrderedItem(item, course))) ))) {
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
          <FormattedMessage id="button.incart" />
        </button>
      </div>
    )
  }
  renderOrderedBtn() {
    return (
      <div style={{marginBottom: '32px'}} >
        <button className="w3-button w3-border w3-border-grey" onClick={e => this.props.navigate('myorders')}>
          <FormattedMessage id="button.ordered" />
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
    const rewards = this.props.me && this.props.me.rewards ? this.props.me.rewards.filter( _reward=> _reward.scope.indexOf(course.id) !== -1 && !isExpire(_reward.expireIn)) : []
    const hasVouchers = rewards.some( reward => reward.type === 'voucher')
    return (
      <div style={{marginBottom: '32px'}} >
        <div>
          <button className="w3-button w3-green w3-card-4" onClick = { e => this.onPurchase(price.offer)} >
            <FormattedMessage id="button.enroll" /> {sale ? <span> (-{sale}%) </span> : null}
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
                        `${this.props.intl.formatMessage({id: 'label.money_saving'})} - ${localeString(p.deduction, '.')} \u20ab (${p.description})`
                        : p.type === 'gift' ? `${this.props.intl.formatMessage({id: 'label.gift'})}: ${p.description}`
                        : null
                      }
                    </p>
                  )
                })}
                <p className="w3-small w3-text-grey" style={{ display: hasVouchers? 'block' : 'none'}}> <FormattedMessage id="label.vouchers_can_use" /> </p>
                { rewards.map( (reward,index) => {
                  if (reward.type !== 'voucher') { return null }
                  const isAdded = this.state.usedVouchers.indexOf(reward.__code) !== -1
                  const textStyle = isAdded ? 'w3-text-green' : 'w3-text-grey italic'
                  const bgColor = isAdded ? 'w3-red' : 'w3-light-grey'
                  return (
                    <div key = {index} className={`w3-small w3-cell-row w3-border w3-border-grey w3-round ${bgColor} ${textStyle}`} style={{marginBottom: '8px', paddingLeft: '4px'}}>
                      <div className={`w3-cell w3-white ${textStyle}`} style={{padding: '4px 8px'}}>
                        <label className="bold" style={{marginRight: '6px'}}> {reward.code.toUpperCase()} </label>
                        <label className="w3-small italic" > <FormattedMessage id={isAdded?'label.use':'label.not_use'} /> </label>
                        <br/>
                        { `${this.props.intl.formatMessage({id: 'label.value'})}: ${localeString(reward.value, '.')} \u20ab`}
                        {
                          reward.expireIn ?
                            <span className="w3-text-red italic"> <br /> <FormattedMessage id="label.valid_till" />: {getDay(reward.expireIn)} </span>
                            : null
                        }
                      </div>
                      <div  className={`w3-cell cursor-pointer ${isAdded? 'w3-text-white' : 'w3-text-black'}`}
                            onClick = {e => this.useVoucher(reward.__code)}
                            style={{ width: '40px', textAlign: 'center', verticalAlign: 'middle'}}>
                        { isAdded ? 'x' : '+' }
                      </div>
                    </div>
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
    if (this.state.usedVouchers) {
      const rewards = me.rewards.filter( reward => this.state.usedVouchers.indexOf(reward.__code) !== -1 && reward.scope.indexOf(course.id) !== -1)
      rewards.forEach( reward => {
        if (reward.type === 'voucher' && !isExpire(reward.expireIn)) {
          promo.deduction += parseInt(reward.value)
        }
      })
    }
    return promo
  }
  useVoucher(code) {
    const usedVouchers = [...this.state.usedVouchers]
    const index = usedVouchers.indexOf(code)
    if ( index === -1) {
      usedVouchers.push(code)
    } else {
      usedVouchers.splice(index, 1)
    }
    this.setState({ usedVouchers })
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
    if (this.state.usedVouchers && this.state.usedVouchers.length > 0) {
      item.vouchers = this.state.usedVouchers
    }
    this.props.onPurchase && this.props.onPurchase(item)
  }
})

const PurchaseBundleBtn = injectIntl(class extends Component {
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
        <h4 className="w3-text-blue bold"> <i className="fas fa-dollar-sign" /><i className="fas fa-dollar-sign" /> <FormattedMessage id="label.bundle_offer" /> </h4>
        {
          bundle.map( offer => {
            if (offer.expireIn && isExpire(offer.expireIn)) { return null }
            const bundlePrice = this.calculateOfferBundlePrice(offer)
            const orders = this.props.me.orders
            const cart = storage.get(storage.key.CART) || []
            const purchaseBtn = (orders.some(order => !/(^deleted$|^expired$)/.test(order.status) && order.items.some(item => item.type==='bundle' && item.code === offer.id))) ?
              <button className="w3-button w3-border w3-border-grey" onClick={e => this.props.navigate('myorder')}>
                <FormattedMessage id="button.ordered" />
              </button>
              :
                (cart.some(_item => _item.code === offer.id)) ?
                  <button className="w3-button w3-border w3-border-grey" onClick={e => this.props.navigate('order')}>
                    <FormattedMessage id="button.incart" />
                  </button>
                :
                  <button className="w3-button w3-blue w3-card-4" onClick = { e => this.onPurchase(offer, bundlePrice)} >
                      <FormattedMessage id="button.enroll_bundle" /> (-{bundlePrice.saved}%)
                  </button>
            return (
              <div key = {offer.id}>
                <p> <FormattedMessage id="label.bundle_description" values={{ num: offer.deduction.length}} /> </p>
                <ul className='w3-ul'>
                  { offer.deduction.map( promo => {
                    /* currently, bundle only apply to course, later will support other goods such as boards, sofware licenses... */
                    const course = this.props.courses.find( course => course.id === promo.target)
                    if (!course) { return null }
                    const price = {
                      origin: parseInt(course.price),
                      offer: Math.floor(parseInt(course.price) - parseInt(promo.number))
                    }
                    return (
                      <li key={promo.target}>
                        <div className="w3-text-blue-grey"> {course.title} </div>
                        {
                          this.isPurchased(course) ?
                            <div className="w3-small w3-text-grey italic"> <FormattedMessage id="label.ordered" /> </div>
                          :
                          <div>
                            <span className="w3-text-grey" style={{textDecoration: 'line-through', marginRight: '16px'}}> {localeString(price.origin, '.')} {'\u20ab'} </span>
                            <span className="w3-text-red w3-small"> {localeString(price.offer, '.')} {'\u20ab'} </span>
                          </div>
                        }
                      </li>
                    )
                  })}
                  {
                    offer.deduction.every( promo => this.isPurchased(this.props.courses.find(course => course.id === promo.target)))?
                      <li className="italic bold"> <FormattedMessage id="label.ordered_all_items" /> </li>
                      :
                      <li className="bold">
                        <FormattedMessage id="label.bundle_price" />: <span className="w3-text-red"> {localeString(bundlePrice.subTotal, '.')} {'\u20ab'} </span> {' '}
                        <span className="w3-small" style={{fontStyle: "italic"}} > <FormattedMessage id="label.money_saving" /> {localeString(bundlePrice.deduction, '.')} {'\u20ab'} </span>
                      </li>
                  }

                </ul>
                <p>
                  {
                    offer.deduction.every( promo => this.isPurchased(this.props.courses.find(course => course.id === promo.target)))? null : purchaseBtn
                  }
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
    const enrolls = this.props.me.enrolls
    if (enrolls.find(e => e.courseId === course.id)) { return true }
    const orders = this.props.me.orders
    if (orders.find(order => !/(^deleted$|^expired$)/.test(order.status) && order.items.find(item => (item.type === 'course' && item.code === course.id) || (item.type === 'bundle' && item.items.find(item => item.type === 'course' && item.code === course.id))))) {
      return true
    }
    return false
  }
})

class CourseDetail extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const course = this.props.course
    return (
      <div>
        <div dangerouslySetInnerHTML={{__html: course.description}} style={{margin: '16px 0'}} />

        <p style={{fontWeight: 'bold'}}><FormattedMessage id="label.skills" /></p>
        <ul className="w3-ul">
          {
            course.skills.map(skill => (<li key={skill} className="w3-border-0">{skill}</li> ))
          }
        </ul>

        <p style={{fontWeight: 'bold'}}><FormattedMessage id="label.required_for_certificates" /></p>
        <ul className="w3-ul">
          {
            course.certs.map(cert => (<li key={cert} className="w3-border-0">{cert}</li> ))
          }
        </ul>
      </div>
    )
  }
}

class Course extends Component {
  constructor(props) {
    super(props)
    this.onPurchase = this.onPurchase.bind(this)
  }
  render() {
    const path = this.props.href && this.props.href.getPathName() || this.props.path
    if (!path.match(/\/.*$/)) { return null }
    const courseId = path.match(/\/.*$/)[0].replace('/','')
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
              <div style={{marginBottom: '32px'}}>
                <button className="w3-button w3-blue" onClick={e => this.goToStudy(course)}><FormattedMessage id="button.study_now" /></button>
              </div>
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
    const intl = this.props.intl
    const _addToCart = () => {
      const cart = storage.get(storage.key.CART) || []
      if (cart.some(_item => _item.code === item.code)) {
        // item is already in cart
        return
      }
      cart.push(item)
      storage.update(storage.key.CART, cart)
      this.props.showPopup('yesno', {
        message: intl.formatMessage({id: 'popup.cart.label.ask_checkout'}),
        yesLabel: intl.formatMessage({id: 'popup.cart.button.yes_checkout'}),
        noLabel: intl.formatMessage({id: 'popup.cart.button.no_checkout'})
      })
      .then( _ => this.props.navigate('order') )
      .catch(function(){})
    }
    if (this.props.user) {
      _addToCart()
    } else {
      this.props.showPopup('login', {
        message: intl.formatMessage({id: 'popup.require_login_to_purchase'}),
        yesLabel: intl.formatMessage({id: 'button.login'}),
        noLabel: intl.formatMessage({id: 'button.close'})
      })
      .then( _ => { _addToCart() })
      .catch(function(){})
    }
  }
  goToStudy(course) {
    const enroll = this.props.me.enrolls.find(e => e.courseId === course.id)
    if (!enroll) { reuturn }
    switch (enroll.status){
      case 'new':
        // show popup course is not activated yet.
        // Actually, this case will not happen since button is only shown if enroll is active
        this.props.showPopup('info', {message: 'This course is not activated yet', closeBtn: true})
        break
      case 'active':
        xhttp.put(`/me/enroll/`, {courseId: course.id, status: 'studying' }, {authen: true})
      case 'studying':
      case 'completed':
        window.open(`${this.props.env.elearn}/${course.id}`)
        break
      default:
        break
    }
  }
}

export default injectIntl(Course)
