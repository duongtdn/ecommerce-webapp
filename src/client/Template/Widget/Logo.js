"use strict"

import React, { Component } from 'react'

export default class Logo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const x = this.props.scale || 1
    const text = {
      fontSize: `${22*x}px`,
      marginRight: `${2*x}px`
    }
    const icon = {
      fontSize: `${18*x}px`,
      left: `${2*x}px`,
      top: `-${4*x}px`
    }
    return (
      <span style={{fontFamily: "'Kaushan Script', cursive", position: 'relative'}}>
        <span style={{color: "#2196F3", fontSize: text.fontSize, marginRight: text.marginRight}}>Studi</span><span style={{color: "#607d8b", fontSize:text.fontSize}}>ha</span><i className="fas fa-seedling" style={{color: "#4CAF50", fontSize: icon.fontSize, position: "relative", left: icon.left, top: icon.top}}/>
      </span>
    )
  }
}
