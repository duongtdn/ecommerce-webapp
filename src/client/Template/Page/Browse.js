"use strict"

import React, { Component } from 'react'

class PromoTag extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const course = this.props.course
    const promo = this.composePromo()
    const sale = promo.deduction ? Math.floor((parseInt(promo.deduction)/parseInt(course.price))*100) : null
    return (
      <div style={{display: 'inline-block'}} >
        {
          sale ? <span className="w3-text-red"> <i className="fas fa-tags" /> {' '} -{sale}% </span> : null
        }
        <br />
        {
          promo.gifts ? <span className="w3-text-green"> <i className="fas fa-gift" /> {' '} +Gifts </span> : null
        }
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

class LevelBar extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const course = this.props.course
    const _rating = this._ratingCourseLevel(course.level)
    return (
      <div className="w3-container" >
        <div className="w3-bar-item  w3-right">
            {
              _rating.map((val, index) => {
                const _color = val ? 'w3-green' : 'w3-grey w3-opacity'
                return (<div key={index} className={_color} style={{width: '8px', height: '8px', marginLeft: '2px', display: 'inline-block'}} />)
              })
            }
            <span className='w3-small'> {course.level} </span>
        </div>
      </div>
    )
  }
  _ratingCourseLevel(level) {
    if (level === 'Beginner') {
      return [false, false, true]
    }
    if (level === 'Intermidate') {
      return [false, true, true]
    }
    if (level === 'Advanced') {
      return [true, true, true]
    }
  }
}

class CoursePanel extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const user = this.props.user
    const course = this.props.course
    return (
      <div className="w3-bar">
        <div className="w3-bar-item">
          <div className="w3-cell-row">
            <img src={course.thumbnail} className="w3-container w3-cell w3-hide-small" style={{width:'150px', borderRadius: '24px'}} />

            <div className="w3-cell">
              <div className="cursor-pointer w3-text-dark-grey" style={{fontWeight: 'bold', padding: '0 0 4px 0'}}>
                <a href={`/course/${course.id}`} className="w3-hover-text-blue" style={{textDecoration: 'none'}}>
                  {course.title}
                </a>
              </div>
              <div className="w3-small w3-text-dark-grey" style={{fontStyle: 'italic', padding: '0 0 8px 0'}}> {course.snippet} </div>
              <div>
                <span className="w3-text-grey"> Develop Skills: </span>
                <br />
                {
                  course.skills.map(skill => (
                    <span key={skill} > <span className="w3-tag w3-round w3-left-align w3-green" style={{margin: '4px 0'}}> {skill} </span> {'\u00A0'} </span>
                    // <span key={skill} > <span className="w3-text-green" style={{margin: '4px 0', fontWeight: 'bold'}}> {skill} </span> {'\u00A0'} </span>
                  ))
                }
                <br />
              </div>
              <hr style={{margin: '8px 0'}} />
              <div>
                <span className="w3-text-grey"> Required for Certificates: </span>
                <br />
                {
                  course.certs.map(cert => (
                    // <span key={cert} > <span className="w3-tag w3-teal" style={{margin: '4px 0'}}> {cert} </span> {'\u00A0'} </span>
                    <span key={cert} > <span className="w3-text-blue" style={{margin: '4px 0', fontWeight: 'bold', display: 'inline-block'}}> + {cert} </span> {'\u00A0'} </span>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        {/* render course action button */}
        <div className="w3-bar-item w3-hide-medium w3-hide-large" style={{width: '100%'}}>
          <PromoTag course={course} user={user} />
          {' '}
          <a href={`/course/${course.id}`} className="w3-button w3-round w3-blue w3-card-4 w3-right"> View Course </a>
        </div>
        <div className="w3-bar-item w3-right w3-hide-small">
          <a href={`/course/${course.id}`} className="w3-button w3-round w3-blue w3-card-4"> View Course </a>
          <br /> <br />
          <PromoTag course={course} user={user} />
        </div>
      </div>
    )
  }
}

export default class Browse extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const prog = this.props.path.match(/\/.*$/)[0].replace('/','')
    const programs = this.props.programs
    const program = programs.find(program => program.id = prog)
    const courses = this.props.courses.filter( course => course.programs.indexOf(program.id) !== -1 )
    return (
      <div className="w3-container">
        <div>
          <span className="w3-text-blue"> {program.title} </span>
        </div>
        <ul className="w3-ul">
          {
            courses.map( course => {
              return (
                <li key = {course.id} style={{padding: '0 0 8px 0'}}>
                  <LevelBar course = {course} />
                  <CoursePanel course = {course} />
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
