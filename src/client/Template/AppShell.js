"use strict"

import React, { Component } from 'react'

import Navigator from './Widget/Navigator'
import Home from './Page/Home'
import Browse from './Page/Browse'
import Course from './Page/Course'
import Error from './Page/Error'

import href from '../lib/href'

const routes = {
  home: Home,
  browse: Browse,
  course: Course,
  error: Error
}

const courses = [
  {
    id: 'c-01',
    title: 'Basic C Programming for Embedded System',
    snippet: 'C Programming for beginner, good for one who want to learn about C and Embedded Programming',
    description: 'c01.json',
    price: 499,
    promotion: [

    ],
    categories: ['Embedded Programming'],
    tests: [
      {
        title: 'Mid-term Exam',
        description: 'Mid-term Test for course Embedded - 01',
        exam: 'c-01-m'
      },
      {
        title: 'Final Exam',
        description: 'Final Test for course Embedded - 01',
        exam: 'c-01-f'
      }
    ]
  },
  {
    id: 'c-02',
    title: 'Advanced C Programming for Embedded System',
    snippet: 'Advanced C Programming, ARM embedded processor and with pratice on famous STM32 series',
    description: 'c02.json',
    price: 799,
    promotion: [
      
    ],
    categories: ['Embedded Programming', 'ARM Programming'],
    tests: [
      {
        title: 'Mid-term Exam',
        description: 'Mid-term Test for course Embedded - 01',
        exam: 'c-02-m'
      },
      {
        title: 'Final Exam',
        description: 'Final Test for course Embedded - 01',
        exam: 'c-02-f'
      }
    ]
  }
]

export default class AppShell extends Component {
  constructor(props) {
    super(props)
    const path = href.getPathName() || 'home'
    this.state = {
      activeRoute: path.split('/')[0]
    }

  }
  render() {
    return (
      <div>
        <Navigator  user = {this.props.user}
                    accountClient = {this.props.accountClient}
                    env = {this.props.env}
                    routes = {routes}
                    activeRoute = {this.state.activeRoute}
                    navigate = {route => this.navigate(route)}
                    fallbackRoute = 'error'
                    courses = {courses}
        />
      </div>
    )
  }
  navigate(route) {
    setTimeout( _ => href.set(`#${route}`), 0)
    this.setState({activeRoute: route || 'home'})
  }
}
