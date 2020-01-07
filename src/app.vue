<template>
  <section class="wrapper">
    <h2>{{ desc }}</h2>
  </section>
</template>

<script>
export default {
  data() {
    return {
      desc: 'vue demo'
    }
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      color: green;
    }
  }
</style>