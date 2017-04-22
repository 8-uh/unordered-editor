'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = exports.types = undefined;

var _redux = require('../common/redux');

var types = exports.types = {
  SIGN_IN_REQUEST: 'SIGN_IN_REQUEST',
  SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE: 'SIGN_IN_FAILURE'
};

var initialState = {
  signInRequesting: false,
  auth: null
};

exports.default = (0, _redux.createReducer)(initialState, types);
var actions = exports.actions = {
  signIn: function signIn(name, password) {
    return { type: types.SIGN_IN_REQUEST, payload: { signInRequesting: true }, name: name, password: password };
  }
};