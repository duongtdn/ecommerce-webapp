"use strict"

import React, { Component } from 'react'

export default class Logo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <span style={{fontFamily: "'Kaushan Script', cursive", position: 'relative'}}>
        <span style={{color: "#2196F3", fontSize: "22px", marginRight: "2px"}}>Studi</span><span style={{color: "#607d8b", fontSize: "22px"}}>ha</span><i className="fas fa-seedling" style={{color: "#4CAF50", fontSize: "18px", position: "relative", left: "2px", top: "-4px"}}/>
      </span>
    )
  }
}
