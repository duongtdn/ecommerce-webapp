"use strict"

import React, { Component } from 'react'

import Header from './Header'

export default class Navigator extends Component {
  constructor(props) {
    super(props)
    this.routes =[]
  }
  render() {
    const activeRoute = this.props.routes[this.props.activeRoute] ? this.props.activeRoute : 'error'
    if (this.routes.indexOf(activeRoute) === -1) { this.routes.push(activeRoute)}
    return (
      <div className="" >
        <Header user = {this.props.user}
                accountClient = {this.props.accountClient}
                env = {this.props.env}
        />
        <div>{
          this.routes.map(route => {
            const page = this.props.routes[route]
            const display = activeRoute === route ? 'block' : 'none'
            return (
              <div key={route} style={{ display }} >
                { React.createElement( page, { ...this.props }) }
              </div>
            )
          })
        }</div>
      </div>
    )
  }
}
