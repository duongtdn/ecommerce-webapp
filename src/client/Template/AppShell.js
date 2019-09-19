"use strict"

import React, { Component } from 'react'

import Navigator from './Widget/Navigator'
import Home from './Page/Home'
import Browse from './Page/Browse'
import Course from './Page/Course'
import Error from './Page/Error'
import Order from './Page/Order'
import MyCourses from './Page/MyCourses'
import MyOrders from './Page/MyOrders'

import Info from './Popup/Info'
import YesNo from './Popup/YesNo'
import Login from './Popup/Login'

import { xhttp } from 'authenform-utils'
import env from '../script/env'

const routes = {
  home: Home,
  browse: Browse,
  course: Course,
  order: Order,
  error: Error,
  mycourses: MyCourses,
  myorders: MyOrders
}

const popups = {
  info: Info,
  yesno: YesNo,
  login: Login
}

class AppShell extends Component {
  constructor(props) {
    super(props)
    const path = this.props.path || 'home'
    this.state = {
      activeRoute: path.split('/')[0],
      me: { orders: [], enrolls: [], vouchers: [] }
    }
    this.onOrderCreated = this.onOrderCreated.bind(this)
    /* fetch /user to get user orders, enrolls and vouchers */
    this.props.accountClient && this.props.accountClient.on('authenticated', user => {
      const urlBasePath = env.urlBasePath
      xhttp.get(`${urlBasePath}/me`, {authen: true}, (status, responseText) => {
        if (status === 200) {
          const data = JSON.parse(responseText)
          const me = { ...data }
          this.setState({ me })
        } else {
          console.log(`fetching /user failed: return code ${status}`)
        }
      })
    })
    /* clean user-cache to signed out
       for now, hard-coded cache name (user-cache)
    */
    this.props.accountClient && this.props.accountClient.on('unauthenticated', user => {
      const me = { orders: [], enrolls: [], vouchers: [] }
      if (caches) {
        caches.open('me-cache').then((cache) => {
          cache.delete('/me').then((response) => {
            this.setState({ me })
          })
        })
      } else {
        this.setState({ me })
      }
    })
    this.showPopup = this.showPopup.bind(this)
    this.pages = { events: {} }
    Object.keys(routes).forEach(route => this.pages.events[route] = {} )
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
                    showPopup = {this.showPopup}
                    hidePopup = { _ => this.setState({ activePopup: undefined })}
                    {...this.props}
                    me = {this.state.me}
                    onOrderCreated = {this.onOrderCreated}
                    pages = {this.pages}
        />
      </div>
    )
  }
  navigate(route) {
    this.props.href && this.props.href.history().pushState({},'',`/${route}`)
    this.pages.events[route] && this.pages.events[route].onEnter && this.pages.events[route].onEnter()
    this.setState({activeRoute: route || 'error'})
  }
  onOrderCreated(order) {
    const me = {...this.state.me}
    const orders = [...me.orders.filter(_order => _order.number !== order.number)]
    orders.push(order)
    me.orders = orders
    this.setState({ me })
  }
  showPopup(popup, args) {
    return new Promise( (resolve, reject) => {
      this.setState({ activePopup: popup, popupArgs: {...args, resolve, reject} })
    })
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
