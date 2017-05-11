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
          // overwrites .babelrc to remove CommonJS support
          test: /\.js$/,
          exclude: /node_modules\/(?!alt-ng)/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                // tree shaking. See http://2ality.com/2015/12/webpack-tree-shaking.html
                ['es2015', { modules: false }], 
              ], 
              "plugins": [
                "transform-object-rest-spread",
                ["transform-react-jsx", { "pragma": "h" }],
                ["module-resolver", { "alias": { "react": "preact-compat" } }]
              ]
            }
          }]
        }
      ]
    },
    plugins: [

      new webpack.SourceMapDevToolPlugin({
        filename: '[name].js.map',
        columns: false
      }),

    ]
  }

  if (stats) {
    // show the composition of the bundles
    config.plugins.push(new BundleAnalyzerPlugin());
  }
/*
  if (prod) {
    // minimize JS
    new webpack.optimize.UglifyJsPlugin()
  }
*/
  return config;

}
