var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    './src/style/base.styl',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: 'vue-style-loader!css-loader!sass-loader',
          scss: 'vue-style-loader!css-loader!sass-loader'
        },
        postcss: [require('autoprefixer')]
      }
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        babelrc: false,
        extends: path.join(__dirname, '/src/components/.babelrc')
      }
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(process.env.VERSION),
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      helpers: path.join(__dirname, '/src/helpers'),
      style: path.join(__dirname, '/src/style')
    }
  },
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, '/public'),
    hot: true,
    proxy: {
      '*': 'http://localhost:8080'
    },
    historyApiFallback: true,
    stats: {
      chunks: false
    }
  },
  devtool: 'eval-source-map'
}
