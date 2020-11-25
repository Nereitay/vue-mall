<template>
  <div>
    <!--<h3>Current value of 'count' is : {{count}}</h3>-->
    <h3>{{showNum}}</h3>
    <button @click="btnHandler1">-1</button>
    <button @click="btnHandler2">-N</button>
    <button @click="btnHandler3">-1 Async</button>
    <button @click="subNAsync(5)">-N Async</button>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
export default {
  name: "Subtraction",
  data() {
    return{}
  },
  computed: {
    ...mapState (['count']),
    ...mapGetters(['showNum'])
  },
  methods: {
    ...mapMutations(['sub', 'subN']),
    ...mapActions(['subAsync', 'subNAsync']),
    btnHandler1() {
      this.sub ()
    },
    btnHandler2() {
      this.subN (3)
    },
    btnHandler3 () {
      this.subAsync()
    }
  }
}
</script>

<style scoped>

</style>
