import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import WebpackConfig from '../scripts/webpack.config.js'
import config from './config'

WebpackConfig.output.publicPath = `//${config.ipv4}:${config.webpackPort}/`

new WebpackDevServer(Webpack(WebpackConfig), {
  publicPath: WebpackConfig.output.publicPath,
  hot: true,
  stats: {colors: true}
}).listen(config.webpackPort, '0.0.0.0', function() {
  console.log(`webpack hot server is listening on port ${config.webpackPort}`)
})
