"use strict"

import React, { Component } from 'react'

export default class Browse extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const categories = this._makeCategoriesListFromCourses()
    return (
      <div className="w3-container">
        {
          categories.map( category => {
            const courses = this.props.courses.filter( course => course.categories.indexOf(category) !== -1 )
            return (
              <div key = {category} className = "">
                <div> <b>{category}</b> </div>
                <div>
                  {
                    courses.map( course => {
                      return (
                        <div key = {course.id}>
                          {course.title}
                        </div>
                      )
                    })
                  }
                  <hr />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
  _makeCategoriesListFromCourses() {
    const courses = this.props.courses
    const categories = []
    courses.forEach( course => {
      course.categories.forEach( category => {
        if (categories.indexOf(category) === -1) {
          categories.push(category)
        }
      })
    })
    return categories
  }
}
