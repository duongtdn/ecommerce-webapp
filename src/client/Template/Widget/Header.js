"use strict"

import React, { Component } from 'react'
import {FormattedMessage} from 'react-intl'

import Logo from './Logo'
import storage from '../../lib/storage'

class UserSnipet extends Component {
  constructor(props) {
    super(props)
    this.signout = this.signout.bind(this)
  }
  render() {
    const user = this.props.user
    const avata = this._getUserAvata()
    return (
      <div className="w3-bar-item w3-dropdown-hover" style={{margin: '4px 0', padding: '3px 16px', cursor: 'pointer'}}>
        <div className="w3-white">
          <img className="w3-circle w3-border w3-border-white"style={{width: '35px'}} src={avata} />
          {' '}
          <span className="w3-text-blue-grey" style={{marginRight: '4px'}}>{user.profile.displayName}</span>
          {' '}
          <i className="w3-text-dark-grey fa fa-ellipsis-v" />
        </div>
        <div className='w3-dropdown-content w3-bar-block' style={{padding: '4px', right: '4px'}}>
          <button className="w3-bar-item w3-button w3-border w3-green" style={{textAlign: 'center'}} onClick={this.signout}>
            <i className="fas fa-sign-out-alt" style={{marginRight: '4px'}} /> <FormattedMessage id="button.signout" />
          </button>
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
  }
}

class LoginButton extends Component {
  constructor(props) {
    super(props)
    this.signin = this.signin.bind(this)
  }
  render() {
    return (
      <div className="w3-bar-item w3-button w3-hover-pale-blue w3-hover-border-blue w3-border w3-border-white" style={{marginRight: '8px'}}>
        <span className="w3-text-grey" onClick={this.signin}>
          <span className="w3-hide-small" style={{marginLeft: '4px'}} ><FormattedMessage id="button.login" /></span>
        </span>
      </div>
    )
  }
  signin() {
    this.props.accountClient.signin()
  }
}

class SignUpButton extends Component {
  constructor(props) {
    super(props)
    this.signup = this.signup.bind(this)
  }
  render() {
    return (
      <div className="w3-bar-item w3-button w3-text-orange w3-border w3-border-orange w3-hover-pale-red">
        <span onClick={this.signup}>
          <span className="" style={{marginLeft: '4px'}} ><FormattedMessage id="button.signup" /></span>
        </span>
      </div>
    )
  }
  signup() {
    this.props.accountClient.signup()
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
      <span className="w3-large w3-bar-item w3-button w3-hover-none" style={{position: 'relative', margin: '0 8px'}} onClick={e => this.props.navigate('order')}>
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
      </span>
    )
  }
}

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <header className={`w3-top w3-white ${!this.props.isScrollTop?'w3-card':''}`} style={{margin: '0 0 32px 0'}}>

        {/* render in large screen */}
        <div className="w3-hide-small w3-hide-medium" style={{maxWidth: '1140px', margin: 'auto'}}>
          <div className="w3-bar">
            <a className="w3-bar-item w3-button w3-hover-none"><Logo /></a>

            <div className="w3-bar-item w3-right" style={{padding: '8px'}}>
              <div className="" style={{display: 'inline-block', verticalAlign: 'bottom'}}>
                <button className="w3-bar-item w3-button w3-green" style={{marginRight: '68px'}} onClick={e => this.props.showPopup('activation')} >
                  <FormattedMessage id="button.activate_course" />
                </button>
                <div className="w3-bar-item w3-border-left" style={{height: '40px', borderLeftWidth: '2px !important'}} />
                <ShoppingCart {...this.props} />
                {
                  this.props.user?
                    <UserSnipet user={this.props.user}
                                accountClient={this.props.accountClient}
                                env = {this.props.env}
                    />
                  :
                    <span>
                      <LoginButton accountClient={this.props.accountClient} />
                      <SignUpButton accountClient={this.props.accountClient} />
                    </span>
                }
              </div>
            </div>

          </div>

        </div>

        {/* render in small and medium screen */}
        <div className="w3-bar w3-hide-large">
          <span className="w3-bar-item w3-button w3-xlarge" style={{marginRight: '24px'}} onClick={e => this.props.sidebar(true)}>
            <i className="fa fa-bars" />
          </span>
          <a className="w3-bar-item w3-button w3-hover-none"><Logo /></a>
          <div className="w3-right w3-xlarge">
            <ShoppingCart {...this.props} />
          </div>

        </div>

      </header>
    )
  }
}
