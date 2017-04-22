'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var renderFullPage = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(path, query) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', new _promise2.default(function (resolve, reject) {
              var store = (0, _configureStore2.default)({});
              var promises = [];
              var mapRoutes = function mapRoutes(routes) {
                routes.map(function (route) {
                  if (route.component) {
                    var match = (0, _reactRouterDom.matchPath)(path, route);
                    if (match) {
                      if (route.component.loadData) {
                        promises.push({ match: match, loadData: route.component.loadData });
                      }
                      if (route.routes) {
                        mapRoutes(route.routes);
                      }
                    }
                  }
                });
              };
              mapRoutes(_routes2.default);
              promises.map(function (i) {
                return i.loadData({ store: store });
              });
              store.stopSaga();
              store.rootTask.done.then(function () {
                var context = {};
                var markup = (0, _server.renderToString)(_react2.default.createElement(
                  _reactRedux.Provider,
                  { store: store },
                  _react2.default.createElement(
                    _reactRouterDom.StaticRouter,
                    { location: path, context: context },
                    (0, _reactRouterConfig.renderRoutes)(_routes2.default)
                  )
                ));
                resolve((0, _server.renderToString)(_react2.default.createElement(HTML, { content: markup, store: store })));
              });
            }));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function renderFullPage(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRedux = require('react-redux');

var _reactRouterDom = require('react-router-dom');

var _reactRouterConfig = require('react-router-config');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaStaticCache = require('koa-static-cache');

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _routes = require('../app/routes');

var _routes2 = _interopRequireDefault(_routes);

var _configureStore = require('../app/reducers/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isProduction = process.env.NODE_ENV === 'production';

var server = new _koa2.default();

server.use((0, _koaConvert2.default)((0, _koaStaticCache2.default)(_path2.default.resolve(__dirname, '../../public'), {
  gzip: true,
  dynamic: true
})));

server.use(function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var _ctx$request, path, query;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ctx$request = ctx.request, path = _ctx$request.path, query = _ctx$request.query;
            _context.prev = 1;
            _context.next = 4;
            return renderFullPage(path, query);

          case 4:
            ctx.body = _context.sent;
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](1);

            ctx.body = _context.t0.message;

          case 10:
            _context.t1 = next;

            if (!_context.t1) {
              _context.next = 14;
              break;
            }

            _context.next = 14;
            return next();

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var HTML = function HTML(_ref2) {
  var content = _ref2.content,
      store = _ref2.store;
  return _react2.default.createElement(
    'html',
    null,
    _react2.default.createElement(
      'head',
      null,
      _react2.default.createElement('meta', { charSet: 'UTF-8' }),
      _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' }),
      _react2.default.createElement(
        'title',
        null,
        'U-WEB'
      ),
      _react2.default.createElement('link', { rel: 'stylesheet', href: isProduction ? '/style.css' : '//' + _config2.default.ipv4 + ':' + _config2.default.webpackPort + '/style.css' })
    ),
    _react2.default.createElement(
      'body',
      null,
      _react2.default.createElement('div', { id: 'root', dangerouslySetInnerHTML: { __html: content } }),
      store && _react2.default.createElement('script', { dangerouslySetInnerHTML: { __html: 'window.__INITIAL_STATE__=' + (0, _stringify2.default)(store.getState()) + ';' } }),
      _react2.default.createElement('script', { src: isProduction ? '/common.js' : '//' + _config2.default.ipv4 + ':' + _config2.default.webpackPort + '/common.js' }),
      _react2.default.createElement('script', { src: isProduction ? '/vender.js' : '//' + _config2.default.ipv4 + ':' + _config2.default.webpackPort + '/vender.js' }),
      _react2.default.createElement('script', { src: isProduction ? '/app.js' : '//' + _config2.default.ipv4 + ':' + _config2.default.webpackPort + '/app.js' })
    )
  );
};

server.listen(_config2.default.serverPort, function () {
  console.log('server is listening on port ' + _config2.default.serverPort);
});