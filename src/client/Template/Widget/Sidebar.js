"use strict"

import React, { Component } from 'react'
import {FormattedMessage} from 'react-intl'

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
          <button className="w3-button w3-small w3-blue" onClick={this.signout}> <FormattedMessage id="button.signout" /> </button>
        </div>
      )
    } else {
      return (
        <div className="" style={{margin: 'auto', textAlign: 'center'}}>
          <p > <i className="fas fa-user w3-text-grey w3-opacity w3-xxxlarge" /> </p>
          <button className="w3-button w3-small w3-blue" onClick={this.signin}> <FormattedMessage id="button.login_signup" /> </button>
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

class Programs extends Component {
  constructor(props) {
    super(props)
    this.navigate = this.navigate.bind(this)
  }
  render() {
    const programs = this.props.programs
    const active = this.props.active
    return (
      <div>
        <span className="w3-bar-item w3-button w3-text-blue w3-large" onClick={this.props.toggleAccordions}>
          <i className="fas fa-book-open" /> <FormattedMessage id="sidebar.programs" /> { this.props.collapse? <i className="fa fa-caret-up w3-right" /> : <i className="fa fa-caret-down w3-right" /> }
        </span>
        <div className="w3-text-grey" style={{padding: '4px', marginBottom: '16px', display: this.props.collapse? 'block':'none'}}>
          {
            programs.map( program => (
              <a  key={program.id}
                  className={`w3-bar-item w3-button cursor-pointer ${program.id===active?'w3-pale-blue':''}`}
                  href = {`/browse/${program.id}`}
                  onClick = { e => { e.preventDefault(); this.navigate(`browse/${program.id}`)}}
              >
                {program.title}
              </a>
            ))
          }
        </div>
      </div>
    )
  }
  navigate(route) {
    this.props.sidebar(false)
    this.props.navigate(route)
  }
}

class Managers extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const active = this.props.active
    return (
      <div>
        {
          this.props.user?
          <div>
            <span className="w3-bar-item w3-button w3-text-blue w3-large" onClick={this.props.toggleAccordions}>
              <i className="fas fa-tasks " /> <FormattedMessage id="sidebar.manager" /> { this.props.collapse? <i className="fa fa-caret-up w3-right" /> : <i className="fa fa-caret-down w3-right" /> }
            </span>
            <div className="w3-text-grey" style={{padding: '4px', marginBottom: '16px', display: this.props.collapse? 'block':'none'}}>
              <span className={`w3-bar-item w3-button cursor-pointer ${active==='mycourses'?'w3-pale-blue':''}`} onClick={e => {this.props.sidebar(false); this.props.navigate('mycourses')}}>
                <FormattedMessage id="sidebar.manage_courses" />
              </span>
              <span className={`w3-bar-item w3-button cursor-pointer ${active==='myorders'?'w3-pale-blue':''}`} onClick={e => {this.props.sidebar(false); this.props.navigate('myorders')}}>
                <FormattedMessage id="sidebar.manage_orders" />
              </span>
              <span className={`w3-bar-item w3-button cursor-pointer ${active==='myrewards'?'w3-pale-blue':''}`} onClick={e => {this.props.sidebar(false); this.props.navigate('myrewards')}}>
                <FormattedMessage id="sidebar.manage_rewards" />
              </span>
            </div>
          </div>
          : null
        }
      </div>
    )
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
    this.toggleAccordions = this.toggleAccordions.bind(this)
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
    const path = this.props.href && this.props.href.getPathName() || this.props.path
    const active = path && path.match(/\/.*$/)? path.match(/\/.*$/)[0].replace('/','') : path
    const style = {width: this.props.sidebarWidth, minWidth: this.props.sidebarMinWidth, top: 0, zIndex: 1}
    if (this.props.marginTop) {
      style.marginTop = this.props.marginTop
    }
    return (
      <div>
        <div className="w3-modal w3-hide-large" style={{display: this.props.show? 'block' : 'none'}} onClick={e => this.props.sidebar(false)}>
          <div ref={this.ref} className="w3-sidebar w3-bar-block w3-border-right w3-border-grey" style={style} onClick={e => e.stopPropagation()}>

            {/* close button */}
            <span className="w3-button w3-xxlarge" style={{position: 'fixed', left: `${this.state.width}px`, background: 'none'}} onClick={e => this.props.sidebar(false)}>
              <i className="fa fa-bars" />
            </span>

            {/* user widget */}
            <div className="w3-bar-item w3-border-bottom" style={{ padding: '8px 2px', margin: '8px 0 8px 0' }}>
                <UserWidget {...this.props} />
            </div>

            <div className="w3-small" style={{textAlign: 'center', padding: '8px 2px', margin: '0 0 8px 0'}}>
              <button className="w3-button w3-green" onClick={e => this.props.showPopup('activation')} > <FormattedMessage id="button.activate_course" /> </button>
            </div>

            <Programs active={active} collapse = {this.state.accordions['program']} {...this.props} toggleAccordions = {this.toggleAccordions('program')} />

            <Managers active={active} collapse = {this.state.accordions['management']} {...this.props} toggleAccordions = {this.toggleAccordions('management')} />

          </div>
        </div>
        <div className="w3-hide-small w3-hide-medium" >
          <div  className="w3-sidebar w3-bar-block w3-border-right w3-border-grey border-gradient"
                style={{ ...style, backgroundColor: 'inherit', }}
                onClick={e => e.stopPropagation()}
          >

            <Programs  active={active} collapse = {this.state.accordions['program']} {...this.props} toggleAccordions = {this.toggleAccordions('program')} />

            <Managers  active={active} collapse = {this.state.accordions['management']} {...this.props} toggleAccordions = {this.toggleAccordions('management')} />

          </div>
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
