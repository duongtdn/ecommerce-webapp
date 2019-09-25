"use strict"

import React, { Component } from 'react'

import { xhttp } from 'authenform-utils'

export default class CoursesActivation extends Component {
  constructor(props) {
    super(props)
    this.state = { code: '', busy: false }
    this.submitActivationCode = this.submitActivationCode.bind(this)
  }
  render() {
    const style = {
      margin: '120px auto',
      width: '260px',
      textAlign: (this.props.popupArgs  && this.props.popupArgs.align) || 'center',
      padding: '24px 16px 8px 16px',
      position: 'relative'
    }
    return (
      <div className="w3-model-content w3-sand w3-round" style={style} >
        <span  className="w3-button w3-display-topright bold w3-text-red" onClick={this.props.hidePopup} >&times;</span>
        <p className="w3-text-grey"> Please enter activation code </p>
        <input  type="text" className="w3-input w3-border w3-border-grey"
                value={this.state.code}
                onChange={e => this.setState({code: e.target.value.toUpperCase()})}
                autoFocus
        />
        <div style={{textAlign: 'center', margin: '16px 0'}} >
          <button className="w3-button w3-green" onClick={this.submitActivationCode} disabled = {this.state.busy} >
            <i className={this.state.busy? 'w3-spin fas fa-spinner': 'w3-hide'} /> Activate
          </button>
        </div>
      </div>
    )
  }
  submitActivationCode(e) {
    if (this.state.code.length === 0) { return }
    this.setState({ busy: true })
    xhttp.post('/me/enroll', {code: this.state.code}, {authen: true}, (status, responseText) => {
      this.setState({ busy: false, code: '' })
      this.props.hidePopup()
      if (status === 200) {
        const enrolls = JSON.parse(responseText).enrolls
        this.props.showPopup('info', {closeBtn: true, message: 'Success! Activated courses'})
                  .then( _ => { this.props.sidebar(false); this.props.onEnrollCreated(enrolls) } )
      } else {
        this.props.showPopup('info', {closeBtn: true, message: 'Failed! Unable to activate courses'})
      }
    })
  }
}
