"use strict"

import React, { Component } from 'react'

export default class extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const color = this.props.color || 'red'
    return (
      <div  className={`w3-${color} w3-card-4 w3-circle w3-large ${this.props.hide? 'w3-hide': ''}`}
            style={{width: '40px', height: '40px', textAlign: 'center', position:'fixed', bottom: '15px', right: '5%'}}
            onClick={e => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fas fa-chevron-up" style={{margin: '10px auto'}}></i>
      </div>
    )
  }
}
