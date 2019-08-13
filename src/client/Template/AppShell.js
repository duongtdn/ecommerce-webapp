"use strict"

import React, { Component } from 'react'

import Navigator from './Widget/Navigator'
import Home from './Page/Home'
import Browse from './Page/Browse'
import Course from './Page/Course'
import Error from './Page/Error'

import Cart from './Page/Cart'

const routes = {
  home: Home,
  browse: Browse,
  course: Course,
  cart: Cart,
  error: Error
}

const popups = {
}

class AppShell extends Component {
  constructor(props) {
    super(props)
    const path = this.props.path|| 'home'
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
                    programs = {this.props.programs}
                    courses = {this.props.courses}
                    path = {this.props.path}
                    popups = {popups}
                    activePopup = {this.state.activePopup}
                    showPopup = {popup => this.setState({ activePopup: popup })}
                    hidePopup = { _ => this.setState({ activePopup: undefined })}
        />
      </div>
    )
  }
  navigate(route) {
    // this.props.href && setTimeout( _ => this.props.href.set(`/${route}`), 0)
    this.setState({activeRoute: route || 'error'})
  }
}

import { UserProvider } from 'react-user'

export default class extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <UserProvider accountClient = {this.props.accountClient} >
        <AppShell {...this.props} />
      </UserProvider>
    )
  }
}
