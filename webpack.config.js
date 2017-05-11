const webpack = require('webpack');
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const prod = (process.env.NODE_ENV === 'production');

/**
 * Generates the bundles. Details of how to use are available in README.md
 */
module.exports = function({ stats } = {}) {
  const config = {
    entry: {
      'koliseo-agenda.min': './src/main.js',
      'polyfill': './src/polyfill.js'
    },
    output: {
      path: path.resolve('./build/'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!alt-ng)/,
          use: [{
            loader: 'babel-loader'
          }]
        }
      ]
    },
    plugins: [

      // save sourcemap next to the files
      new webpack.SourceMapDevToolPlugin({
        filename: 'build/[name].js.map',
        columns: false
      }),


      // minimize JS
      new webpack.optimize.UglifyJsPlugin()
    ]
  }

  // show the composition of the bundles
  if (stats) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }
  return config;

}
