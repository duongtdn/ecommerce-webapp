"use strict"

import React, { Component } from 'react'

import { localeString } from '../../lib/util'

import storage from '../../lib/storage'

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
    const promo = this.composePromo()
    const sale = promo.deduction ? Math.floor((parseInt(promo.deduction)/parseInt(course.price))*100) : null
    const price = {
      origin: course.price,
      offer: course.price - promo.deduction
    }
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
                { course.promo.map( (p, index) => {
                  return (
                    <p key = {index} className="w3-text-red">
                      {p.type === 'sale' ?
                        `Save - ${localeString(p.deduction, '.')} \u20ab (${p.description})`
                        :
                        `Gift: ${p.description}`
                      }
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
    const user = this.props.user
    const promo = { deduction: 0, gifts: false }
    course.promo.forEach( p => {
      if (p.type === 'sale' && this.checkExpire(p.expireIn)) { promo.deduction += parseInt(p.deduction) }
      if (p.type === 'gift' && this.checkExpire(p.expireIn)) { promo.gifts = true }
    })
    if (user && user.vouchers && user.vouchers[course.id] && this.checkExpire(user.vouchers[course.id].expireIn)) {
      promo.deduction += parseInt(user.vouchers[course.id].deduction)
    }
    return promo
  }
  checkExpire(timestamp) {
    if (!timestamp) {
      return true
    }
    const now = (new Date()).getTime()
    return (parseInt(now) < parseInt(timestamp))
  }
  onPurchase(price) {
    const course = this.props.course
    const item = {
      code: course.id,
      name: course.title,
      type: 'course',
      checked: true,
      price
    }
    this.props.onPurchase && this.props.onPurchase(item)
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
            <PurchaseBtn course = {course} onPurchase = {this.onPurchase} />
          </div>
            <div className="w3-half w3-container" style={{maxWidth: '480px', marginBottom: '32px'}}>
              <div className="embed-responsive">
                <iframe src="https://www.youtube.com/embed/tgbNymZ7vqY" />
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
    const cart = storage.get(storage.key.CART) || []
    cart.push(item)
    storage.update(storage.key.CART, cart)
    this.props.navigate('order')
  }
}
