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

const renderApp = (__data && __data.props) ? hydrate : render

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then ( reg => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
      loadDataAndRender()
    })   
  })
} else {
  loadDataAndRender()
}

function loadDataAndRender() {
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
  console.log('Loading data')
  xhttp.get('/data', (status, responseText) => {
    if (status === 200) {
      const data = JSON.parse(responseText)
      console.log('Loaded data')
      console.log(data)
      renderApp(
        <AppShell accountClient = {acc} env = {env} href = {href} path = {href.getPathName()} {...data} />,
        document.getElementById('root')
      )
    } else {
      console.log(`Error when getting data. Returned status code is ${status}`)
    }
  })
}