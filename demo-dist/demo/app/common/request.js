'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var baseRequest = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(url, method, data) {
    var _this = this;

    var isForm, options;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            isForm = typeof window !== 'undefined' ? data instanceof window.FormData : false;
            _context2.next = 3;
            return sleep(500);

          case 3:
            options = {
              method: method.toUpperCase(),
              credentials: 'include',
              timeout: 5000,
              headers: {
                'Accept': 'application/json'
              }
            };

            if (!isForm) {
              options.headers['Content-Type'] = 'application/json';
            }

            if (options.method !== 'GET' && options.method !== 'DELETE') {
              if (data) options.body = isForm ? data : (0, _stringify2.default)(data);
            } else {
              if (data) {
                url = url + '?' + (0, _keys2.default)(data).map(function (i) {
                  return i + '=' + data[i];
                }).join('&');
              }
            }

            return _context2.abrupt('return', new _promise2.default(function () {
              var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
                var fetch, res, contentType, json, firstKey, text;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        fetch = typeof window !== 'undefined' ? window.fetch : global.fetch;
                        _context.next = 4;
                        return fetch(url, options);

                      case 4:
                        res = _context.sent;

                        if (res.status === 401) {
                          // Event.dispatch('UNAUTHORIZED')
                        }
                        contentType = res.headers.get('content-type');

                        if (!(contentType.indexOf('application/json') !== -1)) {
                          _context.next = 15;
                          break;
                        }

                        _context.next = 10;
                        return res.json();

                      case 10:
                        json = _context.sent;

                        if (res.status !== 200) {
                          firstKey = json && (0, _keys2.default)(json)[0] || '';

                          json._message = json && firstKey && json[firstKey] || '处理错误信息失败';
                        }
                        resolve({
                          status: res.status,
                          json: json
                        });
                        _context.next = 23;
                        break;

                      case 15:
                        if (!(contentType.indexOf('text/plain') !== -1)) {
                          _context.next = 22;
                          break;
                        }

                        _context.next = 18;
                        return res.text();

                      case 18:
                        text = _context.sent;

                        resolve({
                          status: res.status >= 300 ? res.status : 400,
                          json: {
                            _message: '\u4E0D\u652F\u6301\u8FD4\u56DE\u7684\u6570\u636E ' + text
                          }
                        });
                        _context.next = 23;
                        break;

                      case 22:
                        resolve({
                          status: 400,
                          json: {
                            _message: '处理返回数据失败'
                          }
                        });

                      case 23:
                        _context.next = 28;
                        break;

                      case 25:
                        _context.prev = 25;
                        _context.t0 = _context['catch'](0);

                        resolve({
                          status: 400,
                          json: {
                            _message: '\u5904\u7406\u8FD4\u56DE\u6570\u636E\u5931\u8D25 ' + _context.t0.message
                          }
                        });

                      case 28:
                        _context.prev = 28;
                        return _context.finish(28);

                      case 30:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this, [[0, 25, 28, 30]]);
              }));

              return function (_x4, _x5) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function baseRequest(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var sleep = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(time) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', new _promise2.default(function (resolve, reject) {
              setTimeout(function () {
                resolve(null);
              }, time);
            }));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function sleep(_x6) {
    return _ref3.apply(this, arguments);
  };
}();

require('fetch-everywhere');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  get: function get(url, data) {
    return baseRequest(url, 'get', data);
  },
  post: function post(url, data) {
    return baseRequest(url, 'post', data);
  },
  put: function put(url, data) {
    return baseRequest(url, 'put', data);
  },
  delete: function _delete(url, data) {
    return baseRequest(url, 'delete', data);
  }
};