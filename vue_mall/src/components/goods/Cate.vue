<template>
  <div>
    <!--breadcrumb navigation-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">Goods</a></el-breadcrumb-item>
      <el-breadcrumb-item>Categories</el-breadcrumb-item>
    </el-breadcrumb>
    <!--Card view-->
    <el-card>
      <!--Add Categories-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">Add Categories</el-button>
        </el-col>
      </el-row>
      <!--Table-->
      <tree-table class="treeTable" :data="cateList" :columns="columns"
                  :selection-type="false" :expand-type="false"
                  show-index index-text="#" :show-row-hover="false">
        <!--Valid-->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!--Level-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">Level 1</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">Level 2</el-tag>
          <el-tag type="warning" size="mini" v-else>Level 3</el-tag>
        </template>
        <!--Operation-->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">Edit</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">Delete</el-button>
        </template>
      </tree-table>
      <!--Pagination-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--Add category dialog-->
    <el-dialog
      title="Add categories"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <!--table-->
      <el-form :model="addCateForm"
               :rules="addCateFormRules" ref="addCateFormRef"
               label-width="130px" >
        <el-form-item label="Category Name: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="Parent Category: ">
          <!--option used to assign data resource-->
          <!--props used to assign configuration-->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            clearable
            change-on-select
            @change="parentCateChanged"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="addCate">Confirm</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      /* assign the column definition to the table */
      columns: [
        {
          label: 'Category Name',
          prop: 'cat_name'
        },
        {
          label: 'Valid',
          type: 'template',
          template: 'isOk'
        },
        {
          label: 'Level',
          type: 'template',
          template: 'order'
        },
        {
          label: 'Operation',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: {
          required: true, message: 'Please enter a category name', trigger: 'blur'
        }
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get the categories list!')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get parent category list!')
      }
      this.parentCateList = res.data
    },
    parentCateChanged () {
      //  if the length of selectedKeys > 0, means the parent category has been selected
      // otherwise means no parent category has been selected
      if (this.selectedKeys.length > 0) {
        // parent category id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // level
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // parent category id
        this.addCateForm.cat_pid = 0
        // level
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('Failed to add the new category!')
        }
        this.$message.success('Succeeded to add the new category!')
        await this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
