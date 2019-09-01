"use strict"

import React, { Component } from 'react'

import Navigator from './Widget/Navigator'
import Home from './Page/Home'
import Browse from './Page/Browse'
import Course from './Page/Course'
import Error from './Page/Error'
import Order from './Page/Order'

import SmallPopup from './Popup/Small'

const routes = {
  home: Home,
  browse: Browse,
  course: Course,
  order: Order,
  error: Error
}

const popups = {
  small: SmallPopup
}

class AppShell extends Component {
  constructor(props) {
    super(props)
    const path = this.props.path || 'home'
    this.state = {
      activeRoute: path.split('/')[0]
    }
  }
  componentDidMount() {
    this.props.href && this.props.href.on('popState', e => this.props.href.set(`/${this.props.href.getPathName()}`) )
  }
  render() {
    return (
      <div>
        <Navigator  routes = {routes}
                    activeRoute = {this.state.activeRoute}
                    navigate = {route => this.navigate(route)}
                    fallbackRoute = 'error'
                    popups = {popups}
                    activePopup = {this.state.activePopup}
                    popupArgs = {this.state.popupArgs}
                    showPopup = { (popup, args) => this.setState({ activePopup: popup, popupArgs: args })}
                    hidePopup = { _ => this.setState({ activePopup: undefined })}
                    {...this.props}
        />
      </div>
    )
  }
  navigate(route) {
    this.props.href && this.props.href.history().pushState({},'',`/${route}`)
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
