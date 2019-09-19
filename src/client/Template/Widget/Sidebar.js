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
    this.state = {
      accordions: { program: true, management: true },
      width: 0
    }
    this.ref = React.createRef()
    this.updateStateWidth = this.updateStateWidth.bind(this)
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateStateWidth)
  }
  componentWillUnmount() {
      window.removeEventListener("resize", this.updateStateWidth)
  }
  componentDidUpdate() {
    this.updateStateWidth()
  }
  render() {
    const style = {width: this.props.sidebarWidth, minWidth: this.props.sidebarMinWidth, top: 0, zIndex: 99}
    const programs = this.props.programs
    return (
      <div className="w3-modal w3-hide-large" style={{display: this.props.show? 'block' : 'none'}} onClick={e => this.props.sidebar(false)}>
        <div ref={this.ref} className="w3-sidebar w3-bar-block w3-border-right w3-border-grey" style={style} onClick={e => e.stopPropagation()}>

          {/* close button */}
          <span className="w3-button w3-xlarge" style={{position: 'fixed', left: `${this.state.width}px`, background: 'none'}} onClick={e => this.props.sidebar(false)}>
            <i className="fa fa-bars" />
          </span>

          {/* user widget */}
          <div className="w3-bar-item w3-border-bottom" style={{ padding: '8px 2px', margin: '8px 0 16px 0' }}>
              <UserWidget {...this.props} />
          </div>

          {/* Programs */}
          <span className="w3-bar-item w3-button w3-border-bottom w3-border-grey" onClick={this.toggleAccordions('program')}>
            Programs { this.state.accordions['program']? <i className="fa fa-caret-up w3-right" /> : <i className="fa fa-caret-down w3-right" /> }
          </span>
          <div className="w3-text-grey" style={{padding: '4px', marginBottom: '16px', display: this.state.accordions['program']? 'block':'none'}}>
            {
              programs.map( program => (
                <a  className="w3-bar-item w3-button cursor-pointer" key={program.id}
                    href = {`/browse/${program.id}`} >
                  {program.title}
                </a>
              ))
            }
          </div>

          {/* Management */}
          {
            this.props.user?
            <div>
              <span className="w3-bar-item w3-button w3-border-bottom w3-border-grey" onClick={this.toggleAccordions('management')}>
                Management { this.state.accordions['management']? <i className="fa fa-caret-up w3-right" /> : <i className="fa fa-caret-down w3-right" /> }
              </span>
              <div className="w3-text-grey" style={{padding: '4px', marginBottom: '16px', display: this.state.accordions['management']? 'block':'none'}}>
                <span className="w3-bar-item w3-button cursor-pointer" onClick={e => {this.props.sidebar(false); this.props.navigate('mycourses')}}>
                    Manage Courses
                </span>
                <span className="w3-bar-item w3-button cursor-pointer" onClick={e => {this.props.sidebar(false); this.props.navigate('myorders')}}>
                    Manage Orders
                </span>
              </div>
            </div>
            : null
          }

        </div>
      </div>
    )
  }
  toggleAccordions(name) {
    return e => {
      const accordions = {...this.state.accordions}
      accordions[name] = !this.state.accordions[name]
      this.setState({ accordions })
    }
  }
  updateStateWidth() {
    const node = this.ref.current
    if (node && node.offsetWidth !== this.state.width) {
      this.setState({ width: node.offsetWidth })
    }
  }
}
