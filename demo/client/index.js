import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import App from './app'
import configureStore from '../app/reducers/configureStore'

const initialState = window.__INITIAL_STATE__
const store = configureStore(initialState)

const render = Component => ReactDOM.render(
  <AppContainer>
    <Component store={store} />
  </AppContainer>,
  document.getElementById('root')
)

render(App)

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./app', () => render(require('./app').default))
  window.onmessage = (e) => {
    if (typeof e.data === 'string' && e.data.startsWith('webpackHotUpdate')) {
      const link = [...document.getElementsByTagName('link')].find(l => l.href.search('style.css') !== -1)
      document.head.appendChild(link.cloneNode())
      setTimeout(() => document.head.removeChild(link), 100)
    }
  }
}
