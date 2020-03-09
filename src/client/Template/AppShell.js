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
import MyRewards from './Page/MyRewards'

import Info from './Popup/Info'
import YesNo from './Popup/YesNo'
import Login from './Popup/Login'
import CoursesActivation from './Popup/CoursesActivation'

import xhttp from '@realmjs/xhttp-request'

import {IntlProvider} from 'react-intl'
import messages_vi from '../../translation/vi.json'
// import messages_en from '../../translation/en.json'

const routes = {
  home: Home,
  browse: Browse,
  course: Course,
  order: Order,
  error: Error,
  mycourses: MyCourses,
  myorders: MyOrders,
  myrewards: MyRewards,
}

const popups = {
  info: Info,
  yesno: YesNo,
  login: Login,
  activation: CoursesActivation
}

const messages = {
  vi: messages_vi,
  // en: messages_en
}

const language = 'vi'

class AppShell extends Component {
  constructor(props) {
    super(props)
    const path = this.props.path || 'home'
    this.state = {
      activeRoute: path.split('/')[0],
      me: { orders: [], enrolls: [], rewards: [] },
      isLoadingMe: false
    }
    this.onOrderCreated = this.onOrderCreated.bind(this)
    this.onOrderDeleted = this.onOrderDeleted.bind(this)
    this.onEnrollCreated = this.onEnrollCreated.bind(this)
    /* fetch /user to get user orders, enrolls and rewards */
    this.props.accountClient && this.props.accountClient.on('authenticated', user => {
      this.setState({ isLoadingMe: true })
      xhttp.get(`/me`, {authen: true})
      .then( ({status, responseText}) => {
        const isLoadingMe = false
        if (status === 200) {
          const data = JSON.parse(responseText)
          const me = { ...data }
          console.log(me)
          this.setState({ me, isLoadingMe })
          // clean up expired rewards
          const expired = me.rewards.map(reward => isExpire(reward.expireIn) && reward.code).filter(r => r)
          expired && expired.length > 0 && this.cleanExpiredRewards(expired)
        } else {
          this.setState({ isLoadingMe })
          console.log(`fetching /user failed: return code ${status}`)
        }
      })
    })
    /* clean user-cache to signed out
       for now, hard-coded cache name (user-cache)
    */
    this.props.accountClient && this.props.accountClient.on('unauthenticated', user => {
      const me = { orders: [], enrolls: [], rewards: [] }
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
      <IntlProvider locale={language} messages={messages[language]}>
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
                    isLoadingMe = {this.state.isLoadingMe}
                    onOrderCreated = {this.onOrderCreated}
                    onOrderDeleted = {this.onOrderDeleted}
                    onEnrollCreated = {this.onEnrollCreated}
                    pages = {this.pages}
        />
      </IntlProvider>
    )
  }
  navigate(route) {
    this.props.href && this.props.href.history().pushState({},'',`/${route}`)
    const activeRoute = route.split('/')[0]
    this.pages.events[activeRoute] && this.pages.events[activeRoute].onEnter && this.pages.events[activeRoute].onEnter()
    this.setState({activeRoute: activeRoute || 'error'})
    window.scrollTo({ top: 0 })
  }
  onOrderCreated(order) {
    const me = {...this.state.me}
    const orders = [...me.orders.filter(_order => _order.number !== order.number)]
    orders.unshift(order)
    me.orders = orders
    this.setState({ me })
  }
  onOrderDeleted(createdAt) {
    const me = {...this.state.me}
    const orders = [...me.orders.map(_order => {
      if (_order.createdAt === createdAt) {
        _order.status = 'deleted'
      }
      return _order
    })]
    me.orders = orders
    this.setState({ me })
  }
  onEnrollCreated(enrolls) {
    if (!enrolls || enrolls.length === 0) { return }
    const me = {...this.state.me}
    // update enroll
    const _enrolls = [...me.enrolls.filter(_enroll => !enrolls.find(e => e.courseId === _enroll.courseId))]
    _enrolls.push(...enrolls)
    // update order
    const _number = _enrolls.map(e => e.order.number)
    const _orders = me.orders.map(order => {
      if (_number.indexOf(order.number) === -1) {
        return {...order}
      } else {
        const _order = {...order}
        _order.status = 'fulfill'
        return _order
      }
    })
    me.enrolls = _enrolls
    me.orders = _orders
    this.setState({ me })
  }
  showPopup(popup, args) {
    return new Promise( (resolve, reject) => {
      this.setState({ activePopup: popup, popupArgs: {...args, resolve, reject} })
    })
  }
  cleanExpiredRewards(rewards) {
    xhttp.delete('/me/reward', { rewards }, { authen: true })
    .then( ({status}) => console.log('Clean expired rewards: ' + status))
    .catch(err => console.lo (err))
  }
}

import { UserProvider } from '@realmjs/react-user'

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

function isExpire(timestamp) {
  if (!timestamp) {
    return false
  }
  const now = (new Date()).getTime()
  return (parseInt(now) > parseInt(timestamp))
}
