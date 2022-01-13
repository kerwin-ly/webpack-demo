<template>
  <section class="wrapper">
    <h2>{{ desc }}</h2>
  </section>
</template>

<script>
export default {
  data() {
    return {
      desc: 'vue demo',
    };
  },
  mounted() {
    console.log('123');
    console.log('233');
    console.log(111);
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
