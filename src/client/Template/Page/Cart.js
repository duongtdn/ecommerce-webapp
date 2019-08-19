"use strict"

import React, { Component } from 'react'

class Progress extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const tabColors = {
      cart: this.props.tab === 'cart' ? 'w3-text-blue' : this.props.progress.cart ? 'w3-text-light-blue' : 'w3-text-light-blue',
      payment: this.props.tab === 'payment' ? 'w3-text-blue' : this.props.progress.payment ? 'w3-text-light-blue' : 'w3-text-grey',
      receipt: this.props.tab === 'receipt' ? 'w3-text-blue' : this.props.progress.receipt ? 'w3-text-light-blue' : 'w3-text-grey',
    }
    return(
      <div>
        <div className="w3-cell-row">
          <div className={`w3-cell w3-center ${tabColors.cart}`} style={{width: '33.33%'}}>
            <i className="fas fa-shopping-cart" /><br/>
            <span className="w3-hide-small">Checkout Cart</span>
          </div>
          <div className={`w3-cell w3-center ${tabColors.payment}`} style={{width: '33.33%'}}>
            <i className="far fa-credit-card" /><br/>
            <span className="w3-hide-small">Process Payment</span>
          </div>
          <div className={`w3-cell w3-center ${tabColors.receipt}`} style={{width: '33.33%'}}>
            <i className="fas fa-receipt" /><br/>
            <span className="w3-hide-small">Confirm Order</span>
          </div>
        </div>

      </div>
    )
  }
}

class TabCart extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div>Cart <button onClick = {e => this.props.moveToTab('payment')} >Next</button> </div>
    )
  }
}
TabCart.__tabname = 'cart'

class TabPayment extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div>Payment <button onClick = {e => this.props.moveToTab('receipt')} >Next</button> </div>
    )
  }
}
TabPayment.__tabname = 'payment'

class TabReceipt extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div>Receipt</div>
    )
  }
}
TabReceipt.__tabname = 'receipt'

export default class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: {},
      tab: 'cart'
    }
    this.tabs = [TabCart, TabPayment, TabReceipt]
    this.moveToTab = this.moveToTab.bind(this)
  }
  render() {
    return (
      <div className="w3-container">
        <Progress progress = {this.state.progress} tab = {this.state.tab} />
        <div>
          {
            this.tabs.map( (Tab, index) => {
              return (
                <div key = {index} style = {{display: this.state.tab === Tab.__tabname ? 'block' : 'none'}} >
                  <Tab moveToTab = {this.moveToTab} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
  moveToTab(tab) {
    const progress = {...this.state.progress}
    progress[tab] = true
    this.setState({ progress, tab })
  }
}
