"use strict"

if (module.hot) { module.hot.accept() }

import React, { Component } from 'react'
import { render, hydrate } from 'react-dom'

import AccountClient from '@realmjs/account-client'
import xhttp from '@realmjs/xhttp-request'

import _c_env from '../script/env'

const env = window && window._s_env ? _s_env : _c_env

const acc = new AccountClient({
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
  self.addEventListener('install', event => {
    self.skipWaiting()
  })
  self.addEventListener('activate', event => {
    event.waitUntil(clients.claim())
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
          acc.signinLocally()
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

// broadcast sign-in/signut for all clients
if (acc) {
  acc.on('unauthenticated', () => {
    navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage({ type: 'BROADCAST', action: 'signout' })
  })
  acc.on('authenticated', (user) => {
    navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage({ type: 'BROADCAST', action: 'signin' })
    console.log(user)
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
    // after page rendered, perform user sign-in
    acc.signinLocally( (status, user) => {
      if (status === 200) {
        console.log(`Sing-in locally finished with status code: ${status}`)
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
      {url: '/data/promotion', cacheName: 'promotion-cache', data: { promos: data.promos }}
    ])
    renderApp(data)
  } else {
    /*
      app-shell is served, make a request to get up-to-date data
      if data are in cache and still valid (not expired), they will be served
      else, network request will be made to get data
      FOR NOW, SINCE THERE ARE FEW COURSES AND ONLY A SINGLE PROGRAM, IT IS OK TO LOAD ALL CONTENT AT STARTUP
      ***********To-be Enhance
      Depending on the path:
        + /browse/:program - all courses of that program are loaded
        + /course/:course - only that course is loaded
      Problems arise for paths such as /mycourses, /myorders... --> what courses should be loaded?
        --> loaded courses can be known from /me
            + orders -> for /myorders
            + enrolls -> for /mycourses
        however, /me is requested by <AppShell />. Therefore, courses can be empty [] here, and be aggregated later by AppShell when signed-in
        ex:
           by app.js: courses = ['c-01', 'c-02'] // courses belong to program p-01
           by AppShell: courses += ['c-03', 'c-04'] // courses users has enrolled, belong to program p-02
      For improve cache:
        + must sort courses by id.
        + when fetched courses by a program or enrolled, create cache for each course, i.e. /data/courses?c=<id>
    */
    /*
    const splittedPath = href.getPathName().split("/")
      let query = null
      if (splittedPath && splittedPath[0]) {
        if (splittedPath[0] === 'browse') {
          query = `p=${splittedPath[1]}`
        } else if (splittedPath[0] === 'course') {
          query = `c=${splittedPath[1]}`
        }
      }
      const dataToLoad = [get('/data/program'), get('/data/promotion')]
      if (query) { dataToLoad.push(get(`/data/course?${query}`))}
      Promise.all(dataToLoad).then(  values => {
        const data = {...values[0], ...values[1], ...values[2]}
        console.log(data)
        renderApp(data)
      }) // tbd: catch error
    */

    const t = setTimeout( () => {
      render(
        <div className="w3-container" style={{textAlign: 'center', padding: '128px 8px'}}>
          <i className="w3-xxlarge fas fa-spinner w3-spin" />
          <h3 className="w3-text-blue">Loading</h3>
        </div>,
        document.getElementById('root')
      )
    }, 500)

    Promise.all([get('/data/content'), get('/data/promotion')]).then(  values => {
      clearTimeout(t)
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
    xhttp.get(url, option)
    .then( ({status, responseText}) => {
      if (status === 200) {
        const data = JSON.parse(responseText)
        resolve(data)
      } else {
        reject(`Request to ${url} failed. Returned status code is ${status}`)
      }
    })
  })
}
