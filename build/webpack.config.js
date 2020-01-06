// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 将生成的js注入到html中，同时可配置多入口文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清除多余的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development", // 开发模式
  entry: {
    main: ['@babel/polyfill', path.resolve(__dirname, "../src/main.js")], // main 入口文件,babel-polyfill将新的api转换为es5相关语法实现(如Generator, Promise等)
    header: path.resolve(__dirname, "../src/header.js") // header 入口文件
  },
  output: {
    filename: "[name].[hash:8].js", // 打包后的文件名称
    path: path.resolve(__dirname, "../dist") // 打包后的目录
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"] // 从右向左解析原则
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader', // 将es6,es7的新语法转换为es5语法
          options: {
            presets: ['@babel/preset-env']
          }
        }],
        exclude: /node-modules/
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, // 将js中的css单独提取到某css文件中（类似webpack4之前的extract-text-webpack-plugin）
          // "style-loader", // 将生成的css通过style标签注入到html中
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")]
            }
          },
          "less-loader"
        ] // 从右向左解析原则
      },
      {
        test: /\.(jpe?g|png|gif)$/i, // 图片文件
        use: [
          {
            loader: "url-loader", // 与file-loader搭配使用，如果目标文件呢小于limit大小，则转换为base64存储，否则通过file-loader移动到输出目录中
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader", // 将文件在进行一些处理后（主要是处理文件名和路径、解析文件url），并将文件移动到输出的目录中
                options: {
                  name: "img/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 媒体文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "media/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "fonts/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 默认删除<PROJECT_DIR>/dist/文件夹
    // 多文件入口
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
      filename: "index.html",
      chunks: ["main"] // 与入口文件对应的模块名
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/header.html"),
      filename: "header.html",
      chunks: ["header"] // 与入口文件对应的模块名
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].css"
    })
  ]
};
