"use strict"

const path = require("path")
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  entry: {
    app: './src/client/script/app.js',
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /(\.js?$)|(\.jsx?$)/,
        use: 'babel-loader',
      }
    ]
  },
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swDest: 'sw.js',
      swSrc: './src/client/script/sw-template.js',
      include: ['/app-shell', /\.js$/, /\.css$/],
      templatedURLs: {
        '/app-shell': new Date().toString(),
      },
    })
  ],
}
