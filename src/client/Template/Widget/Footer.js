"use strict"

import React, { Component } from 'react'

export default class Footer extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="w3-blue" style={{marginTop: '64px', height: '200px', width: '100%', position:'absolute', zIndex: 99}}>
        Footer
      </div>
    )
  }
}
