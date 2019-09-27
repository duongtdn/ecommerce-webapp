"use strict"

if (module.hot) { module.hot.accept() }

import React, { Component } from 'react'
import { render, hydrate } from 'react-dom'

import AccountClient from 'account-realm-client'
import { xhttp } from 'authenform-utils'

import _c_env from '../script/env'

const env = window && window._s_env ? _s_env : _c_env

const acc = new AccountClient({
  realm: env.realm,
  app: env.app,
  baseurl: env.urlAccount
})

import AppShell from '../Template/AppShell'
import href from '../lib/href'

const _msgQueue = []

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then ( reg => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })   
  })
  /* if service worker is activated, it will broadcast action init to all clients event though they are not controlled yet */
  navigator.serviceWorker.addEventListener('message', (event) => {
    switch (event.data.action) {
      case 'init':
        if (_msgQueue.length > 0) {
          console.log('Processing message queue...')
          _msgQueue.forEach(msg => event.source.postMessage(msg))
          _msgQueue.splice(0, _msgQueue.length) // clear array
        }
        break
      case 'signin':
        console.log('Client received request to sign-in')
        if (acc && !acc.get('user')) {
          console.log('Client is not signed in, perform local signin')
          acc.lso() // in future, api may changed to signinLocally
        } else {
          console.log('Client is signed in already, no action needed')
        }
        break
      case 'signout':
          console.log('Client received request to sign-out')
          if (acc && acc.get('user')) {
            console.log('Client is signed in, perform local signout')
            acc.signoutLocally()
          } else {
            console.log('Client is signed out already, no action needed')
          }
        break
      default:
    }
  })
}

// broadcase sign-in/signut for all clients
if (acc) {
  acc.on('unauthenticated', () => {
    navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage({ type: 'BROADCAST', action: 'signout' })
  })
  acc.on('authenticated', () => {
    navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage({ type: 'BROADCAST', action: 'signin' })
  })
}

/*
  Load data from either network or cache and render
*/

(function () {
  const _render = (__data && __data.props) ? hydrate : render
  const renderApp = data => {
    _render (
      <AppShell accountClient = {acc} env = {env} href = {href} path = {href.getPathName()} {...data} />,
      document.getElementById('root')
    )
    // after page rendered, perform user lso | sso
    acc.lso( (status, user) => {
      if (status === 200) {
        console.log(`LSO finished with status code: ${status}`)
        console.log(user)
      } else {
        acc.sso( (status, user) => {
          console.log(`SSO finished with status code: ${status}`)
          console.log(user)
        })
      }
    })
  }
  /*
    depend on path:
      - browse/:program -> will load programs and its courses
      - course/:course -> will load course and programs
      - cart -> will load programs
    all programs are required for header, thus need to be available for all pages
    *** notes:
    it is ok to use GET /data to get all programs and courses right now as there're not much courses at beginning
    but later, it should only load relevent courses
    does api GET /data also need a protection mechanism, such as one-time-token?
  */
  if (__data && __data.props) {
    /*
      data are serialized with html page
      so simply cache that data
    */
    const data = __data.props
    cacheData([
      {url: '/data/content', cacheName: 'data-cache', data: { programs: data.programs, courses: data.courses }},
      {url: '/data/promotion', cacheName: 'promotion-cache', data: { promos: data.promos, tags: data.tags }}
    ])
    renderApp(data)
  } else {
    /*
      app-shell is served, make a request to get up-to-date data
      if data are in cache and still valid (not expired), they will be served
      else, network request will be made to get data
    */
    Promise.all([get('/data/content'), get('/data/promotion')]).then(  values => {
      const data = {...values[0], ...values[1]}
      renderApp(data)
    }) // tbd: catch error
  }

})()

function cacheData(data) {
  if ('serviceWorker' in navigator) {
    if (navigator.serviceWorker.controller) {
      console.log('Caching data...')
      data.forEach( ({ url, cacheName, data }) => {
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE', url, cacheName, data })
      })
    } else {
      console.log('Defer Caching data...')
      data.forEach( ({ url, cacheName, data }) => {
        _msgQueue.push({ type: 'CACHE', url, cacheName, data })
      })
    }
  }
}

function get(url, option) {
  return new Promise( (resolve, reject) => {
    xhttp.get(url, option, (status, responseText) => {
      if (status === 200) {
        const data = JSON.parse(responseText)
        resolve(data)
      } else {
        reject(`Request to ${url} failed. Returned status code is ${status}`)
      }
    })
  })
}
