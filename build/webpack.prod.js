const Webpack = require("webpack");
const path = require("path");
const webpackConfig = require("./webpack.config");
const WebpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const ZipPlugin = require("./zipPlugin");

process.env.NODE_ENV = "production";

module.exports = WebpackMerge(webpackConfig, {
  mode: "production",
  devtool: "cheap-module-source-map", // more options: http://webpack.docschina.org/configuration/devtool/
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: path.resolve(__dirname, "../dist"),
      },
    ]),
    new ZipPlugin({
      filename: "offline", // 压缩包名称
    }),
  ],
  optimization: {
    minimizer: [
      // new UglifyJsPlugin({
      //   cache:  true,
      //   parallel: true,
      //   sourceMap: true
      // }),
      new ParallelUglifyPlugin({
        uglifyJS: {
          output: {
            comments: false, // 是否保留代码中的注释
            beautify: true, // 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出
          },
          compress: {
            drop_console: false, //  是否删除代码中所有的console语句，默认为false
            collapse_vars: true, // 是否内嵌虽然已经定义了，但是只用到一次的变量， 默认值false
            reduce_vars: true, //  是否提取出现了多次但是没有定义成变量去引用的静态值，默认为false
          },
          // cacheDir: '', //  用作缓存的可选绝对路径。如果未提供，则不使用缓存。
          // sourceMap: true, //  可选布尔值。是否为压缩后的代码生成对应的Source Map(浏览器可以在调试代码时定位到源码位置了),这会减慢编译速度。默认为false
        },
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
    splitChunks: {
      // more options: https://webpack.docschina.org/plugins/split-chunks-plugin/
      chunks: "all",
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial", // 只打包初始时依赖的第三方
        },
      },
    },
  },
});
