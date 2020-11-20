<template>
  <div>
    <!-- Breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">HOME</el-breadcrumb-item>
      <el-breadcrumb-item>Statistics</el-breadcrumb-item>
      <el-breadcrumb-item>Reports</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card -->
    <el-card>
      <!--2 prepare a DOM container with width and height -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1. import echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      // data
      options: {
        title: {
          text: 'Users Resources'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  // Dom elements has been mounted
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('Failed to get charts！')
    }
    const result = _.merge(res.data, this.options)
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
