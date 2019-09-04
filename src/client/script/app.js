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
acc.sso( (status, user) => {
  console.log(`SSO finished with status code: ${status}`)
  console.log(user)
})

import AppShell from '../Template/AppShell'
import href from '../lib/href'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then ( reg => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })   
  })
}


/*
  Load data from either network or cache and render
*/

(function () {
  const _render = (__data && __data.props) ? hydrate : render
  const renderApp = data => _render (
    <AppShell accountClient = {acc} env = {env} href = {href} path = {href.getPathName()} {...data} />,
    document.getElementById('root')
  )
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
    get('/data/order', {authen: false}).then( response => { // todo: turn authen to true after code is tested
      data.orders = response.orders
      renderApp(data)
    }) // tbd: catch error
  } else {
    /*
      app-shell is served, make a request to get up-to-date data
      if data are in cache and still valid (not expired), they will be served
      else, network request will be made to get data
    */
    Promise.all([get('/data/content'), get('/data/promotion'), get('/data/order', {authen: false})]).then(  values => { // todo: turn authen to true after code is tested
      const data = {...values[0], ...values[1], ...values[2]}
      renderApp(data)
    }) // tbd: catch error
  }

})()

function cacheData(data) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Cache data...')
      data.forEach( ({ url, cacheName, data }) => {
        event.source.postMessage({ type: 'CACHE', url, cacheName, data })
      })
    })
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
