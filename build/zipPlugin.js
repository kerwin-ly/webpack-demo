const JSZip = require("jszip");
const path = require("path");
const { RawSource } = require("webpack-sources");

const zip = new JSZip();

class ZipPlugin {
  options;

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("ZipPlugin", (compilation, cb) => {
      const folder = zip.folder(this.options.filename);
      for (let filename in compilation.assets) {
        const source = compilation.assets[filename].source(); // 文件字符串内容
        folder.file(filename, source);
      }
      zip
        .generateAsync({
          type: "nodebuffer",
        })
        .then((content) => {
          const defaultOutputPath = path.join(compilation.options.output.path); // 获取webpack配置中的输出目录地址
          // 注意这里使用相对路径，path.relative(a,b) b相对于a的路径
          // 如果这里使用绝对路径，会导致生成的zip包包括从根路径开始的目录
          const zipOutputPath = path.relative(
            defaultOutputPath,
            path.join(defaultOutputPath, this.options.filename + ".zip") // 执行一次join进入到dist目录里面，让zip包在dist文件夹中生成
          );
          compilation.assets[zipOutputPath] = new RawSource(content);
          cb(); // 异步事件，记得回调
        })
        .catch((err) => {
          throw new Error("ZipPlugin Error:" + err);
        });
    });
  }
}

module.exports = ZipPlugin;
