'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck')

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2)

var _createClass2 = require('babel-runtime/helpers/createClass')

var _createClass3 = _interopRequireDefault(_createClass2)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

var TextTransformer = (function () {
  function TextTransformer () {
    (0, _classCallCheck3.default)(this, TextTransformer)
  }

  (0, _createClass3.default)(TextTransformer, null, [{
    key: 'transform',
    value: function transform (rows) {
      return rows.map(function (i, index) {
        if (i.endsWith('\n')) {
          return _react2.default.createElement(
            'span',
            { key: index },
            i.slice(0, -1).split(' ').map(function (i, index, arr) {
              return _react2.default.createElement(
                'span',
                { key: index * 2 },
                i,
                index !== arr.length - 1 && _react2.default.createElement(
                  'span',
                  { className: 'space' },
                  '\xB7'
                )
              )
            }),
            _react2.default.createElement(
              'span',
              { className: 'enter' },
              '\xAC'
            )
          )
        } else {
          return _react2.default.createElement(
            'span',
            { key: index },
            i.split(' ').map(function (i, index, arr) {
              return _react2.default.createElement(
                'span',
                { key: index * 2 },
                i,
                index !== arr.length - 1 && _react2.default.createElement(
                  'span',
                  { className: 'space' },
                  '\xB7'
                )
              )
            })
          )
        }
      })
    }
  }])
  return TextTransformer
}())

exports.default = TextTransformer
