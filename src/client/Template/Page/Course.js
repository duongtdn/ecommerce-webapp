"use strict"

import React, { Component } from 'react'

import { localeString } from '../../lib/util'

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

class ActionPanel extends Component {
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
          <button className="w3-button w3-green w3-card-4" onClick = {_ => console.log('enroll')} >
            Enroll Now {sale ? <span> (-{sale}%) </span> : null}
          </button>
          {
            sale ?
              <p>
                <span className="w3-large w3-text-grey" style={{fontWeight: 'bold', textDecoration: 'line-through', marginRight: '16px'}}>
                  {localeString(price.origin, '.')} {'\u20ab'}
                </span>
                <span className="w3-text-red" style={{fontWeight: 'bold', marginRight: '16px'}}>
                  {localeString(price.offer, '.')} {'\u20ab'}
                </span>
                <hr />
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
              </p>
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
}

export default class Course extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const courseId = this.props.path.match(/\/.*$/)[0].replace('/','')
    const course = this.props.courses.find(course => course.id === courseId)
    console.log(course)
    return (
      <div className="w3-container">

        <h2 style = {{fontWeight: 'bold'}}> {course.title} </h2>
        <span className="w3-tag w3-green">  {course.level} </span>

        <div className="w3-row">
          <div className = "w3-half">
            <CourseInfo  course = {course} />
            <br />
            <ActionPanel course = {course} />
          </div>
        </div>

      </div>
    )
  }
}
