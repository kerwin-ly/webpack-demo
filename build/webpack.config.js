// webpack.config.js
const path = require("path");
const os = require('os');
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 将生成的js注入到html中，同时可配置多入口文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清除多余的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const Webpack = require("webpack");
const HappyPack = require('happypack');
const RemoveLogPlugin = require('./removeLogPlugin');
// const CopyWebpackPlugin = require("copy-webpack-plugin");

const devMode = process.env.NODE_ENV === 'development'; // 判断是否为开发环境打包

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  entry: {
    main: ["@babel/polyfill", path.resolve(__dirname, "../src/main.js")], // main 入口文件,babel-polyfill将新的api转换为es5相关语法实现(如Generator, Promise等)
    header: path.resolve(__dirname, "../src/header.js") // header 入口文件
  },
  output: {
    path: path.resolve(__dirname, "../dist"), // 打包后的目录
    filename: "static/js/[name].[hash:8].js" // 打包后的文件名称
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"],
        include: [path.resolve(__dirname, '../src')], // 只在src目录下进行查找转换
        exclude: /node_modules/ // 排除node_modules查找
      },
      {
        test: /\.css$/,
        // use: ["style-loader", "css-loader"] // 从右向左解析原则
        use: [
          {
            loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../dist/css",
              hmr: devMode
            }
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")]
            }
          }
        ],
        include: [path.resolve(__dirname, '../src/assets')], // 只在src/assets目录下进行查找转换
        exclude: /node_modules/ // 排除node_modules查找
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../dist/css",
              hmr: devMode
            }
          },
          // MiniCssExtractPlugin.loader, // 将js中的css单独提取到某css文件中（类似webpack4之前的extract-text-webpack-plugin）
          // "style-loader", // 将生成的css通过style标签注入到html中
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")]
            }
          }
        ], // 从右向左解析原则
        include: [path.resolve(__dirname, '../src')], // 只在src目录下进行查找转换,vue文件中可能也有less scope
        exclude: /node_modules/ // 排除node_modules查找
      },
      {
        test: /\.js$/,
        use: [
          {
            // loader: ["babel-loader"], // 将es6,es7的新语法转换为es5语法
            // options: {
            //   presets: ["@babel/preset-env"]
            // }
            loader: 'happypack/loader?id=happyBabel'
          }
        ],
        include: [path.resolve(__dirname, '../src')], // 只在src目录下进行查找转换
        exclude: /node-modules/
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
        ],
        include: [path.resolve(__dirname, '../src/assets/images')],
        exclude: /node-modules/
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
        ],
        include: [path.resolve(__dirname, '../src/assets/media')],
        exclude: /node-modules/
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
        ],
        include: [path.resolve(__dirname, '../src/assets/fonts')],
        exclude: /node-modules/
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.runtime.esm.js",
      " @": path.resolve(__dirname, "../src")
    },
    extensions: ["*", ".js", ".json", ".vue"]
  },
  plugins: [
    new HappyPack({
      id: 'happyBabel', // 与loader对应的id标识
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ["@babel/preset-env", { modules: false }] // modules: false
          ],
          cacheDirectory: true
        }
      }],
      threadPool: happyThreadPool // 进程池
    }),
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
      filename: devMode ? "static/css/[name].css" : "static/css/[name].[hash].css",
      chunkFilename: devMode ? "static/css/[id].css" : "static/css/[id].[hash].css"
    }),
    new VueLoaderPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new RemoveLogPlugin()
    // new Webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./vendor-manifest.json')
    // }),
    // new CopyWebpackPlugin([ // 拷贝生成的文件到dist目录 这样每次不必手动去cv
    //   {from: '../static', to:'../dist/static'}
    // ])
  ]
};
