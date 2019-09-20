"use strict"

import React, { Component } from 'react'

import { xhttp } from 'authenform-utils'

import { getDay, localeString } from '../../lib/util'

const _dict = {
  'cod': 'Pay when received items',
  'bank': 'Bank transfer',
  'card': 'Paid using Internation card'
}

class OrderCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDetail: false,
      showCancelReasonInput: false,
      cancelReason: '',
    }
  }
  render() {
    const order = this.props.order
    const subTotal = order.items.reduce( (acc, cur) => acc + (cur.checked ? cur.price : 0), 0 )
    return (
      <div className="w3-card w3-padding" style={{margin: '16px auto', maxWidth: '920px'}}>
        <div className={order.status ==='deleted'?'w3-text-grey italic':'w3-text-blue'}>
          <div className="w3-cell-row">
            <div className="w3-cell">
              <h6 className="bold" style={{textDecoration: order.status === 'deleted'? 'line-through' : 'none'}}>
                <i className="fas fa-receipt" />  #{order.number}
              </h6>
            </div>
            <div className="w3-cell" style={{textAlign: 'right'}}>
              <label className="italic w3-small"> {getDay(order.createdAt)} </label>
            </div>
          </div>
          <div>
            {
              order.items.map(item => {
                return (
                  <div key = {item.code} className="w3-text-blue-grey">
                    {item.name}
                  </div>
                )
              })
            }
          </div>
        </div>
        <div style={{textAlign: 'right', margin: '8px 0'}}>
          {
            this.state.showDetail?
              <span className="w3-small italic cursor-pointer w3-text-blue" style={{textDecoration: 'none'}} onClick={e => this.hideOrderDetail()} >
                hide detail
              </span>
            :
              <span className="w3-small italic cursor-pointer w3-text-blue" style={{textDecoration: 'none'}} onClick={e => this.showOrderDetail()} >
                show detail...
              </span>
          }
        </div>
        {/* Detail order */}
        <div className={`w3-border-top w3-border-grey ${this.state.showDetail?'':'w3-hide'}`} style={{margin: '16px 0'}}>

          <p className="w3-small "> Status: {order.status.toUpperCase()} </p>

          <p className="w3-small ">
            Payment: {' '}
            {
              _dict[order.paymentMethod]
            }
          </p>

          <p className="w3-small ">
            <span className="w3-text-grey"> Delivery to </span> <br />
            <span className="w3-padding bold w3-text-blue-grey"> {order.delivery.fullName} </span> <br/>
            <span className="w3-padding w3-text-blue-grey"> {order.delivery.phone} </span> <br/>
            <span className="w3-padding w3-text-blue-grey"> {order.delivery.address} </span>
          </p>

          <p className="w3-text-grey w3-small"> Item Lists </p>
          <table className="w3-table w3-border w3-bordered w3-small">
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

          {
            /(^new$|^processing$|^delivering$)/.test(order.status)?
              <div style={{margin: '16px 0'}}>
                {
                  !this.state.showCancelReasonInput?
                    <div style={{textAlign: 'right'}}>
                      <button className="w3-button w3-small w3-text-red" onClick={e=>this.showCancelReason()}> <span className="bold">&times;</span> Cancel Order </button>
                    </div>
                  :
                    <div>
                      <p className="italic w3-text-grey w3-small"> Please share us why you would like to cancel this order</p>
                      <textarea className="w3-small w3-text-grey" style={{width: '100%', padding: '3px'}} value={this.state.cancelReason} onChange={e => this.handleReasonInputChange(e)} />
                      <div style={{margin: '8px 0', textAlign: 'right'}}>
                        <button className="w3-button w3-small w3-blue" onClick={e=>this.cancelOrder(order)}> Cancel Order </button>
                      </div>
                    </div>
                }
              </div>
            : null
          }

        </div>
      </div>
    )
  }
  showOrderDetail() {
    this.setState({ showDetail: true })
    return this
  }
  hideOrderDetail() {
    this.setState({ showDetail: false, showCancelReasonInput: false })
    return this
  }
  showCancelReason() {
    this.setState({ showCancelReasonInput: true })
    return this
  }
  hideCancelReason() {
    this.setState({ showCancelReasonInput: false })
    return this
  }
  handleReasonInputChange(e) {
    this.setState({ cancelReason: e.target.value })
    return this
  }
  cancelOrder(order) {
    const number = order.number
    const reason = this.state.cancelReason
    xhttp.delete('/data/orders', {number, reason}, {authen: true}, (status,data) => {
      this.props.hidePopup()
      if (status === 200) {
        this.hideOrderDetail()
        this.props.onOrderDeleted(number)
      } else {
        this.props.showPopup('info', { closeBtn: true, message: `Error ${status}. Please refresh page and try again`, align: 'left' })
      }
    })
  }
}

export default class MyOrders extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const orders = this.props.me.orders
    console.log(orders)
    return (
      <div className="w3-container">
        <div style={{margin: '16px auto', maxWidth: '920px'}}> <h4 className="w3-text-blue"> Orders </h4> </div>
        {
          orders.map(order => (
            <OrderCard key = {order.number} order = {order} {...this.props} />
          ))
        }
      </div>
    )
  }
}
