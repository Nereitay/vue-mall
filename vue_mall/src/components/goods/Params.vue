<template>
  <div>
    <!--breadcrumb navigation-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">Goods</a></el-breadcrumb-item>
      <el-breadcrumb-item>Category Params</el-breadcrumb-item>
    </el-breadcrumb>
    <!--Card view-->
    <el-card>
      <!--Alert-->
      <el-alert
        title="Alert: only the third category level can be set params!"
        :closable="false"
        show-icon
        type="warning">
      </el-alert>
      <!--select goods-->
      <el-row class="cat_opt">
        <el-col>
          <span>Select the goods category: </span>
          <!--cascader-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!--Tab-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--Add Dynamic params-->
        <el-tab-pane label="Dynamic params" name="many">
          <!--Dynamic params button-->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">Add Params
          </el-button>
          <!--Dynamic params table-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--demonstrate tag in loop-->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
                        closable @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>
                <!--input-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--add button-->
                <el-button v-else class="button-new-tag"
                           size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Params Name" prop="attr_name"></el-table-column>
            <el-table-column label="Operation">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">
                  Edit
                </el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--Add Static properties-->
        <el-tab-pane label="Static properties" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">Add
            Properties
          </el-button>
          <!--Static properties table-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--demonstrate tag in loop-->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
                        closable @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>
                <!--input-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--add button-->
                <el-button v-else class="button-new-tag"
                           size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Property Name" prop="attr_name"></el-table-column>
            <el-table-column label="Operation">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">
                  Edit
                </el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--Add params dialog-->
    <el-dialog
      :title=" 'Add ' + titleText "
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="addParams">Confirm</el-button>
  </span>
    </el-dialog>
    <!--Edit params dialog-->
    <el-dialog
      :title=" 'Edit ' + titleText "
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="editParams">Confirm</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data: function () {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      // activated tab name
      activeName: 'many',
      // Dynamic params data
      manyTableData: [],
      // Static properties data
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: 'Please enter a parameter name!',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: 'Please enter a parameter name!',
            trigger: 'blur'
          }
        ]
      }
      /* control button and input switch to appear */
      /* inputVisible: false,
      inputValue: '' */
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get goods list!')
      }
      this.cateList = res.data
    },
    handleChange () {
      this.getParamsData()
    },
    handleTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      // has not selected the third level category
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(this.selectedCateKeys)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get params list!')
      }
      console.log(res.data)
      res.data.forEach(item => {
        /* string turn to array */
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // control the visibility of the input
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('Failed to add the new parameter!')
        }
        this.$message.success('Succeeded to add the new parameter!')
        this.addDialogVisible = false
        await this.getParamsData()
      })
    },
    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get params information!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('Failed to edit the params !')
        }
        this.$message.success('Succeeded to update the params!')
        await this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = []
        row.inputVisible = false
        return
      }
      // the input content is valid
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      this.saveAttrVals(row)
    },
    /* save attr_vals in database  */
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to edit the params!')
      }
      this.$message.success('Succeeded to edit the params!')
    },
    showInput (row) {
      row.inputVisible = true
      /* get the focus automatically, $nextTick when the element has been rendered once again, the callback function will be executed */
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // if the button needed to be disabled, then return true
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return 'Dynamic Params'
      }
      return 'Static Properties'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px
}
</style>
