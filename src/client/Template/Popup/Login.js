"use strict"

import React, { Component } from 'react'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.onYes = this.onYes.bind(this)
    this.onNo = this.onNo.bind(this)
  }
  render() {
    const style = {
      margin: '120px auto',
      maxWidth: '300px',
      textAlign: (this.props.popupArgs  && this.props.popupArgs.align) || 'center',
      padding: '8px 16px'
    }
    const args = this.props.popupArgs
    return (
      <div className="w3-model-content w3-sand w3-round" style={style} >
        <p className="w3-text-blue-grey w3-large"> {args.message} </p>
        <div className="w3-cell-row" style={{margin: '32px 0 8px 0'}}>
          <div className="w3-cell">
            <button className="w3-button w3-blue" onClick={this.onYes} > {args.yesLabel || 'Login'} </button>
          </div>
          <div className="w3-cell">
            <button className="w3-button w3-text-grey" onClick={this.onNo} > {args.noLabel || 'Cancel'} </button>
          </div>
        </div>
      </div>
    )
  }
  onYes() {
    this.props.hidePopup()
    this.props.accountClient.signin( (status, user) => {
      if (status === 200) {
        this.props.popupArgs.resolve()
      } else {
        this.props.popupArgs.reject()
      }
    })
  }
  onNo() {
    this.props.hidePopup()
    this.props.popupArgs.reject()
  }
}
