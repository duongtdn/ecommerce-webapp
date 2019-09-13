"use strict"

import React, { Component } from 'react'

class UserWidget extends Component {
  constructor(props) {
    super(props)
    this.state = { showUserDropdown : false }
    this.signin = this.signin.bind(this)
    this.signout = this.signout.bind(this)
  }
  render() {
    const user = this.props.user
    if (user) {
      const avata = this._getUserAvata()
      return (
        <div style={{margin: 'auto', textAlign: 'center'}}>
          <img  src={avata}
                className="w3-image w3-round "
                width={60} height={60}
                alt="user picture"
          />
          <p className=""> {user.profile.displayName || user.profile.fullName} </p>
          <button className="w3-button w3-small w3-blue" onClick={this.signout}> Sign out </button>
        </div>
      )
    } else {
      return (
        <div className="" style={{margin: 'auto', textAlign: 'center'}}>
          <p > <i className="fas fa-user w3-text-grey w3-opacity w3-xxxlarge" /> </p>
          <button className="w3-button w3-small w3-blue" onClick={this.signin}> Login | New Account </button>
        </div>
      )
    }
  }
  _getUserAvata() {
    const user = this.props.user
    if (user.profile.picture) { return user.profile.picture }
    if (user.profile.gender === 'female') {
      return this.props.env.template.avata.female
    } else {
      return this.props.env.template.avata.male
    }
  }
  signin(e) {
    this.props.sidebar(false)
    this.props.accountClient.signin()
  }
  signout(e) {
    this.props.accountClient.signout()
  }
}

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const style = {width: this.props.sidebarWidth, top: 0, zIndex: 99, display: this.props.show? 'block' : 'none'}
    const user = this.props.user
    return (
      <div className="w3-sidebar w3-bar-block w3-border-right w3-border-grey w3-hide-large" style={style}>

        {/* close button */}
        <span className="w3-button w3-xlarge" style={{position: 'fixed', left: this.props.sidebarWidth}} onClick={e => this.props.sidebar(false)}>
          <i className="fa fa-bars" />
        </span>

        {/* user widget */}
        <div className="w3-bar-item w3-border-bottom" style={{ padding: '8px 2px', margin: '8px 4px' }}>
            <UserWidget {...this.props} />
        </div>

        <span className="w3-bar-item w3-button">Link 1</span>
      </div>
    )
  }
}
