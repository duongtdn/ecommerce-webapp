"use strict"

import React, { Component } from 'react'

import xhttp from '@realmjs/xhttp-request'

import UnAuthen from './UnAuthen'

import { localeString } from '../../lib/util'
import storage from '../../lib/storage'

function _scrollTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

class ProgressBar extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const tabColors = {
      cart: this.props.tab === 'cart' ? 'blue' : this.props.progress.cart ? 'light-blue' : 'light-blue',
      payment: this.props.tab === 'payment' ? 'blue' : this.props.progress.payment ? 'light-blue' : 'grey',
      receipt: this.props.tab === 'receipt' ? 'blue' : this.props.progress.receipt ? 'light-blue' : 'grey',
    }
    return(
      <div>
        <div className="w3-cell-row w3-border-bottom w3-padding">
          <div className={`w3-cell w3-center w3-text-${tabColors.cart}`} style={{width: '33.33%'}}>
            <label style={{position: 'relative'}} >
              <i className="fas fa-shopping-cart" /><br/>
              <span className="w3-hide-small">Checkout Cart</span>
              {
                this.props.progress.cart ?
                  <label  className={`w3-text-${tabColors.cart}`}
                          style={{display: 'inline-block', width: '25px', height: '25px', position: 'absolute', top: '-27px', left: '-3px'}}
                  >
                    <i className="fa fa-check" />
                  </label>
                :
                  <label  className={`w3-circle w3-${tabColors.cart}`}
                          style={{display: 'inline-block', width: '25px', height: '25px', position: 'absolute', top: '-27px', left: '-3px'}}
                  >
                    1
                  </label>
              }
            </label>
          </div>
          <div className={`w3-cell w3-center w3-text-${tabColors.payment}`} style={{width: '33.33%'}}>
            <label style={{position: 'relative'}} >
              <i className="far fa-credit-card" /><br/>
              <span className="w3-hide-small">Process Payment</span>
              {
                this.props.progress.payment ?
                  <label  className={`w3-text-${tabColors.payment}`}
                          style={{display: 'inline-block', width: '25px', height: '25px', position: 'absolute', top: '-27px', left: '-4px'}}
                  >
                    <i className="fa fa-check" />
                  </label>
                :
                  <label  className={`w3-circle w3-${tabColors.payment}`}
                          style={{display: 'inline-block', width: '25px', height: '25px', position: 'absolute', top: '-27px', left: '-4px'}}
                  >
                    2
                  </label>
              }
            </label>
          </div>
          <div className={`w3-cell w3-center w3-text-${tabColors.receipt}`} style={{width: '33.33%'}}>
            <label style={{position: 'relative'}} >
              <i className="fas fa-receipt" /><br/>
              <span className="w3-hide-small">Receipt</span>
              {
                this.props.progress.receipt ?
                  <label  className={`w3-text-${tabColors.receipt}`}
                          style={{display: 'inline-block', width: '25px', height: '25px', position: 'absolute', top: '-27px', left: '-6px'}}
                  >
                    <i className="fa fa-check" />
                  </label>
                :
                  <label  className={`w3-circle w3-${tabColors.receipt}`}
                          style={{display: 'inline-block', width: '25px', height: '25px', position: 'absolute', top: '-27px', left: '-6px'}}
                  >
                    3
                  </label>
              }
            </label>
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
    // first update after page load
    this.props.onCartUpdated && this.props.onCartUpdated(this.state.cart)
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
                        <span className="w3-small w3-text-grey" style = {{ textDecoration: 'none', fontStyle: 'normal', cursor: 'pointer'}} onClick = {e => this.removeItemFrom(item.code)}>
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
    this.onCartConfirmed = this.onCartConfirmed.bind(this)
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
                  onClick = {this.onCartConfirmed }
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
  onCartConfirmed() {
    this.props.setTabCompleted('cart')
    this.props.moveToTab('payment')
  }
}
TabCart.__tabname = 'cart'


