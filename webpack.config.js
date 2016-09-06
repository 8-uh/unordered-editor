var path = require('path')
var webpack = require('webpack')
var precss = require('precss')
var autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/main/main.cjsx')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.cjsx', '.coffee']
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css?modules&importLoaders=1!postcss'},
      {test: /\.cjsx$/, loaders: ['react-hot', 'coffee', 'cjsx']},
      {test: /\.coffee$/, loaders: ['coffee']},
      {test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file'}
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    // new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}})
  ],
  postcss: [
    autoprefixer({
      browsers: ['> 5%', 'last 4 versions']
    }),
    precss,
  ]
}
