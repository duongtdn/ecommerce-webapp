"use strict"

import React, { Component } from 'react'

import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

export default class Navigator extends Component {
  constructor(props) {
    super(props)
    this.state = { isScrollTop: true, showSidebar: false }
    this.routes =[]
    this.popups = []
    this.handleScroll = this.handleScroll.bind(this)
    this.setSidebarDisplay = this.setSidebarDisplay.bind(this)
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  render() {
    const activeRoute = this.props.routes[this.props.activeRoute] ? this.props.activeRoute : 'error'
    if (this.routes.indexOf(activeRoute) === -1) { this.routes.push(activeRoute)}

    const activePopup = this.props.activePopup
    if (activePopup && this.popups.indexOf(activePopup) === -1) { this.popups.push(activePopup)}
    return (
      <div className="" >
        <Sidebar  sidebarWidth = '35%' sidebarMinWidth = '223px'
                  sidebar = {this.setSidebarDisplay}
                  show = {this.state.showSidebar}
                  {...this.props}
        />
        <div >
          <Header {...this.props}
                  isScrollTop = {this.state.isScrollTop}
                  sidebar = {this.setSidebarDisplay}
          />
          <div style={{marginTop: '96px'}} >
          {
            this.routes.map(route => {
              const Comp = this.props.routes[route]
              const display = activeRoute === route ? 'block' : 'none'
              const page = {
                on: (event, handler) => {
                  this.props.pages.events[route][`on${capitalize(event)}`] = handler
                }
              }
              return (
                <div key={route} style={{ display }} >
                  { React.createElement( Comp, { ...this.props, page }) }
                </div>
              )
            })
          }
          {
            this.popups.map(popup => {
              const content = this.props.popups[popup]
              const display = activePopup === popup ? 'block' : 'none'
              return (
                <div key = {popup} style= {{ display }} className = "w3-modal">
                  { React.createElement(content, { ...this.props }) }
                </div>
              )
            })
          }
          </div>
          <Footer />
        </div>
      </div>
    )
  }
  handleScroll() {
    if (window.pageYOffset > 0) {
      this.state.isScrollTop && this.setState({ isScrollTop : false })
    } else {
      !this.state.isScrollTop && this.setState({ isScrollTop : true })
    }
  }
  setSidebarDisplay(show) {
    this.setState({ showSidebar: show })
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
