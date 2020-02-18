"use strict"

import React, { Component } from 'react'

export default class Logo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <img height="40px" src="/public/logo.png" />
    )
  }
}
