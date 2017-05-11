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
          // babel
          // overwrites .babelrc to use with the browser
          test: /\.js$/,
          exclude: /node_modules\/(?!alt-ng)/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                // tree shaking. See http://jakewiesler.com/tree-shaking-es6-modules-in-webpack-2/
                ['es2015', { modules: false }], 
              ], 
              "plugins": [
                "transform-object-rest-spread",
                ["transform-react-jsx", { "pragma": "h" }],
                // replace react as it's used by AltContainer
                ["module-resolver", { "alias": { "react": "preact-compat" } }]
              ]
            }
          }]
        }
      ]
    },
    plugins: [

      // save sourcemap next to the files
      new webpack.SourceMapDevToolPlugin({
        filename: '[name].js.map',
        columns: false
      }),

    ]
  }

  // show the composition of the bundles
  if (stats) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  // minimize JS
  if (prod) {
    new webpack.optimize.UglifyJsPlugin()
  }

  return config;

}
