import os from 'os'

export default {
  serverPort: 2003,
  webpackPort: 20003,
  ipv4: (function () {
    let IPv4 = '127.0.0.1'
    const interfaces = os.networkInterfaces()
    for (var key in interfaces) {
      interfaces[key].forEach(function (details) {
        if (details.family === 'IPv4' && key === 'en0') {
          IPv4 = details.address
        }
      })
    }
    return IPv4
  })()
}
