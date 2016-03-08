'use strict';

const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  FIREBASE_API: 'https://blazing-torch-9743.firebaseio.com'
});

module.exports = {
  //name: 'client',
  target: 'web',
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'client/src/main.js')
    ]
  },
  devtool: 'source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'client', 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  watch: true,
  plugins: [
    definePlugin,
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      open: false,
      server: {
        baseDir: ['./', './build']
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client/index.html'),
      hash: true,
      filename: 'index.html',
      inject: 'body'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'client/src'),
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime', 'transform-class-properties'],
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader?prefix=images/&name=[path][name].[ext]'
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  externals: {
    'phaser': 'Phaser'
  }
};
