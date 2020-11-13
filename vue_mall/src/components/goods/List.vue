<template>
  <div>
    <!--breadcrumb navigation-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">Goods</a></el-breadcrumb-item>
      <el-breadcrumb-item>Goods List</el-breadcrumb-item>
    </el-breadcrumb>
    <!--Card view-->
    <el-card>
      <!--search for goods & Add zone-->
      <el-row :gutter="20">
        <!--search for goods input-->
        <el-col :span="8">
          <el-input placeholder="Please input" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!--button to add goods-->
        <el-col :span="4">
          <el-button type="primary" size="medium" @click="goAddPage">Add Goods</el-button>
        </el-col>
      </el-row>
      <!--Goods table-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="Goods Name" prop="goods_name"></el-table-column>
        <el-table-column label="Goods Price (yuan)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="Goods Weight" prop="goods_weight" width="75px"></el-table-column>
        <el-table-column label="Created Time" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="130px">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--Pagination-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get the goods list!')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById (id) {
      const confirmResult = await this.$confirm('This will permanently delete the goods. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('The elimination has been canceled!')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('Failed to delete the goods!')
      }
      this.$message.success('Succeeded to delete the goods!')
      await this.getGoodsList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
