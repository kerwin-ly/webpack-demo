import './assets/index.less';
import './images/bg.jpg';

const list = [{
  name: 'kerwin',
  age: 23
}, {
  name: 'bob',
  age: 25
}];

for (let value of list) {
  console.log(value.keys());
}

console.log('test webpack');