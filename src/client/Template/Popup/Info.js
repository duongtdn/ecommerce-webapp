"use strict"

import React, { Component } from 'react'

export default class Info extends Component {
  constructor(props) {
    super(props)
    this.close = this.close.bind(this)
  }
  componentDidMount() {
    if (this.props.popupArgs && this.props.popupArgs.duration) {
      setTimeout(_ => this.props.hidePopup(), this.props.popupArgs.duration)
    }
  }
  render() {
    const style = {
      margin: '120px auto',
      width: '260px',
      textAlign: (this.props.popupArgs  && this.props.popupArgs.align) || 'center',
      padding: '8px 16px'
    }
    return (
      <div className="w3-model-content w3-sand w3-round" style={style} >
        <p> <i className={`w3-spin w3-xxxlarge w3-text-blue bold ${this.props.popupArgs && this.props.popupArgs.icon}`} /> </p>
        <p className="w3-large w3-text-black bold">
          {this.props.popupArgs && this.props.popupArgs.message}
        </p>
        <p style={{textAlign: 'center'}}>
          {
            this.props.popupArgs && this.props.popupArgs.closeBtn?
              <button className="w3-button w3-blue" onClick={this.close}> Close </button>
            : null
          }
        </p>
      </div>
    )
  }
  close() {
    this.props.hidePopup()
    this.props.popupArgs && this.props.popupArgs.resolve && this.props.popupArgs.resolve()
  }
}
