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
      filename: "app.bundle.js",
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
    // devServer: {
    //   proxy: {
    //     '/api': {
    //       target: 'http://localhost:3400',
    //       pathRewrite: {'^/api' : ''}
    //     }
    //   },
    //   publicPath: "/assets/",
    //   historyApiFallback: true
    // },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new WorkboxPlugin.InjectManifest({
        swDest: 'sw.js',
        swSrc: './src/client/script/sw-template.js',
      })
    ],
};
