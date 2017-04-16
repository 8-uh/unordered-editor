import {combineReducers, applyMiddleware, createStore} from 'redux'
import createSagaMiddleware, {END} from 'redux-saga'

import reducers from './index'
import sagas from '../sagas'

const rootReducer = combineReducers({
  ...reducers
})

const sagaMiddleware = createSagaMiddleware()

export default (initialState) => {
  const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware))
  store.runSaga = sagaMiddleware.run
  store.rootTask = store.runSaga(sagas)
  store.stopSaga = () => {
    store.dispatch(END)
  }
  return store
}
