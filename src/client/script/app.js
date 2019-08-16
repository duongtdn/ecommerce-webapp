"use strict"

if (module.hot) { module.hot.accept() }

import React, { Component } from 'react'
import { render, hydrate } from 'react-dom'

import AccountClient from 'account-realm-client'
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

if (__data && __data.props) {
  hydrate(
    <AppShell accountClient = {acc} env = {env} href = {href} path = {href.getPathName()} {...__data.props} />,
    document.getElementById('root')
  )
} else {
  // client check path to load correct data??
  const path = href.getPathName()
  render(
    <AppShell accountClient = {acc} env = {env} href = {href} path = {path} />,
    document.getElementById('root')
  )
}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
