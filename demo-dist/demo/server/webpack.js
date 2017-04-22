'use strict';

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpackConfig = require('../scripts/webpack.config.js');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_webpackConfig2.default.output.publicPath = '//' + _config2.default.ipv4 + ':' + _config2.default.webpackPort + '/';

new _webpackDevServer2.default((0, _webpack2.default)(_webpackConfig2.default), {
  publicPath: _webpackConfig2.default.output.publicPath,
  hot: true,
  stats: { colors: true }
}).listen(_config2.default.webpackPort, '0.0.0.0', function () {
  console.log('webpack hot server is listening on port ' + _config2.default.webpackPort);
});