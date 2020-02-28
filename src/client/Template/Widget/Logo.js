"use strict"

import React, { Component } from 'react'

export default class Logo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    if (this.props.source === 'png') {
      return ( <img height="60px" src={this.props.env.assets.logo.png_trans} /> )
    }
    if (this.props.source === 'png-white') {
      return ( <img height="51px" src={this.props.env.assets.logo.png_bg} /> )
    }
    return (
      <span style={{fontFamily: 'Kanit',fontSize: '36px', fontWeight: 'bold', position: 'relative'}}>
        <span style={{color: '#0050EF', marginRight: '4px'}}>Studi</span>
        <span style={{color: '#3A3A3A', marginRight: '6px'}}>ha</span>
        <img src={this.props.env.assets.logo.icon} width="24px" />
      </span>
    )
  }
}
