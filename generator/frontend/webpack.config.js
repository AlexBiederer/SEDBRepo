var debug = process.env.NODE_ENV !== "production";
// for converting SASS to CSS and moving it to the right CSS-folder
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // for minfiying CSS
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,
  entry: ["./app/js/index.js"],
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, "/dist/js"),
    publicPath: "/dist/js",
    filename: "app.js"
  },
  module: {
    rules: debug ? [{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.js$/, // include .js files
        enforce: "pre", // preload the jshint loader
        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        use: [{
          loader: "jshint-loader"
        }]
      },
      {
        test: /\.css$/, // css files,
        use: ["style-loader", "css-loader"] // <- for debugging
        //loader: ExtractTextPlugin.extract('css!sass') // <- for production
      },
      {
        test: /\.scss$/, // scss files
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"] // <- for debugging
        //loader: ExtractTextPlugin.extract('css!sass') // <- for production
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory=true'
      }
    ] : [{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'sass-loader']
      }) // <- for production
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader?cacheDirectory=true'
    }]
  },
  devServer: {
    stats: 'errors-only',
    contentBase: "./",
    inline: true // Important for source-maps
  },
  plugins: debug ? [
    new webpack.IgnorePlugin(/vertx/), // disable es6-promise.auto.min (polyfill) webpack warning
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
        Popper: ['popper.js', 'default']
      })
  ] : [ // plugins for build mode
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
        Popper: ['popper.js', 'default']
      }),
    new ExtractTextPlugin({
      filename: '../../dist/css/style.css',
      disable: false,
      allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      }
    })
  ]
};
