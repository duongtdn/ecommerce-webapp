"use strict"

import React, { Component } from 'react'

import { getDay } from '../../lib/util'

export default class MyOrders extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const orders = this.props.me.orders
    console.log(orders)
    return (
      <div className="w3-container">
        {
          orders.map( order => {
            return (
              <div key = {order.number} className="w3-card w3-padding" style={{margin: '16px 0'}}>
                <div className="w3-cell-row">
                  <div className="w3-cell">
                    <h6 className="bold w3-text-blue"> <i className="fas fa-receipt" />  #{order.number} </h6>
                  </div>
                  <div className="w3-cell" style={{textAlign: 'right'}}>
                    <label className="italic w3-small"> {getDay(order.createdAt)} </label>
                  </div>
                </div>
                <div>
                  <div>{
                    order.items.map(item => {
                      return (
                        <div key = {item.code} className="w3-text-blue-grey">
                          {item.name}
                        </div>
                      )
                    })
                  }</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p className="w3-small italic cursor-pointer"> show detail... </p>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
