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


class ItemsTable extends Component {
  constructor(props) {
    super(props)
    this.state = { cart: storage.get(storage.key.CART) || [] }
  }
  componentDidMount() {
    this._observer = storage.observe(storage.key.CART, cart => this.setState({ cart }))
  }
  componentWillUnmount() {
    storage.observe(storage.key.CART, this._observer, false)
  }
  render() {
    const cart = this.state.cart
    const subTotal = cart.reduce( (acc, cur) => acc + (cur.checked ? cur.price : 0), 0 )
    return (
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
                  <div className="w3-cell" style={{width: '25px', display: !this.props.simpleUI? 'block': 'none'}}>
                    <input type="checkbox" style={{marginRight: '5px'}} checked={item.checked} onChange ={ e => this.toggleCheckItem(item.code)}/>
                  </div>
                  <div className = "w3-cell">
                    <div className={`${item.checked ? '' : 'w3-text-grey'}`} style={{ textDecoration: item.checked ? 'none' : 'line-through', fontStyle: item.checked ? 'normal' : 'italic' }}>
                      <span style={{fontWeight: 'bold'}} >{item.name}</span>
                      {(item.type === 'bundle' && !this.props.simpleUI)? <ul className="w3-text-blue-grey" style={{margin:'6px 0'}}> {item.items.map( item => (<li key={item.code} style={{margin:'3px 0'}}>{item.name}</li>) )} </ul> : null}
                    </div>
                    <div style={{margin: '3px 0', display: !this.props.simpleUI? 'block': 'none'}}>
                      <span className="w3-small w3-text-grey" style = {{ textDecoration: 'none', fontStyle: 'normal'}} onClick = {e => this.removeItemFrom(item.code)}>
                        <i className="fas fa-trash"/> Remove from cart
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td style={{textAlign: 'right'}}>
                { item.checked ? localeString(item.price) : 0 }
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
    )
  }
  toggleCheckItem(code) {
    const cart = [...this.state.cart]
    const item = cart.find( _item => _item.code === code)
    item.checked = !item.checked
    storage.update(storage.key.CART, cart)
  }
  removeItemFrom(code) {
    const cart = this.state.cart.filter(item => item.code !== code)
    storage.update(storage.key.CART, cart)
  }
}

class TabCart extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div>
        <h3> Checkout Carts </h3>
        <p> Please verify your purchase items in cart, then process to next pay with payment method</p>
        <ItemsTable />
        <div style={{margin: '32px 0'}}>
          <button className="w3-button w3-blue w3-right" onClick = {e => this.props.moveToTab('payment')}> Continue with payment </button>
        </div>
      </div>
    )
  }
}
TabCart.__tabname = 'cart'


class Delivery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: false,
      delivery: null
    }
  }
  render() {
    return (
      <div style={{marginBottom: '32px'}} >
        <h3 className="w3-text-blue"> Delivery
          <span className="w3-text-grey cursor-pointer w3-small"
                style={{marginLeft: '6px', display: this.state.edit? 'none' : 'inline'}}
                onClick={e => this.setState({edit: true})}> <i className = "fa fa-edit" /> Edit </span>
        </h3>
        <p>Please confirm delivery information below</p>
        <div style={{ display: this.state.edit? 'block': 'none' }} >
          <p>
            <label> Name </label>
            <input className="w3-input" />
          </p>
          <p>
            <label> Contact number </label>
            <input className="w3-input" />
          </p>
          <p>
            <label> Delivery Address </label>
            <input className="w3-input" />
          </p>
          <p>
            <button className="w3-button w3-blue" onClick={e => this.setState({ edit: false })} >Save </button>
          </p>
        </div>
        <div style={{ display: !this.state.edit? 'block': 'none' }} >
          <div>
            <p className="w3-small w3-text-grey"> Delivery to:</p>
            <label className="bold">Nguyen Duong</label> <br />
            <label>0976096633</label> <br />
            <label>Etown 2, 364 Cong Hoa, Tan Binh, HCMC</label>
          </div>
        </div>
      </div>
    )
  }
}

class PaymentMethod extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paymentMethod: null
    }
  }
  render() {
    const highlight = 'w3-border-blue w3-text-blue bold'
    const normal = 'w3-border-grey w3-text-grey'
    return (
      <div style={{marginBottom: '32px'}} >
        <h3 className="w3-text-blue"> Payment Method </h3>
          <div className="w3-cell">
            <div className="w3-cell w3-center" style={{width: '90px', paddingRight: '5px'}}>
              <div  className={`w3-border w3-round w3-hover-pale-blue cursor-pointer ${this.state.paymentMethod === 'cod'? highlight : normal}`}
                    style={{padding: '3px 0'}}
                    onClick={e => this.setState({ paymentMethod: 'cod'})}
              >
                <i className="fas fa-shuttle-van" /><br/>
                <span className="">COD</span>
              </div>
            </div>
            <div className="w3-cell w3-center" style={{width: '90px', paddingRight: '5px'}}>
              <div  className={`w3-border w3-round w3-hover-pale-blue cursor-pointer ${this.state.paymentMethod === 'card'? highlight : normal}`}
                    style={{padding: '3px 0'}}
                    onClick={e => this.setState({ paymentMethod: 'card'})}
              >
                <i className="fas fa-landmark" /><br/>
                <span className="">BANK</span>
              </div>
            </div>
            <div className="w3-cell w3-center" style={{width: '90px', paddingRight: '5px'}}>
              <div  className={`w3-border w3-round w3-hover-pale-blue cursor-pointer ${this.state.paymentMethod === 'bank'? highlight : normal}`}
                    style={{padding: '3px 0'}}
                    onClick={e => this.setState({ paymentMethod: 'bank'})}
              >
                <i className="far fa-credit-card" /><br/>
                <span className="">CARD</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{display: this.state.paymentMethod === 'cod'? 'block' : 'none'}} >
              <p>You will pay when we deliver activation code to you. Please check and confirm the delivery address</p>
            </div>
            <div style={{display: this.state.paymentMethod === 'bank'? 'block' : 'none'}} >
              <p>This payment method is not supported yet. We are going to make it vailable soon</p>
            </div>
            <div style={{display: this.state.paymentMethod === 'card'? 'block' : 'none'}} >
              <p>This payment method is not supported yet. We are going to make it vailable soon</p>
            </div>
          </div>
      </div>
    )
  }
}

class ConfirmPurchase extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div style={{marginBottom: '32px'}} >
        <h3 className="w3-text-blue"> Confirm Purchase </h3>
        <button className="w3-button w3-small w3-right w3-text-grey" onClick = {e => this.props.moveToTab('cart')}> <i className = "fa fa-edit" /> Edit Cart </button>
        <ItemsTable simpleUI = {true} />
        <div style={{margin: '32px 0'}}>
          <button className="w3-button w3-blue w3-right" onClick = {e => this.props.moveToTab('receipt')}> Place Order </button>
        </div>
      </div>
    )
  }
}


class TabPayment extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div>
        <div className="w3-row-padding" >
          <div className="w3-col w3-half">
            <PaymentMethod />
          </div>
          <div className="w3-col w3-half">
            <Delivery />
            <ConfirmPurchase />
          </div>
        </div>
      </div>
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

export default class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: {},
      tab: 'payment'
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
