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
      <div className="w3-bar-item">
        <button className="w3-button w3-text-orange"> Sign up </button>
        <button className="w3-button w3-text-blue"> Login </button>
      </div>
    )
  }
}

export default class Header extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <header className="w3-bar">
        <a href="#" className="w3-button w3-bar-item w3-text-blue w3-large" style={{textDecoration: 'none', fontFamily: "'Pacifico', cursive"}}>
          Studi<span className="w3-text-dark-grey">na</span>
        </a>
        <div className="w3-right">
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
