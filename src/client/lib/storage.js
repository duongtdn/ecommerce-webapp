"use strict"

export default {
  key: { CART: '__$_cart__'},
  observe(key, handler, flag=true) {
    if (typeof handler === 'number' && !flag) {
      return this._removeObserver(key, handler)
    } else if (typeof handler === 'function' && flag) {
      return this._addObserver(key, handler)
    }
  },
  update(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
    this._fire(key, data)
  },
  get(key) {
    const data = localStorage.getItem(key)
    if (data && data.length > 0) {
      return JSON.parse(data)
    } else {
      return null
    }
  },
  clear(key) {
    localStorage.removeItem(key)
    this._fire(key, null)
  },
  _handlers: {},
  _addObserver(key, handler) {
    if (this._handlers[key] === undefined) {
      this._handlers[key] = { cnt: 0 }
    }
    const cnt = this._handlers[key].cnt++
    this._handlers[key][cnt] = handler
    return cnt
  },
  _removeObserver(key, handlerIndex) {
    if (this._handlers[key][handlerIndex]) {
      delete this._handlers[key][handlerIndex]
    }
  },
  _fire(key, data) {
    if (this._handlers[key]) {
      Object.keys(this._handlers[key]).forEach( h => {
        if (typeof this._handlers[key][h] === 'function') {
          this._handlers[key][h](data)
        }
      })
    }
  }
}
