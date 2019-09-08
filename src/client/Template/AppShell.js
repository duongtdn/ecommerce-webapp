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
      activeRoute: path.split('/')[0],
      orders: []
    }
    this.onOrderCreated = this.onOrderCreated.bind(this)
    /* fetch /user to get user orders, enrolls and vouchers */
    this.props.accountClient && this.props.accountClient.on('authenticated', user => {
      const urlBasePath = env.urlBasePath
      xhttp.get(`${urlBasePath}/user`, {authen: true}, (status, responseText) => {
        if (status === 200) {
          const data = JSON.parse(responseText)
          this.setState({ orders: data.orders, enrolls: data.enrolls })
        } else {
          console.log(`fetching /user failed: return code ${status}`)
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
                    orders = {this.state.orders}
                    enrolls = {this.state.enrolls}
                    onOrderCreated = {this.onOrderCreated}
        />
      </div>
    )
  }
  navigate(route) {
    this.props.href && this.props.href.history().pushState({},'',`/${route}`)
    this.setState({activeRoute: route || 'error'})
  }
  onOrderCreated(order) {
    const orders = [...this.state.orders.filter(_order => _order.number !== order.number)]
    orders.push(order)
    this.setState({ orders })
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
