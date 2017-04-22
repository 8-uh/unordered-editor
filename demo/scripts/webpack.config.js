const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, '../client/index.js'),
      path.resolve(__dirname, '../app/styles/index.scss'),
      path.resolve(__dirname, '../../src/index.scss')
    ],
    vender: [
      'react',
      'react-dom'
    ],
    common: [
      'react-router-dom',
      'react-router-config',
      'fetch-everywhere',
      'react-redux',
      'redux',
      'redux-saga'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../demo-dist/public'),
    publicPath: '/',
    library: 'UWEB',
    libraryTarget: 'umd'
  },
  plugins: [
    new ExtractTextPlugin({filename: 'style.css', allChunks: true}),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vender', 'common'],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  resolve: {
    extensions: ['.js', '.coffee']
  },
  module: {
    rules: [
      {
        test: /\.coffee$/,
        include: path.resolve(__dirname, '../../src'),
        use: 'coffee-loader'
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../src')],
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../src')],
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
  module.exports.entry.app.unshift(
    'react-hot-loader/patch',
    'webpack-dev-server/client',
    'webpack/hot/only-dev-server'
  )
} else {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}))
  module.exports.plugins.push(new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {discardComments: {removeAll: true}},
    canPrint: true
  }))
}
