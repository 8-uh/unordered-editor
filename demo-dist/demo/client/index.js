'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactHotLoader = require('react-hot-loader');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _configureStore = require('../app/reducers/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = window.__INITIAL_STATE__;
var store = (0, _configureStore2.default)(initialState);

var render = function render(Component) {
  return _reactDom2.default.render(_react2.default.createElement(
    _reactHotLoader.AppContainer,
    null,
    _react2.default.createElement(Component, { store: store })
  ), document.getElementById('root'));
};

render(_app2.default);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./app', function () {
    return render(require('./app').default);
  });
  window.onmessage = function (e) {
    if (typeof e.data === 'string' && e.data.startsWith('webpackHotUpdate')) {
      var link = [].concat((0, _toConsumableArray3.default)(document.getElementsByTagName('link'))).find(function (l) {
        return l.href.search('style.css') !== -1;
      });
      document.head.appendChild(link.cloneNode());
      setTimeout(function () {
        return document.head.removeChild(link);
      }, 100);
    }
  };
}