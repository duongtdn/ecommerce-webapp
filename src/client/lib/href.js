"use strict"

const URL = 0
const PROTOCOL = 1
const HOST = 2
const PATH = 3


export default {
  _handlers: { hashChange: [], popState: [] },
  _registeredEventListener: false,
  key: {
    bookmark: '__$_bookmark__'
  },
  getPathName() {
    const path = this._matchFromURL(PATH).replace(/#.*$/,'')
    return path.split('?')[0]
  },
  getUrl() {
    return this._matchFromURL(URL)
  },
  getProtocol() {
    return this._matchFromURL(PROTOCOL).replace(/:.*$/,'')
  },
  getHost() {
    return this._matchFromURL(HOST)
  },
  _matchFromURL(part) {
    const url = window.location.href.replace(/(\/)\1+/g, '/').replace(/:(?=\/)/,":/")
    return url.match(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/)[part].replace(/\/$/,'')
  },
  getQuery() {
    const href = window.location.href.split('?')
    if (!href[1]) {
      return undefined
    }
    const query = {}
    const params = href[1].split('&')
    params.forEach( param => {
      const splitted = param.split('=')
      if (splitted[0]) {
        query[splitted[0]] = (splitted[1] && splitted[1].replace(/#.*$/,'')) || undefined
      }
    })
    return query
  },
  getBookmark() {
    const href = window.location.href.split('#')
    return href[1]
  },
  set(url) {
    location.href = url
  },
  on(event, callback) {

    if (event !== 'hashChange' && event !== 'popState') {
      throw new Error('only accept hashChange and popState in href.on')
    }

    this._handlers[event].push(callback)

    if (this._registeredEventListener) { return }

    window.addEventListener('hashchange',(evt) => {
      this._handlers.hashChange.forEach(handler => handler(evt))
    }, false)
    window.addEventListener('popstate',(evt) => {
      this._handlers.popState.forEach(handler => handler(evt))
    }, false)

    this._registeredEventListener = true
  },
  history() {
    return window.history
  }
}
