"use strict"

import React, { Component } from 'react'

import { localeString } from '../../lib/util'
import storage from '../../lib/storage'

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
        <div className="w3-cell-row w3-border-bottom w3-padding">
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
    // const cart = [{code: 'item-1', name: 'Sinbad and the great adventure', price: 500}, {code: 'item-2', name: 'One Piece, The elevent super novas  ', price: 700}]
    const cart = storage.get(storage.key.CART) || []
    const subTotal = cart.reduce( (acc, cur) => acc + cur.price, 0 )
    return(
      <div>
        <h3> Checkout Carts </h3>
        <p> Please verify your purchase items in cart, then process to next pay with payment method</p>
        <table className="w3-table w3-border w3-bordered">
          <thead>
            <tr className="w3-blue">
              <th className = "w3-border-right">Item</th>
              <th style={{textAlign: 'right'}} >Value ({'\u20ab'})</th>
            </tr>
          </thead>
          <tbody>
          {
            cart.map( item => (
              <tr key={item.code}>
                <td className = "w3-border-right">
                  <div className="w3-cell-row">
                    <div className="w3-cell" style={{width: '25px'}}>
                      <input type="checkbox" style={{marginRight: '5px'}} />
                    </div>
                    <div className="w3-cell">
                      <div> {item.name} </div>
                      <div className="w3-small w3-text-grey"> {item.code} </div>
                    </div>
                  </div>
                </td>
                <td style={{textAlign: 'right'}}>
                  {localeString(item.price)}
                </td>
              </tr>
            ))
          }
          </tbody>
          <tfoot>
            <tr className="w3-pale-blue">
              <th className = "w3-border-right">Total</th>
              <th className="w3-text-orange" style={{textAlign: 'right'}} > {localeString(subTotal)} </th>
            </tr>
          </tfoot>
        </table>
        <div style={{margin: '32px 0'}}>
          <button className="w3-button w3-blue w3-right" onClick = {e => this.props.moveToTab('payment')}> Continue with payment </button>
        </div>
      </div>
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
        <div style={{margin: '32px 0'}} >
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
