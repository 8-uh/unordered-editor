var path = require('path')
var webpack = require('webpack')
var precss = require('precss')
var autoprefixer = require('autoprefixer')

module.exports = {
  entry: './test/main.cjsx',
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.cjsx', '.coffee']
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css?modules&importLoaders=1&localIdentName=[path]-[name]-[local]!postcss'},
      {test: /\.cjsx$/, loaders: ['coffee', 'cjsx']},
      {test: /\.coffee$/, loaders: ['coffee']}
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    // new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}})
  ],
  postcss: [
    autoprefixer({
      browsers: ['> 4%', 'last 4 versions']
    }),
    precss,
  ]
}
