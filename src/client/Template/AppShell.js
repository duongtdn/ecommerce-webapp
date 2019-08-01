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

const programs = [
  {
    id: 'emb',
    title: 'Embedded Programming',
    courses: [
      'c-01', 'c-02'
    ]
  }
]

const courses = [
  {
    id: 'c-01',
    title: 'Beginning Embedded C Programming',
    snippet: 'C Programming for beginner, good for one who want to learn about C and Embedded Programming',
    description: 'c01.json',
    thumbnail: 'https://cdn-images-1.medium.com/max/1200/1*z8cxJptPtl2JEERdYXChkQ.png',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/tpIctyqH29Q"
    },
    level: 'Beginner',
    price: 499,
    skills: [
      'C Programming'
    ],
    certs: [
      'Embedded C Programmer'
    ],
    promo: [
      {type: 'sale', deduction: 100, description: 'on sale program', expireIn: '1564444799000'} // expired = (new Date(Date.UTC(2019,7,1,23,59,59))).getTime()
    ],
    programs: ['emb'],
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
    title: 'Applied C for Embedded ARM System',
    snippet: 'Advanced C Programming, ARM embedded processor and with pratice on famous STM32 series',
    description: 'c02.json',
    thumbnail: 'https://harmonyed.com/wp-content/uploads/Online-Courses-1-300x20031.png',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/tpIctyqH29Q"
    },
    price: 799,
    level: 'Intermidate',
    skills: [
      'C Programming', 'ARM Programming'
    ],
    certs: [
      'Embedded Programming Engineer'
    ],
    promo: [
      {type: 'sale', deduction: 100, description: 'on sale program'},
      {type: 'gift', description: '+ 1 board STM32 Discovery F0'}
    ],
    programs: ['emb'],
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
  },
  {
    id: 'c-03',
    title: 'Applied C for Embedded Programming in Detail',
    snippet: 'Advanced C Programming, ARM embedded processor and with pratice on famous STM32 series',
    description: 'c02.json',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ4MSngvOcZcc_xlli8B0AuwMJCHIChtTtjt0wPTdwS-Tc8Xsi',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/tpIctyqH29Q"
    },
    price: 799,
    level: 'Advanced',
    skills: [
      'C Programming', 'ARM Programming'
    ],
    certs: [
      'Embedded Programming Engineer'
    ],
    promo: [
      
    ],
    programs: ['emb'],
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

class AppShell extends Component {
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
                    programs = {programs}
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

import AccountClient from 'account-realm-client'
import { UserProvider } from 'react-user'

import _c_env from '../script/env'

const env = window && window._s_env ? _s_env : _c_env
const acc = new AccountClient({
  realm: env.realm,
  app: env.app,
  baseurl: env.urlAccount
})
acc.sso( (status, user) => {
  console.log(`SSO finished with status code: ${status}`)
  console.log(user)
})

export default class extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <UserProvider accountClient = {acc} >
        <AppShell env = {env} />
      </UserProvider>
    )
  }
}