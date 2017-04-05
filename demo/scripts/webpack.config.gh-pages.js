const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: [
    path.resolve(__dirname, '../client/gh-pages-index.js'),
    path.resolve(__dirname, '../app/styles/index.scss'),
    path.resolve(__dirname, '../../src/index.scss')
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../demo-dist/gh-pages'),
    publicPath: '/',
    library: "UWEB",
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new ExtractTextPlugin({filename: "style.css", allChunks: true})
  ],
  externals: {
    'react': {commonjs: 'react', commonjs2: 'react', amd: 'react', root: 'React'},
    'react-dom': {commonjs: 'react-dom', commonjs2: 'react-dom', amd: 'react-dom', root: 'ReactDOM'},
    'react-addons-css-transition-group': {commonjs: 'react-addons-css-transition-group', commonjs2: 'react-addons-css-transition-group', amd: 'react-addons-css-transition-group', root: ['React', 'addons', 'CSSTransitionGroup']},
    'react-router': {commonjs: 'react-router', commonjs2: 'react-router', amd: 'react-router', root: 'ReactRouter'}
  },
  module: {
    rules: [
      {test: /\.js$/, include: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../src')], use: 'babel-loader'},
      {
        test: /\.scss$/, include: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../src')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('precss'),
                require('autoprefixer')
              ]
            }
          }, 'sass-loader']
        })
      }
    ]
  }
}

if (process.env.NODE_ENV !== 'production') {
  module.exports.plugins.push(new webpack.HotModuleReplacementPlugin())
  module.exports.plugins.push(new webpack.NamedModulesPlugin())
  module.exports.entry.unshift(
    'webpack-dev-server/client',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch'
  )
} else {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}))
  module.exports.plugins.push(new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {discardComments: {removeAll: true}},
    canPrint: true
  }))
  module.exports.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }))
}
