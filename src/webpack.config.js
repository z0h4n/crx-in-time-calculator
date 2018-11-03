const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = {
  entry: "./app/main.js",
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        loader: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'app', 'components'),
      Services: path.resolve(__dirname, 'app', 'services'),
      Mixins: path.resolve(__dirname, 'app', 'mixins')
    }
  },
  target: "web",
  plugins: [
    new CleanWebpackPlugin(
      ['.././build'],
      { allowExternal: true }
    ),
    new CopyWebpackPlugin([
      { from: './chrome/*', to: path.resolve(__dirname, '..', 'build'), flatten: true },
      { from: './app/css', to: path.resolve(__dirname, '..', 'build/css') },
      { from: './app/fonts', to: path.resolve(__dirname, '..', 'build/fonts') }
    ]),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/scoped.css'
    })
  ]
};

module.exports = config;