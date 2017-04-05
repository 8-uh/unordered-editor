import {combineReducers, applyMiddleware, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {routerReducer, routerMiddleware} from 'react-router-redux'

import sagas from '../sagas'
import reducers from './index'

const rootReducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

const sagaMiddleware = createSagaMiddleware()

export default (initialState, history) => {
  const store = createStore(rootReducer, applyMiddleware(routerMiddleware(history), sagaMiddleware))
  sagaMiddleware.run(sagas)
  return store
}
