'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.signIn = signIn;
exports.default = _callee;

var _effects = require('redux-saga/effects');

var _auth = require('../reducers/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [signIn, _callee].map(_regenerator2.default.mark);

function signIn(action) {
  var name, password, result;
  return _regenerator2.default.wrap(function signIn$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          name = action.name, password = action.password;
          _context.next = 3;
          return mockSignIn(name, password);

        case 3:
          result = _context.sent;
          _context.next = 6;
          return (0, _effects.put)({
            type: _auth.types.SIGN_IN_SUCCESS,
            payload: {
              auth: result
            }
          });

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function _callee() {
  return _regenerator2.default.wrap(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.fork)(function () {
            return (0, _effects.takeLatest)(_auth.types.SIGN_IN_REQUEST, signIn);
          });

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

function mockSignIn(name, password) {
  return new _promise2.default(function (resolve, reject) {
    setTimeout(function () {
      resolve({ name: 'unordered' });
    }, 2000);
  });
}