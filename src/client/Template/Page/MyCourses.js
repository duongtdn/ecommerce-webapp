"use strict"

import React, { Component } from 'react'

import { xhttp } from 'authenform-utils'

import UnAuthen from './UnAuthen'

import env from '../../script/env'

export default class MyCourses extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    if (!this.props.user) { return ( <UnAuthen {...this.props} />) }
    const enrolls = this.props.me.enrolls // TBD: need to sort by enrollAt
    const orders = this.props.me.orders
    const courses = []
    // extract course from enrolls
    enrolls && enrolls.forEach(enroll => {
      if (courses.find(c => c.id === enroll.courseId)) { return }
      courses.push(this._extractCourse(enroll.courseId, enroll.enrollAt, enroll.order, enroll.status))
    })
    // extract courses from order
    orders && orders.forEach(order => {
      if (/(^deleted$|^expired$)/.test(order.status)) { return }
      order.items.forEach( item => {
        if (item.type === 'course') {
          if (courses.find(c => c.id === item.code)) { return }
          courses.push(this._extractCourse(item.code, order.createdAt, order.number, 'new'))
        } else if (item.type === 'bundle') {
          item.items.forEach( item => {
            if (item.type === 'course') {
              if (courses.find(c => c.id === item.code)) { return }
              courses.push(this._extractCourse(item.code, order.createdAt, order.number, 'new'))
            }
          })
        }
      })
    })
    if (courses.length === 0) { return null }
    return (
      <div className="w3-container">
        <ul className="w3-ul"> {
          courses.sort((a, b)=> b.registeredAt - a.registeredAt).map(course => {
            const d = new Date(parseInt(course.registeredAt))
            const tag = this._generateTag(course)
            return (
              <li key={course.id} className="w3-bar" >
                {/* render in small and medium screen */}
                <div className="w3-hide-large" style={{padding: '8px 0'}}>
                  <div className="" style={{fontWeight: 'bold', margin: '6px 0'}} >
                    {tag} <br />
                    <a className="cursor-pointer w3-hover-text-blue" style={{textDecoration: 'none'}} href={`/course/${course.id}`}>
                      {course.title}
                      <span style={{fontWeight: 'normal', fontStyle:'italic'}} > ({course.level}) </span>
                    </a>
                  </div>
                  <span className="w3-small w3-text-grey"> {course.snippet} </span>
                  <p className="w3-small w3-text-grey italic" > Registered on: {`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`} </p>
                  <div className="w3-right" style={{textAlign:'center', margin: '8px 0'}}>
                    <button className="w3-button w3-border w3-text-blue" style={{fontWeight:'bold'}} onClick={() => this.onClickStudyNowBtn(course)}>
                      Study Now
                    </button>
                  </div>
                </div>
                {/* render in large screen */}
                <div className="w3-bar-item w3-hide-small w3-hide-medium">
                  <div className="" style={{fontWeight: 'bold', margin: '6px 0'}} >
                    {tag} <br />
                    <a className="cursor-pointer w3-hover-text-blue" style={{textDecoration: 'none'}} href={`/course/${course.id}`}>
                      {course.title}
                      <span style={{fontWeight: 'normal', fontStyle:'italic'}} > ({course.level}) </span>
                    </a>
                  </div>
                  <span className="w3-small w3-text-grey"> {course.snippet} </span>
                  <p className="w3-small w3-text-grey italic" > Registered on: {`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`} </p>
                </div>
                <div className="w3-bar-item w3-right w3-hide-small w3-hide-medium" style={{textAlign:'center', paddingTop: '36px'}}>
                  <button className="w3-button w3-border w3-text-blue" style={{fontWeight:'bold'}} onClick={() => this.onClickStudyNowBtn(course)}>
                    Study Now
                  </button>
                </div>
              </li>
            )
          })
        }</ul>
      </div>
    )
  }
  onClickStudyNowBtn(course) {
    switch (course.status){
      case 'new':
        // show popup course is not activated yet
        this.props.showPopup('info', {message: 'This course is not activated yet', closeBtn: true})
        break
      case 'active':
        xhttp.put(`/me/enroll/`, {courseId: course.id, status: 'studying' }, {authen: true})
      case 'studying':
      case 'completed':
        window.open(`${env.elearn}/${course.id}`)
        break
      default:
        break
    }
  }
  _generateTag(e) {
    let tag = null;
    switch (e.status) {
      case 'new':
        tag = <span className="w3-tag w3-small w3-blue-grey" style={{fontWeight: 'normal'}}> Pending </span>
        break
      case 'completed':
        tag = <span className="w3-tag w3-small w3-green" style={{fontWeight: 'normal'}}> Completed </span>
        break
      case 'active':
        tag = <span className="w3-tag w3-small w3-yellow" style={{fontWeight: 'normal'}}> Active </span>
        break
      case 'studying':
        tag = <span className="w3-tag w3-small w3-blue" style={{fontWeight: 'normal'}}> Studying </span>
        break
    }
    return tag
  }
  _extractCourse(id, createdAt, order, status) {
    const course = this.props.courses.find(course => course.id === id)
    if (!course) { /* TBD: course is not loaded to client yet */ }
    return {
      id: course.id,
      title: course.title,
      snippet: course.snippet,
      level: course.level,
      registeredAt: createdAt,
      order,
      status
    }
  }
}
