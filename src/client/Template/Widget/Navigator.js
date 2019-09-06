"use strict"

import React, { Component } from 'react'

import Header from './Header'
import Footer from './Footer'

export default class Navigator extends Component {
  constructor(props) {
    super(props)
    this.state = { isScrollTop: true }
    this.routes =[]
    this.popups = []
    this.handleScroll = this.handleScroll.bind(this)
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
        <Header user = {this.props.user}
                accountClient = {this.props.accountClient}
                env = {this.props.env}
                isScrollTop = {this.state.isScrollTop}
        />
        <div style={{marginTop: '96px'}} >
        {
          this.routes.map(route => {
            const page = this.props.routes[route]
            const display = activeRoute === route ? 'block' : 'none'
            return (
              <div key={route} style={{ display }} >
                { React.createElement( page, { ...this.props }) }
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
    )
  }
  handleScroll() {
    if (window.pageYOffset > 0) {
      this.state.isScrollTop && this.setState({ isScrollTop : false })
    } else {
      !this.state.isScrollTop && this.setState({ isScrollTop : true })
    }
  }
}
