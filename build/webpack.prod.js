const Webpack = require('webpack');
const path = require('path');
const webpackConfig = require('./webpack.config');
const WebpackMerge = require('webpackMerge');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = WebpackMerge(webpackConfig, {
  mode: 'production',
  devtool:'cheap-module-source-map', // more options: http://webpack.docschina.org/configuration/devtool/
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: path.resolve(__dirname, '../dist')
    }])
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache:  true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({})
    ],
    splitChunks: { // more options: https://webpack.docschina.org/plugins/split-chunks-plugin/
      chunks:'all',
      cacheGroups:{
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        }
      }
    }
  }
})