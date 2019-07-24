const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {

  entry: [
    './src/client/script/app.js'
  ],

  plugins: [
    new WorkboxPlugin.InjectManifest({
      swDest: 'sw.js',
      swSrc: './src/client/script/sw-template.js',
    })
  ],

  mode: 'development',
  devtool: 'inline-source-map'
};