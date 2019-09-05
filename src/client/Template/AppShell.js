"use strict"

import React, { Component } from 'react'

import Navigator from './Widget/Navigator'
import Home from './Page/Home'
import Browse from './Page/Browse'
import Course from './Page/Course'
import Error from './Page/Error'
import Order from './Page/Order'

import Info from './Popup/Info'

import { xhttp } from 'authenform-utils'
import env from '../script/env'

const routes = {
  home: Home,
  browse: Browse,
  course: Course,
  order: Order,
  error: Error
}

const popups = {
  info: Info
}

class AppShell extends Component {
  constructor(props) {
    super(props)
    const path = this.props.path || 'home'
    this.state = {
      activeRoute: path.split('/')[0]
    }
    /* fetch /user to get user orders, enrolls and vouchers */
    this.props.accountClient && this.props.accountClient.on('authenticated', user => {
      const urlBasePath = env.urlBasePath
      xhttp.get(`${urlBasePath}/user`, {authen: false}, (status, responseText) => {
        if (status === 200) {
          const data = JSON.parse(responseText)
          console.log(data)
        } else {

        }
      })
    })
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