class Delivery extends Component {
  constructor(props) {
    super(props)
    this.saveDelivery = this.saveDelivery.bind(this)
  }
  render() {
    return (
      <div style={{marginBottom: '32px'}} >
        <h3 className="w3-text-blue"> Delivery
          <span className="w3-text-grey cursor-pointer w3-small"
                style={{marginLeft: '6px', display: this.props.editDelivery? 'none' : 'inline'}}
                onClick={this.props.enableEditDelivery}> <i className = "fa fa-edit" /> Edit </span>
        </h3>
        <p>Please confirm delivery information below</p>
        <div style={{ display: this.props.editDelivery? 'block': 'none' }} >
          <p>
            <label className={`w3-small ${this.props.error.fullName?'w3-text-red':'w3-text-grey'}`}> Name </label>
            <input className={`w3-input ${this.props.error.fullName?'w3-border-red':''}`} value={this.props.delivery.fullName} onChange={this.handleTextInput('fullName')} />
          </p>
          <p>
            <label className={`w3-small ${this.props.error.phone?'w3-text-red':'w3-text-grey'}`}> Contact number </label>
            <input className={`w3-input ${this.props.error.phone?'w3-border-red':''}`} value={this.props.delivery.phone} onChange={this.handleTextInput('phone')} />
          </p>
          <p>
            <label className={`w3-small ${this.props.error.address?'w3-text-red':'w3-text-grey'}`}> Delivery Address </label>
            <input className={`w3-input ${this.props.error.address?'w3-border-red':''}`} value={this.props.delivery.address} onChange={this.handleTextInput('address')} />
          </p>
          <p>
            <button className="w3-button w3-blue" onClick={this.saveDelivery} > Save </button>
          </p>
        </div>
        <div style={{ display: !this.props.editDelivery? 'block': 'none' }} >
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
  saveDelivery() {
    this.props.saveDelivery().catch( err => console.log(err))
  }
  handleTextInput(key) {
    return (e) => {
      const delivery = {...this.props.delivery}
      delivery[key] = e.target.value
      this.props.updateDelivery(delivery)
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
    this.editCart = this.editCart.bind(this)
  }
  render() {
    return (
      <div style={{marginBottom: '32px'}} >
        <h3 className="w3-text-blue"> Confirm Purchase </h3>
        <button className="w3-button w3-small w3-right w3-text-grey w3-hover-none" onClick = {this.editCart}> <i className = "fa fa-edit" /> Edit Cart </button>
        <ItemsTable simpleUI = {true} />
        <div style={{margin: '32px 0'}}>
          <button className="w3-button w3-blue w3-right" onClick = {this.placeOrder}> Place Order </button>
        </div>
      </div>
    )
  }
  editCart() {
    this.props.setTabIncompleted('cart')
    this.props.moveToTab('cart')
  }
  placeOrder() {
    this.props.placeOrder && this.props.placeOrder().then(order => {
      this.props.setTabCompleted('payment')
      this.props.setTabCompleted('receipt')
      this.props.moveToTab('receipt')
    })
    .catch(err => console.log(err))
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
    const order = this.props.me.orders[this.props.me.orders.length-1]
    if (!order) { return null }
    const subTotal = order.items.reduce( (acc, cur) => acc + (cur.checked ? cur.price : 0), 0 )
    return(
      <div className="w3-text-grey">
        <p className="w3-text-blue-grey"> Thank you for purchasing our service. Your order information is as below </p>
        <h4 className="bold w3-text-blue"> <i className="fas fa-receipt" />  Order: #{order.number} </h4>
        <p> Created At: {this.getDay(order.createdAt)} </p>
        <p> Status: {order.status.toUpperCase()} </p>

        <p className="w3-card w3-padding">
          <span className="w3-small w3-text-grey"> Delivery to </span> <br />
          <span className="bold w3-text-blue-grey"> {order.delivery.fullName} </span> <br/>
          <span className="w3-text-blue-grey"> {order.delivery.phone} </span> <br/>
          <span className="w3-text-blue-grey"> {order.delivery.address} </span>
        </p>

        <p className="w3-text-grey"> Item Lists </p>

        <table className="w3-table w3-border w3-bordered">
          <thead>
            <tr className="w3-blue">
              <th className = "w3-border-right">Item</th>
              <th style={{textAlign: 'right'}} >Value ({'\u20ab'})</th>
            </tr>
          </thead>
          <tbody>
            {
              order.items.map( item => {
                return (
                  <tr key={item.code}>
                    <td className = "w3-border-right">
                      <div className="w3-cell-row">
                        <div className = "w3-cell">
                          <div >
                            <span style={{fontWeight: 'bold'}} >{item.name}</span>
                            {(item.type === 'bundle')? <ul className="w3-text-blue-grey" style={{margin:'6px 0'}}> {item.items.map( item => (<li key={item.code} style={{margin:'3px 0'}}>{item.name}</li>) )} </ul> : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      {localeString(item.price)}
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

      </div>
    )
  }
  getDay(timestamp) {
    const date = new Date(timestamp)
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return `${weekday[date.getDay()]} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
  }
}
TabReceipt.__tabname = 'receipt'

export default class Order extends Component {
  constructor(props) {
    super(props)

    const delivery = this.props.user ?
      {
        fullName: this.props.user.profile.fullName || '',
        phone: this.props.user.profile.phone[0] || '',
        address: this.props.user.profile.address || ''
      }
      : null

    const editDelivery =  delivery &&
      delivery.fullName && delivery.fullName.length > 0 &&
      delivery.phone && delivery.phone.length > 0 &&
      delivery.address && delivery.address.length > 0 ? false : true

    this.state = {
      progress: {},
      tab: 'cart',
      paymentMethod: null,
      delivery,
      error: _validateDelivery(delivery),
      editDelivery,
      user: this.props.user
    }

    this.tabs = [TabCart, TabPayment, TabReceipt]

    const methods = ['moveToTab', 'setTabCompleted', 'setTabIncompleted', 'onSelectPaymentMethod', 'updateDelivery', 'saveDelivery', 'placeOrder']
    methods.forEach( method => this[method] = this[method].bind(this) )

    this.props.page.on('enter', () => this.setState({ progress: {}, tab: 'cart', paymentMethod: null, }))
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user && !prevState.user) {
      const user = nextProps.user
      const delivery =  {
        fullName: user.profile.fullName || '',
        phone: user.profile.phone[0] || '',
        address: user.profile.address || ''
      }
      const editDelivery =  delivery &&
            delivery.fullName && delivery.fullName.length > 0 &&
            delivery.phone && delivery.phone.length > 0 &&
            delivery.address && delivery.address.length > 0 ? false : true
      const error = _validateDelivery(delivery)
      return { delivery, error, editDelivery, user }
    } else {
      return null
    }
  }
  render() {
    if (!this.props.user) { return ( <UnAuthen {...this.props} />) }
    return (
      <div className="w3-container">
        <ProgressBar progress = {this.state.progress} tab = {this.state.tab} />
        <div style={{margin: '32px 0'}} >
          {
            this.tabs.map( (Tab, index) => {
              return (
                <div key = {index} style = {{display: this.state.tab === Tab.__tabname ? 'block' : 'none'}} >
                  <Tab  moveToTab = {this.moveToTab}
                        setTabCompleted = {this.setTabCompleted}
                        setTabIncompleted = {this.setTabIncompleted}
                        paymentMethod = {this.state.paymentMethod}
                        delivery = {this.state.delivery}
                        selectPaymentMethod = {this.onSelectPaymentMethod}
                        updateDelivery = {this.updateDelivery}
                        saveDelivery = {this.saveDelivery}
                        enableEditDelivery = {e => this.setState({ editDelivery: true })}
                        placeOrder = {this.placeOrder}
                        error = {this.state.error}
                        editDelivery = {this.state.editDelivery}
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
    this.setState({ tab })
    _scrollTop()
  }
  setTabCompleted(tab) {
    const progress = {...this.state.progress}
    progress[tab] = true
    this.setState({ progress })
  }
  setTabIncompleted(tab) {
    const progress = {...this.state.progress}
    progress[tab] = false
    this.setState({ progress })
  }
  onSelectPaymentMethod(method) {
    this.setState({ paymentMethod: method })
  }
  saveDelivery() {
    const delivery = {...this.state.delivery}
    return new Promise( (resolve, reject) => {
      const error = _validateDelivery(delivery)
      if (Object.keys(error).some(key => error[key])) {
        this.setState({ error, editDelivery: true })
        reject(error)
      } else {
        this.setState({ delivery, error, editDelivery: false })
        resolve()
      }
    })
  }
  updateDelivery(delivery) {
    this.setState({ delivery })
  }
  placeOrder() {
    return new Promise( (resolve, reject) => {
      this.saveDelivery().then( _ => {
        if (!this.state.paymentMethod) {
          this.props.showPopup('info', { closeBtn: true, message: 'please select a payment method', align: 'left' })
          reject('please select a payment method')
          return
        }
        const order = {
          delivery: {...this.state.delivery},
          paymentMethod: this.state.paymentMethod,
          billTo: {},
          items: storage.get(storage.key.CART).filter( item => item.checked )
        }
        this.props.showPopup('info', { icon: 'fas fa-spinner', message: 'creating order...' })
        xhttp.post('/data/order', { order }, {authen: true,  timeout: 300000})
        .then( ({status, responseText}) => {
          this.props.hidePopup()
          if (status === 200) {
            const order = JSON.parse(responseText).order
            // remove purchased item from cart
            const cart = storage.get(storage.key.CART).filter( item => !order.items.find( _item => _item.code === item.code) )
            storage.update(storage.key.CART, cart)
            this.props.onOrderCreated && this.props.onOrderCreated(order)
            resolve(order)
          } else {
            this.props.showPopup('info', { closeBtn: true, message: `Error ${status}. Please refresh page and try again`, align: 'left' })
            reject(status)
          }
        })
        .catch( err => {
          this.props.showPopup('info', { closeBtn: true, message: `Error: Cannot connect to server!`, align: 'left' })
        })
      }).catch( error => {
        this.props.showPopup('info', { closeBtn: true, message: 'please complete delivery information', align: 'left' })
        reject('delivery must be provided')
      })
    })
  }
}

function _validateDelivery(delivery) {
  if (delivery) {
    return {
      fullName: delivery.fullName === undefined || delivery.fullName === null || delivery.fullName.length === 0,
      phone: delivery.phone === undefined || delivery.phone === null || delivery.phone.length === 0,
      address: delivery.address === undefined || delivery.address === null || delivery.address.length === 0
    }
  } else {
    return {
      fullName: false, phone: false, address: false
    }
  }
}
