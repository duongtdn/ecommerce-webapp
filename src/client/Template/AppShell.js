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
        />
      </div>
    )
  }
  navigate(route) {
    setTimeout( _ => href.set(`#${route}`), 0)
    this.setState({activeRoute: route || 'home'})
  }
}
