"use strict"

import React, { Component } from 'react'

import { xhttp } from 'authenform-utils'

import { localeString } from '../../lib/util'
import storage from '../../lib/storage'

class ProgressBar extends Component {
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
    this._observer = storage.observe(storage.key.CART, cart => {
      this.setState({ cart })
      this.props.onCartUpdated && this.props.onCartUpdated(cart)
    })
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
          cart.map( item => {
            if (this.props.simpleUI && !item.checked) { return null }
            return (
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
            )
          })
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
    this.state = { disabledBtn: false }
    this.onCartUpdated = this.onCartUpdated.bind(this)
  }
  render() {
    return(
      <div>
        <h3> Checkout Carts </h3>
        <p> Please verify your purchase items in cart, then process to next pay with payment method</p>
        <ItemsTable onCartUpdated = {this.onCartUpdated} />
        <div style={{margin: '32px 0'}}>
          <button className={`w3-button w3-blue w3-right ${this.state.disabledBtn? 'w3-disabled' : ''}`}
                  disabled = {this.state.disabledBtn}
                  onClick = {e => this.props.moveToTab('payment')}
          >
            Continue with payment
          </button>
        </div>
      </div>
    )
  }
  onCartUpdated(cart) {
    const disabledBtn = !(cart && cart.filter(item => item.checked).length > 0)
    this.setState({ disabledBtn })
  }
}
TabCart.__tabname = 'cart'


class Delivery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: this.props.delivery? false : true,
      delivery: this.props.delivery? {...this.props.delivery} : {fullName: '', phone: '', address: ''}
    }
    this.updateDelivery = this.updateDelivery.bind(this)
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
            <label className="w3-text-grey w3-small"> Name </label>
            <input className="w3-input" value={this.state.delivery.fullName} onChange={this.handleTextInput('fullName')} />
          </p>
          <p>
            <label className="w3-text-grey w3-small"> Contact number </label>
            <input className="w3-input" value={this.state.delivery.phone} onChange={this.handleTextInput('phone')} />
          </p>
          <p>
            <label className="w3-text-grey w3-small"> Delivery Address </label>
            <input className="w3-input" value={this.state.delivery.address} onChange={this.handleTextInput('address')} />
          </p>
          <p>
            <button className="w3-button w3-blue" onClick={this.updateDelivery} > Save </button>
          </p>
        </div>
        <div style={{ display: !this.state.edit? 'block': 'none' }} >
          <div>
            <p className="w3-small w3-text-grey"> Delivery to:</p>
            <label className="bold">{this.props.delivery && this.props.delivery.fullName}</label> <br />
            <label>{this.props.delivery && this.props.delivery.phone}</label> <br />
            <label>{this.props.delivery && this.props.delivery.address}</label>
          </div>
        </div>
      </div>
    )
  }
  updateDelivery() {
    const delivery = {...this.state.delivery}
    this.props.updateDelivery && this.props.updateDelivery(delivery)
    this.setState({ edit: false })
  }
  handleTextInput(key) {
    return (e) => {
      const delivery = {...this.state.delivery}
      delivery[key] = e.target.value
      this.setState({ delivery })
    }
  }
}

