"use strict"

if (module.hot) { module.hot.accept() }

import React, { Component } from 'react'
import { render } from 'react-dom'

import AccountClient from 'account-realm-client'
import { UserProvider } from 'react-user'

import _c_env from './env'

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

render(
  <UserProvider accountClient = {acc} >
    <AppShell env = {env} />
  </UserProvider>,
  document.getElementById('root')
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/assets/sw.js');
  });
}
