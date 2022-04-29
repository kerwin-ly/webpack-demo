const loaderUtils = require("loader-utils");
const schema = require("./options.json");
const schemaUtils = require("schema-utils");

module.exports = function(source) {
  // loader-utils3.0之后移除了getOptions方法
  // webpack4之前可以通过安装loader-utils v2.x版本，并调用getOptions方法获取loader的参数
  // const {name, basePath} = loaderUtils.getOptions(this);

  // 对传入的loader的配置项进行校验
  schemaUtils.validate(schema, this.query, {
    name: "Raw Loader", // 报错信息中的插件名
    baseDataPath: "options", // 配置项名称
    postFormatter: (formattedError, error) => {
      // 做一些格式化处理
      return formattedError;
    },
  });
  const { name, basePath } = this.query;
  const json = JSON.stringify(source)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  // 可以通过回调方式抛错，也可以直接throw new Error()
  // this.callback(new Error("this is error"), json);
  // this.emitFile(path.resolve(__dirname, "./aaaa.txt"), "aaaa");
  // this.callback(null, json);
  return `export default ${json}`;
};
