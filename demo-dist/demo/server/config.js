'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  serverPort: 2003,
  webpackPort: 20003,
  ipv4: function () {
    var IPv4 = '127.0.0.1';
    var interfaces = _os2.default.networkInterfaces();
    for (var key in interfaces) {
      interfaces[key].forEach(function (details) {
        if (details.family === 'IPv4' && key === 'en0') {
          IPv4 = details.address;
        }
      });
    }
    return IPv4;
  }()
};