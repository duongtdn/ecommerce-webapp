"use strict"

import React, { Component } from 'react'

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const style = {width: this.props.sidebarWidth, top: 0, zIndex: 99, display: this.props.show? 'block' : 'none'}
    return (
      <div className="w3-sidebar w3-bar-block w3-border-right w3-border-grey w3-hide-large" style={style}>
        <span className="w3-button w3-xlarge" style={{position: 'fixed', left: this.props.sidebarWidth}} onClick={e => this.props.sidebar(false)}>
          <i className="fa fa-bars" />
        </span>
        <span className="w3-bar-item w3-button">Link 1</span>
      </div>
    )
  }
}
