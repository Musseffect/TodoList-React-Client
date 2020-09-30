const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  devtool: 'inline-source-map',//'source-map' for production
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    port: 9000 
  },
  plugins:
  [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('debug')
      })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  watch: false,
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules:[
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use:{
          loader: "babel-loader"
        }
      }
    ]
  }
};