'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _sagas = require('../sagas');

var _sagas2 = _interopRequireDefault(_sagas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)((0, _extends3.default)({}, _index2.default));

var sagaMiddleware = (0, _reduxSaga2.default)();

exports.default = function (initialState) {
  var store = (0, _redux.createStore)(rootReducer, initialState, (0, _redux.applyMiddleware)(sagaMiddleware));
  store.runSaga = sagaMiddleware.run;
  store.rootTask = store.runSaga(_sagas2.default);
  store.stopSaga = function () {
    store.dispatch(_reduxSaga.END);
  };
  return store;
};