class PaymentMethod extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const highlight = 'w3-border-blue w3-text-blue bold'
    const normal = 'w3-border-grey w3-text-grey'
    return (
      <div style={{marginBottom: '32px'}} >
        <h3 className="w3-text-blue"> Payment Method </h3>
          <div className="w3-cell">
            <div className="w3-cell w3-center" style={{width: '90px', paddingRight: '5px'}}>
              <div  className={`w3-border w3-round w3-hover-pale-blue w3-hover-text-blue cursor-pointer ${this.props.paymentMethod === 'cod'? highlight : normal}`}
                    style={{padding: '3px 0'}}
                    onClick={e => this.props.selectPaymentMethod('cod')}
              >
                <i className="fas fa-shuttle-van" /><br/>
                <span className="">COD</span>
              </div>
            </div>
            <div className="w3-cell w3-center" style={{width: '90px', paddingRight: '5px'}}>
              <div  className={`w3-border w3-round w3-hover-pale-blue w3-hover-text-blue cursor-pointer ${this.props.paymentMethod === 'bank'? highlight : normal}`}
                    style={{padding: '3px 0'}}
                    onClick={e => this.props.selectPaymentMethod('bank')}
              >
                <i className="fas fa-landmark" /><br/>
                <span className="">BANK</span>
              </div>
            </div>
            <div className="w3-cell w3-center" style={{width: '90px', paddingRight: '5px'}}>
              <div  className={`w3-border w3-round w3-hover-pale-blue w3-hover-text-blue cursor-pointer ${this.props.paymentMethod === 'card'? highlight : normal}`}
                    style={{padding: '3px 0'}}
                    onClick={e => this.props.selectPaymentMethod('card')}
              >
                <i className="far fa-credit-card" /><br/>
                <span className="">CARD</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{display: this.props.paymentMethod === 'cod'? 'block' : 'none'}} >
              <p>You will pay when we deliver activation code to you. Please check and confirm the delivery address</p>
            </div>
            <div style={{display: this.props.paymentMethod === 'bank'? 'block' : 'none'}} >
              <p>This payment method is not supported yet. We are going to make it vailable soon</p>
            </div>
            <div style={{display: this.props.paymentMethod === 'card'? 'block' : 'none'}} >
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
    this.placeOrder = this.placeOrder.bind(this)
  }
  render() {
    return (
      <div style={{marginBottom: '32px'}} >
        <h3 className="w3-text-blue"> Confirm Purchase </h3>
        <button className="w3-button w3-small w3-right w3-text-grey w3-hover-none" onClick = {e => this.props.moveToTab('cart')}> <i className = "fa fa-edit" /> Edit Cart </button>
        <ItemsTable simpleUI = {true} />
        <div style={{margin: '32px 0'}}>
          <button className="w3-button w3-blue w3-right" onClick = {this.placeOrder}> Place Order </button>
        </div>
      </div>
    )
  }
  placeOrder() {
    this.props.placeOrder && this.props.placeOrder().then(order => this.props.moveToTab('receipt'))
    // catch error here
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
            <PaymentMethod {...this.props} />
          </div>
          <div className="w3-col w3-half">
            <Delivery {...this.props} />
            <ConfirmPurchase {...this.props} />
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
      tab: 'cart',
      paymentMethod: null,
      delivery: null
    }
    this.tabs = [TabCart, TabPayment, TabReceipt]
    const methods = ['moveToTab', 'onSelectPaymentMethod', 'onUpdateDelivery', 'placeOrder']
    methods.forEach( method => this[method] = this[method].bind(this) )
  }
  render() {
    return (
      <div className="w3-container">
        <ProgressBar progress = {this.state.progress} tab = {this.state.tab} />
        <div style={{margin: '32px 0'}} >
          {
            this.tabs.map( (Tab, index) => {
              return (
                <div key = {index} style = {{display: this.state.tab === Tab.__tabname ? 'block' : 'none'}} >
                  <Tab  moveToTab = {this.moveToTab}
                        paymentMethod = {this.state.paymentMethod}
                        delivery = {this.state.delivery}
                        selectPaymentMethod = {this.onSelectPaymentMethod}
                        updateDelivery = {this.onUpdateDelivery}
                        placeOrder = {this.placeOrder}
                        {...this.props}
                  />
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
  onSelectPaymentMethod(method) {
    this.setState({ paymentMethod: method })
  }
  onUpdateDelivery(delivery) {
    this.setState({ delivery })
  }
  placeOrder() {
    return new Promise( (resolve, reject) => {
      const order = {
        delivery: {...this.state.delivery},
        billTo: {},
        items: storage.get(storage.key.CART).filter( item => item.checked )
      }
      this.props.showPopup('small', { icon: 'fas fa-spinner', message: 'creating order...' })
      xhttp.post('/data/order', { order }, {authen: true}, (status, order) => {
        if (status === 200) {
          resolve(order)
        } else {
          reject(status)
        }
        this.props.hidePopup()
      })
    })
  }
}
