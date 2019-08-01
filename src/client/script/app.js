"use strict"

if (module.hot) { module.hot.accept() }

import React, { Component } from 'react'
import { render } from 'react-dom'



import AppShell from '../Template/AppShell'

render(
  <AppShell />,
  document.getElementById('root')
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/assets/sw.js');
  });
}
