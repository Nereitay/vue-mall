<template>
  <div>
    <!--<h3>Current value of 'count' is :  {{this.$store.state.count}}</h3>-->
    <h3>{{this.$store.getters.showNum}}</h3>
    <button @click="btnHandler1">+1</button>
    <button @click="btnHandler2">+N</button>
    <button @click="btnHandler3">+1 Async</button>
    <button @click="btnHandler4">+N Async</button>
  </div>
</template>

<script>
export default {
  name: "Addition",
  data() {
    return {

    }
  },
  methods: {
    btnHandler1 () {
      this.$store.commit('add')
    },
    btnHandler2 () {
      // commit作用，就是调用某个mutation函数
      this.$store.commit('addN', 3)
    },
    btnHandler3 () {
      //这里的dispatch函数，专门用来触发action
      this.$store.dispatch('addAsync')
    },
    btnHandler4 () {
      this.$store.dispatch('addNAsync', 5)
    }
  }
}
</script>

<style scoped>

</style>
