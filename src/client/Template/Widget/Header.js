"use strict"

import React, { Component } from 'react'

import Logo from './Logo'
import storage from '../../lib/storage'

class UserSnipet extends Component {
  constructor(props) {
    super(props)
    this.state = { showUserDropdown : false }
    this.signout = this.signout.bind(this)
  }
  render() {
    const user = this.props.user
    const avata = this._getUserAvata()
    return (
      <div className="w3-bar-item" style={{margin: '4px 0', padding: '3px 16px', cursor: 'pointer'}}>
        <div className="w3-white" onClick={e => this.setState({showUserDropdown:!this.state.showUserDropdown})}>
          <img className="w3-circle w3-border w3-border-white"style={{width: '35px'}} src={avata} />
          {' '}
          <span className="w3-text-blue-grey" style={{marginRight: '4px'}}>{user.profile.displayName}</span>
          {' '}
          <i className="w3-text-dark-grey fa fa-ellipsis-v" />
        </div>
        <div className={`${this.state.showUserDropdown? 'w3-bar-block' : 'w3-hide'}`} style={{padding: '16px 0'}}>
          <button className="w3-bar-item w3-button" onClick={this.signout}> Logout </button>
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
  signout(e) {
    this.props.accountClient.signout()
    this.setState({ showUserDropdown: false })
  }
}

class LoginButton extends Component {
  constructor(props) {
    super(props)
    this.signin = this.signin.bind(this)
  }
  render() {
    return (
      <div className="w3-bar-item w3-button">
        <span className="w3-text-grey" onClick={this.signin}>
          <i className="fas fa-user" /> <span className="w3-hide-small" style={{marginLeft: '4px'}} >Sign In</span>
        </span>
      </div>
    )
  }
  signin() {
    this.props.accountClient.signin()
  }
}

class ShoppingCart extends Component {
  constructor(props) {
    super(props)
    this.state = { itemCount: (storage.get(storage.key.CART) && storage.get(storage.key.CART).length) || 0 }
  }
  componentDidMount() {
    this._observer = storage.observe(storage.key.CART, cart => this.setState({ itemCount: cart.length }))
  }
  componentWillUnmount() {
    storage.observe(storage.key.CART, this._observer, false)
  }
  render() {
    return (
      <a className="w3-bar-item w3-button w3-hover-none" style={{position: 'relative', margin: '0 8px'}}>
        <i className={`fas fa-shopping-cart ${this.state.itemCount > 0 ? 'w3-text-blue' : 'w3-text-light-blue'}`} />
        {
          this.state.itemCount > 0 ?
            <label  className="w3-small w3-circle w3-red"
                    style={{display: 'inline-block', width: '20px', height: '20px', position: 'absolute', top: '6px', left: '32px'}}
            >
              {this.state.itemCount}
            </label>
          : null
        }
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
      <header className={`w3-bar w3-top w3-white ${!this.props.isScrollTop?'w3-card':'w3-border-bottom'}`} style={{margin: '0 0 32px 0'}}>

        {/* render in large screen */}
        <div className="w3-hide-small w3-hide-medium">
          <a className="w3-bar-item w3-button w3-hover-none"><Logo /></a>

          <div className="w3-bar-item w3-right" style={{padding: '8px'}}>
            <div className="w3-large" style={{display: 'inline-block', verticalAlign: 'bottom'}}>
              <ShoppingCart />
              {
                this.props.user?
                  <UserSnipet user={this.props.user}
                              accountClient={this.props.accountClient}
                              env = {this.props.env}
                  />
                :
                  <LoginButton accountClient={this.props.accountClient} />
              }
            </div>
          </div>

          <div className="w3-bar-item w3-right" style={{padding: '8px'}}>
            <div className="w3-large w3-text-grey w3-border-right" style={{display: 'inline-block', padding: '0 8px', verticalAlign: 'bottom'}}>
              <span className="w3-button"> Programs <i className="fa fa-caret-down" /> </span>
              <span className="w3-button"> Management <i className="fa fa-caret-down" /> </span>
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
