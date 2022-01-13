module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-pxtorem')({
      rootValue: 15,
      selectorBlackList: [], // 忽略转换正则匹配项
      propList: ['*'],
    }),
  ],
};
