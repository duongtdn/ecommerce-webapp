"use strict"

import React, { Component } from 'react'

import Logo from './Logo'

class UserSnipet extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const user = this.props.user
    const avata = this._getUserAvata()
    return (
      <div className="w3-bar-item w3-dropdown-hover w3-white w3-hover-pale-green" style={{margin: '4px 0', padding: '3px 16px', cursor: 'pointer'}}>
        <span >
          <img className="w3-circle w3-border w3-border-white"style={{width: '35px'}} src={avata} />
          {' '}
          <span className="w3-text-blue-grey" style={{marginRight: '4px'}}>{user.profile.displayName}</span>
          {' '}
          <i className="w3-text-dark-grey fa fa-ellipsis-v" />
        </span>
        <div className={` w3-dropdown-content w3-bar-block w3-border`} style={{margin: '3px 0px 3px -16px', minWidth: '131px'}}>
          <button className="w3-bar-item w3-button" onClick={evt => this.props.accountClient.signout()}> Logout </button>
        </div>
      </div>
    )
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
}

class LoginButton extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="w3-bar-item w3-button">
        <span className="w3-text-grey">
          <i className="fas fa-user" /> <span className="w3-hide-small" style={{marginLeft: '4px'}}>Sign In</span>
        </span>
      </div>
    )
  }
}

class ShoppingCart extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <a className="w3-bar-item w3-button w3-hover-none" style={{position: 'relative', margin: '0 8px'}}>
        <i className="fas fa-shopping-cart w3-text-light-blue" />
        <label className="w3-small w3-circle w3-red"
               style={{display: 'inline-block', width: '20px', height: '20px', position: 'absolute', top: '6px', left: '32px'}}
        >
          2
        </label>
      </a>
    )
  }
}

export default class Header extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <header className={`w3-bar w3-top w3-white ${!this.props.isScrollTop?'w3-card':''}`} style={{margin: '0 0 32px 0'}}>

        {/* render in large screen */}
        <div className="w3-hide-small w3-hide-medium">
          <a className="w3-bar-item w3-button w3-hover-none"><Logo /></a>
          <div className="w3-bar-item w3-right" style={{padding: '8px'}}>
            <div className="w3-large w3-text-grey w3-border-right" style={{display: 'inline-block', padding: '0 8px', verticalAlign: 'bottom'}}>
              <span className="w3-button"> Programs <i className="fa fa-caret-down" /> </span>
              <span className="w3-button"> Management <i className="fa fa-caret-down" /> </span>
            </div>
            <div className="w3-large" style={{display: 'inline-block', verticalAlign: 'bottom'}}>
              <ShoppingCart />
              {
                this.props.user?
                  <UserSnipet user={this.props.user}
                              accountClient={this.props.accountClient}
                              env = {this.props.env}
                  />
                :
                  <LoginButton />
              }
            </div>
          </div>
        </div>

        {/* render in small and medium screen */}
        <div className="w3-hide-large">
          <span className="w3-bar-item w3-button w3-xlarge" style={{marginRight: '24px'}}><i className="fa fa-bars" /></span>
          <a className="w3-bar-item w3-button w3-hover-none"><Logo /></a>
          <div className="w3-right w3-xlarge">
            <ShoppingCart />
          </div>

        </div>

      </header>
    )
  }
}
