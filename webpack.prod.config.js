var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: ['./src/style/base.styl', './src/index.js'],
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: ['css-loader', 'sass-loader']
          }),
          scss: ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: ['css-loader', 'sass-loader']
          })
        },
        postcss: [require('autoprefixer')]
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.styl$/,
      use: ExtractTextPlugin.extract({
        fallback: 'vue-style-loader',
        use: ['css-loader', 'stylus-loader']
      })
    }]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ExtractTextPlugin('bundle.css'),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(process.env.VERSION),
        GA_TRACKING_CODE: JSON.stringify(process.env.GA_TRACKING_CODE),
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({sourceMap: true})
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {helpers: path.join(__dirname, '/src/helpers')}
  },
  devtool: 'source-map'
}
