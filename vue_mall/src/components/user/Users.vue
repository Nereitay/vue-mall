<template>
  <div>
    <!--breadcrumb navigation-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">Users</a></el-breadcrumb-item>
      <el-breadcrumb-item>Users List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--searching input and add-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="search for ..."
                    v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">Add User</el-button>
        </el-col>
      </el-row>
      <!--Table user list-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="NAME" prop="username"></el-table-column>
        <el-table-column label="EMAIL" prop="email"></el-table-column>
        <el-table-column label="MOBILE" prop="mobile"></el-table-column>
        <el-table-column label="ROLE" prop="role_name"></el-table-column>
        <el-table-column label="STATE" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="OPERATION" width="180px">
          <template slot-scope="scope">
            <!--Edit button-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--Delete button-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!--Assign roles button-->
            <el-tooltip effect="dark" content="Assign Role" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showEditDialog()"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--Pagination-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--add user dialog-->
    <el-dialog
      title="Add User"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- main content-->
      <el-form ref="addFormRef" :model="addForm"
               label-width="80px" :rules="addFormRules">
        <el-form-item label="Username" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Mobile" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--footer-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addUser">Confirm</el-button>
      </span>
    </el-dialog>
    <!--edit user dialog-->
    <el-dialog
      title="Edit User"
      :visible.sync="editDialogVisible"
      width="50%"
      @closed="editDialogClosed">
      <!-- main content-->
      <el-form ref="editFormRef" :model="editForm"
               label-width="80px" :rules="editFormRules">
        <el-form-item label="Username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Mobile" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--footer-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editUserInfo">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data: function () {
    var checkEmail = (rules, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        cb()
      }
      cb(new Error('please enter a correct email address.'))
    }
    var checkMobile = (rules, value, cb) => {
      /* const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/ */
      const regMobile = /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}$/
      if (regMobile.test(value)) {
        cb()
      }
      cb(new Error('please enter a correct mobile number.'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: 'Please enter a username',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'The length is between 3 and 10 letters',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please enter a password',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: 'The length is between 6 and 15',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: 'Please enter an email address',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: 'Please enter a mobile number',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          {
            required: true,
            message: 'Please enter an email address',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: 'Please enter a mobile number',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('Failed trying to get the user list!')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('Failed to update user state!')
      }
      this.$message.success('succeeded to update user state!')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('Failed to add a new user!')
        }
        this.$message.success('succeeded to add a new user!')
        this.addDialogVisible = false
        await this.getUserList()
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to query user!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('Failed to edit user!')
        }
        this.editDialogVisible = false
        await this.getUserList()
        this.$message.success('Succeeded to edit user!')
      })
    },
    removeUserById: async function (id) {
      const confirmResult = await this.$confirm('This will permanently delete the user. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('Already canceled the elimination!')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to delete the user!')
      }
      this.$message.success('Succeeded to delete the user!')
      await this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
