React = require 'react'
{render} = require 'react-dom'
{syncHistoryWithStore} = require 'react-router-redux'
{useRouterHistory} = require 'react-router'
createBrowserHistory = require 'history/lib/createBrowserHistory'

App = require './app'
routes = require './routes'
configureStore = require '../redux'

history = useRouterHistory(createBrowserHistory)()

initialState = window.__INITIAL_STATE__
store = configureStore(initialState, history)
history = syncHistoryWithStore(history, store, {
  selectLocationState: (state) => state.router
})


render <App history={history} store={store} routes={routes} />, document.getElementById('app')
