class RemoveLogPlugin {
  constructor(options) {}

  apply(compiler) {
    // emit：生成资源到 output 目录之前触发的hook
    // 更多hooks参考 https://v4.webpack.js.org/api/compiler-hooks/
    compiler.hooks.emit.tap('RemoveLogPlugin', (compilation) => {
      Object.keys(compilation.assets).forEach((filename) => {
        if (filename.endsWith('.js')) {
          let content = compilation.assets[filename].source(); // 获取filename里的代码
          content = content.replace(/console.log\((.*?)\)/g, '');
          compilation.assets[filename] = {
            source: () => {
              return content;
            },
            size: () => {
              return Buffer.byteLength(content, 'utf-8');
            },
          };
        }
      });
    });
  }
}

module.exports = RemoveLogPlugin;
