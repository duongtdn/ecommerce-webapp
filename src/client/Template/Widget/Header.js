"use strict"

import React, { Component } from 'react'

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
      <div className="w3-bar-item" style={{margin: '4px 0', padding: '3px 16px', cursor: 'pointer'}}>
        <div className="w3-white" onClick={e => this.props.toggleDropdown()}>
          <img className="w3-circle w3-border w3-border-white"style={{width: '35px'}} src={avata} />
          {' '}
          <span className="w3-text-blue-grey" style={{marginRight: '4px'}}>{user.profile.displayName}</span>
          {' '}
          <i className="w3-text-dark-grey fa fa-ellipsis-v" />
        </div>
        <div className={`${this.props.showDropdown? 'w3-bar-block' : 'w3-hide'}`} style={{padding: '16px 0'}}>
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
    this.props.closeDropdown()
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
      <span className="w3-bar-item w3-button w3-hover-none" style={{position: 'relative', margin: '0 8px'}} onClick={e => this.props.navigate('order')}>
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
    this.state = {
      accordions: { program: false, management: false },
      showUserDropdown: false
    }
  }
  render() {
    const programs = this.props.programs
    return (
      <header className={`w3-top w3-white ${!this.props.isScrollTop?'w3-card':'w3-border-bottom'}`} style={{margin: '0 0 32px 0'}}>

        {/* render in large screen */}
        <div className="w3-hide-small w3-hide-medium">
          <div className="w3-bar">
            <a className="w3-bar-item w3-button w3-hover-none"><Logo /></a>

            <div className="w3-bar-item w3-right" style={{padding: '8px'}}>
              <div className="w3-large" style={{display: 'inline-block', verticalAlign: 'bottom'}}>
                <ShoppingCart {...this.props} />
                {
                  this.props.user?
                    <UserSnipet user={this.props.user}
                                accountClient={this.props.accountClient}
                                env = {this.props.env}
                                showDropdown = {this.state.showUserDropdown}
                                toggleDropdown = {this.toggleUserDropdown.bind(this)}
                                closeDropdown = {this.closeUserDropdown.bind(this)}
                    />
                  :
                    <LoginButton accountClient={this.props.accountClient} />
                }
              </div>
            </div>

            <div className="w3-bar-item" style={{padding: '8px', marginLeft: '48px'}}>
              <div className="w3-large w3-text-grey" style={{display: 'inline-block', padding: '0 8px', verticalAlign: 'bottom'}}>
                {/* Programs */}
                <span className={`w3-button ${this.state.accordions['program']?'bottom-bar w3-border-red':''}`}
                      style={{borderBottom: this.state.accordions['program']? '3px solid' : 'none'}}
                      onClick={this.toggleAccordions('program')}
                >
                  Programs <i className={`fa ${this.state.accordions['program']?'fa-caret-up':'fa-caret-down'}`} />
                </span>
                {/* Managerment */}
                {
                  this.props.user?
                    <span className={`w3-button ${this.state.accordions['management']?'bottom-bar w3-border-red':''}`}
                          style={{borderBottom: this.state.accordions['management']? '3px solid' : 'none'}}
                          onClick={this.toggleAccordions('management')}
                    >
                      Management <i className={`fa ${this.state.accordions['management']?'fa-caret-up':'fa-caret-down'}`} />
                    </span>
                  : null
                }
              </div>
            </div>

          </div>

          {/* Programs */}
          <div className="w3-text-grey" style={{padding: '4px', margin: '0 0 16px 150px', display: this.state.accordions['program']? 'block':'none'}}>
            {
              programs.map( program => (
                <a  className="w3-button cursor-pointer w3-hover-none hover-bottom-red" key={program.id}
                    href = {`/browse/${program.id}`} >
                  {program.title}
                </a>
              ))
            }
          </div>

          {/* Management */}
          {
            this.props.user?
              <div className="w3-text-grey" style={{padding: '4px', margin: '0 0 16px 150px', display: this.state.accordions['management']? 'block':'none'}}>
                <span className="w3-bar-item w3-button cursor-pointer w3-hover-none hover-bottom-red" onClick={e => {this.closeAccordions(); this.props.navigate('mycourses')}}>
                    Manage Courses
                </span>
                <span className="w3-bar-item w3-button cursor-pointer w3-hover-none hover-bottom-red" onClick={e => {this.closeAccordions(); this.props.navigate('myorders')}}>
                    Manage Orders
                </span>
              </div>
            : null
          }

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
  toggleAccordions(name) {
    return e => {
      const accordions = {...this.state.accordions}
      for (let key in accordions) {
        accordions[key] = false
      }
      accordions[name] = !this.state.accordions[name]
      this.setState({ accordions, showUserDropdown: false })
    }
  }
  closeAccordions() {
    const accordions = this._createClosedAccorionsState()
    this.setState({ accordions, showUserDropdown: false })
  }
  toggleUserDropdown() {
    const accordions = this._createClosedAccorionsState()
    this.setState({ showUserDropdown: !this.state.showUserDropdown, accordions })
  }
  closeUserDropdown() {
    const accordions = this._createClosedAccorionsState()
    this.setState({ showUserDropdown: false, accordions })
  }
  _createClosedAccorionsState() {
    const accordions = {...this.state.accordions}
    for (let key in accordions) {
      accordions[key] = false
    }
    return accordions
  }
}
