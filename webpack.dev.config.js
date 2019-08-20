"use strict"

const webpack = require('webpack')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    entry: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      './src/client/script/app.js'
    ],
    output: {
      filename: "app.js",
      publicPath: "/assets/",
      // path: path.resolve(__dirname, "tests"),
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
};
