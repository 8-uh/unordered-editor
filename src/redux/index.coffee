{combineReducers, applyMiddleware, createStore} = require 'redux'
thunk = require 'redux-thunk'
{routerMiddleware} = require 'react-router-redux'
{routerReducer} = require 'react-router-redux'

rootReducer = combineReducers {
  router: routerReducer
}

module.exports = (initialState = {}, history) ->
  middleware = applyMiddleware thunk.default, routerMiddleware history
  middleware(createStore) rootReducer, initialState
