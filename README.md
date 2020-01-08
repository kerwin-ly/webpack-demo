# webpack-demo

a webpack demo (v4.x)

## 1.优化/提高构建打包速度

### 1.1 配置相关

>`alias`: 当我们代码中出现 `import 'vue'`时， `webpack` 会采用向上递归搜索的方式去 `node_modules` 目录下找。为了减少搜索范围我们可以直接告诉 `webpac`k` 去哪个路径下查找。也就是别名(alias)的配置。
`include exclude` 同样配置 `include exclude` 也可以减少 `webpack loader` 的搜索转换时间。
`noParse` 当我们代码中使用到 `import jq from 'jquery'`时，webpack 会去解析 jq 这个库是否有依赖其他的包。但是我们对类似 jquery 这类依赖库，一般会认为不会引用其他的包(特殊除外,自行判断)。增加 noParse 属性,告诉 webpack 不必解析，以此增加打包速度。
`extensions` webpack 会根据 extensions 定义的后缀查找文件(频率较高的文件类型优先写在前面)

```js
rules: [
  {
    test: /\.vue$/,
    use: ["vue-loader"],
    include: [path.resolve(__dirname, "../src")], // 只在src目录下进行查找转换
    exclude: /node_modules/ // 排除node_modules查找
  },
  {
    test: /\.css$/,
    // use: ["style-loader", "css-loader"] // 从右向左解析原则
    use: [
      {
        loader: devMode ? "vue-style-loader" : MiniCssExtractPlugin,
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
    include: [path.resolve(__dirname, "../src/assets")], // 只在src/assets目录下进行查找转换
    exclude: /node_modules/ // 排除node_modules查找
  }
];
```

### 1.2HappyPack 开启多进程 loader 转换

> 在 webpack 构建过程中，实际上耗费时间大多数用在 loader 解析转换以及代码的压缩中。日常开发中我们需要使用 Loader 对 js，css，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大。由于 js 单线程的特性使得这些转换操作不能并发处理文件，而是需要一个个文件进行处理。HappyPack 的基本原理是将这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间

```shell
npm i -D happypack
```

```js
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const os = require('os');

...
rules: [
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
]
...

plugins: [
  new HappyPack({
    id: 'happyBabel', // 与loader对应的id标识
    loaders: [{
      loader: 'babel-loader',
      options: {
        presets: [
          ["@babel/preset-env"]
        ],
        cacheDirectory: true
      }
    }],
    threadPool: happyThreadPool // 进程池
  }),
]
```

### 1.3 使用webpack-parallel-uglify-plugin 增强代码压缩，优化代码压缩时间

```shell
npm i -D webpack-parallel-uglify-plugin
```

```js
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
          beautify: false // 是否输出可读性较强的代码，即会保留空格和制表符，默认为输出
        },
        compress: {
          drop_console: true, //  是否删除代码中所有的console语句，默认为false
          collapse_vars: true, // 是否内嵌虽然已经定义了，但是只用到一次的变量， 默认值false
          reduce_vars: true //  是否提取出现了多次但是没有定义成变量去引用的静态值，默认为false
        },
        cacheDir: '', //  用作缓存的可选绝对路径。如果未提供，则不使用缓存。
        sourceMap: false  //  可选布尔值。是否为压缩后的代码生成对应的Source Map(浏览器可以在调试代码时定位到源码位置了),这会减慢编译速度。默认为false
      }
    }),
    new OptimizeCssAssetsPlugin({})
  ],
  splitChunks: {
    // more options: https://webpack.docschina.org/plugins/split-chunks-plugin/
    chunks: "all",
    cacheGroups: {
      libs: {
        name: "chunk-libs",
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        chunks: "initial" // 只打包初始时依赖的第三方
      }
    }
  }
}
```

### 1.4 使用DllPlugin DllReferencePlugin抽离固定的第三方包

>对于开发项目中不经常会变更的静态依赖文件。类似于我们的elementUi、vue全家桶等等。因为很少会变更，所以我们不希望这些依赖要被集成到每一次的构建逻辑中去。 这样做的好处是每次更改我本地代码的文件的时候，webpack只需要打包我项目本身的文件代码，而不会再去编译第三方库。以后只要我们不升级第三方包的时候，那么webpack就不会对这些库去打包，这样可以快速的提高打包的速度。
