<template>
<div>
  <!--breadcrumb navigation-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
    <el-breadcrumb-item><a href="">Authority</a></el-breadcrumb-item>
    <el-breadcrumb-item>Permissions List</el-breadcrumb-item>
  </el-breadcrumb>
  <!--Card view-->
  <el-card>
    <el-table :data="rightsList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="Permission Name" prop="authName"></el-table-column>
      <el-table-column label="Path" prop="path"></el-table-column>
      <el-table-column label="Permission Level" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">Level 1</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'">Level 2</el-tag>
          <el-tag type="warning" v-else>Level 3</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get permissions list!')
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
