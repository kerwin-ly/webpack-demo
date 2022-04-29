// import './assets/index.less';
// import './images/bg.jpg';

// const list = [{
//   name: 'kerwin',
//   age: 23
// }, {
//   name: 'bob',
//   age: 25
// }];

// for (let value of list) {
//   console.log(value.keys());
// }

// console.log('test webpack');
import Vue from "vue";
import App from "./app";
import "./assets/css/index.less";
// import { bar } from "./bar";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
