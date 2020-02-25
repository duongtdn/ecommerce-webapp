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
        <div className="w3-hide-large">
          <Sidebar  sidebarWidth = '35%' sidebarMinWidth = '223px'
                    sidebar = {this.setSidebarDisplay}
                    show = {this.state.showSidebar}
                    {...this.props}
          />
        </div>
        <div >
          <Header {...this.props}
                  isScrollTop = {this.state.isScrollTop}
                  sidebar = {this.setSidebarDisplay}
          />
          <div className="w3-hide-small w3-hide-medium" style={{maxWidth: '1140px', margin: 'auto'}}>
            <Sidebar  sidebarWidth = '250px' marginTop = '96px'
                      sidebar = {this.setSidebarDisplay}
                      show = {true}
                      {...this.props}
            />
          </div>
          <div className="w3-cell-row" style={{maxWidth: '1140px', minHeight: '700px', margin: '96px auto'}} >
            <div className="w3-cell w3-hide-small w3-hide-medium" style={{width: '250px'}} />
            <div className="w3-cell">
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
                    { React.createElement( Comp, { ...this.props, page, sidebar: this.setSidebarDisplay }) }
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
                    { React.createElement(content, { ...this.props, sidebar: this.setSidebarDisplay }) }
                  </div>
                )
              })
            }
            </div>
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
