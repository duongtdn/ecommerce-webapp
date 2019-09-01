"use strict"

import React, { Component } from 'react'

export default class CenterSmall extends Component {
  constructor(props) {
    super(props)
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
      textAlign: 'center',
      padding: '8px 4px'
    }
    return (
      <div className="w3-model-content w3-sand w3-round" style={style} >
        <p> <i className={`w3-spin w3-xxxlarge w3-text-blue bold ${this.props.popupArgs && this.props.popupArgs.icon}`} /> </p>
        <p className="w3-xlarge w3-text-black bold">
          {this.props.popupArgs && this.props.popupArgs.message}
        </p>
      </div>
    )
  }
}
