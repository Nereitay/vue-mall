<template>
  <div>
    <!--breadcrumb navigation-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">Orders</a></el-breadcrumb-item>
      <el-breadcrumb-item>Orders List</el-breadcrumb-item>
    </el-breadcrumb>
    <!--Card view-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="Please input">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--order table-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="Order Id" prop="order_number" width="200px"></el-table-column>
        <el-table-column label="Order Price" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="Paid" prop="order_status" width="90px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_status === '1'">Paid</el-tag>
            <el-tag type="danger" v-else>Not Paid</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Shipped" prop="is_send" width="90px"></el-table-column>
        <el-table-column label="Shipping time" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--pagination-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--address dialog-->
    <el-dialog
      title="Edit Address"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="120px">
        <el-form-item label="Location" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="Address" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">Cancel</el-button>
    <el-button type="primary" @click="addressVisible = false">Confirm</el-button>
  </span>
    </el-dialog>
    <!--logistic dialog-->
    <el-dialog
      title="Logistic Progress"
      :visible.sync="progressVisible"
      width="50%"
      >
      <!--timeline-->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: 'Please choose province, city and district.',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: 'Please enter address.',
            trigger: 'blur'
          }
        ]
      },
      cityData: cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('Failed t get orders list!')
      }
      console.log(res)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showBox () {
      this.addressVisible = true
    },
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox () {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get logistic progress!')
      }
      this.progressInfo = res.data
      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../plugins/timeline/timeline.css";
@import "../../plugins/timeline-item/timeline-item.css";
.el-cascader {
  width: 100%;
}
</style>
