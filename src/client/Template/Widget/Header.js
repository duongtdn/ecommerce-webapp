"use strict"

import React, { Component } from 'react'

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
          <i className="fas fa-user w3-large" style={{marginRight: '4px'}} /> <span className="w3-hide-small">Sign-up | Login</span>
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
      <a className="w3-bar-item w3-button w3-hover-none w3-large" style={{position: 'relative', marginRight: '5px'}}>
        <i className="fas fa-shopping-cart w3-text-blue" />
        <label className="w3-small w3-circle w3-red"
               style={{display: 'inline-block', width: '20px', height: '20px', position: 'absolute', top: '6px', left: '32px'}}
        >
          2
        </label>
      </a>
    )
  }
}

class Logo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <a href="#" className="w3-bar-item w3-text-blue" style={{textDecoration: 'none', fontFamily: "'Kaushan Script', cursive", position: 'relative'}}>
        <span className="logo">Studi</span><i className="fas fa-seedling w3-text-green" style={{position: 'absolute', left: '88px', top: '10px'}}/>
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
      <header className="w3-bar " style={{margin: '0 0 16px 0'}}>
        <button className="w3-bar-item w3-button w3-large w3-hide-large"><i className="fa fa-bars" /></button>
        <Logo />
        <div className="w3-right">
          <ShoppingCart />
          {
            this.props.user?
              <UserSnipet user={this.props.user}
                          accountClient={this.props.accountClient}
                          env = {this.props.env}
              />
            :
              <LoginButton
              />
          }
        </div>
      </header>
    )
  }
}
