<template>
  <section class="wrapper">
    <h2>{{ desc }}</h2>
  </section>
</template>

<script>
import text from "./assets/txt/demo.txt";
export default {
  data() {
    return {
      desc: 'vue demo',
    };
  },
  mounted() {
    console.log(text); // 使用raw-loader直接访问txt文件内容
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    font-size: 20px;
    color: green;
  }
}
</style>
