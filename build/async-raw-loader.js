const fs = require("fs");
const path = require("path");
module.exports = function(source) {
  // loader-utils3.0之后移除了getOptions方法
  // webpack4之前可以通过安装loader-utils v2.x版本，并调用getOptions方法获取loader的参数
  // const {name, basePath} = loaderUtils.getOptions(this);
  const { name, basePath } = this.query;
  const callback = this.async();

  const json = JSON.stringify(source)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  // 模拟一个读取文件的异步任务
  const txtPath = path.resolve(__dirname, "../src/assets/txt/demo.txt");
  this.addDependency(txtPath); // 使缓存 loaders 无效，在观察模式(watch mode)下重编译

  fs.readFile(txtPath, "utf-8", function(err, data) {
    if (err) return callback(err);
    callback(null, `export default '${data}'` + "\n" + json);
  });
};
