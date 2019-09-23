"use strict"

import React from 'react'

export default function(props) {
  return (
    <div className="w3-container">
      <p className="w3-text-red w3-large bold">Unauthenticated</p>
      <p>Please Sign-in to see this page</p>
      <p><button className="w3-button w3-blue" onClick={e=>props.accountClient.signin()}> Login | New Account </button></p>
    </div>
  )
}
