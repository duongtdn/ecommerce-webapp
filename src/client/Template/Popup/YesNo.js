"use strict"

import React, { Component } from 'react'

export default class YesNo extends Component {
  constructor(props) {
    super(props)
    this.onYes = this.onYes.bind(this)
    this.onNo = this.onNo.bind(this)
  }
  render() {
    const style = {
      margin: '120px auto',
      width: '260px',
      textAlign: (this.props.popupArgs  && this.props.popupArgs.align) || 'center',
      padding: '8px 16px'
    }
    const args = this.props.popupArgs
    return (
      <div className="w3-model-content w3-sand w3-round" style={style} >
        <p className="w3-text-blue-grey w3-large"> {args.message} </p>
        <div>
          <button className="w3-button w3-blue" onClick={this.onYes} > {args.yesLabel || 'Yes'} </button>
          <button className="w3-button w3-text-grey" onClick={this.onNo} > {args.noLabel || 'No'} </button>
        </div>
      </div>
    )
  }
  onYes() {
    this.props.hidePopup()
    this.props.popupArgs.resolve()
  }
  onNo() {
    this.props.hidePopup()
    this.props.popupArgs.reject()
  }
}
