<template>
  <div>
    <!--breadcrumb navigation-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">Goods</el-breadcrumb-item>
      <el-breadcrumb-item>Add Goods</el-breadcrumb-item>
    </el-breadcrumb>
    <!--Card view-->
    <el-card>
      <!--Alert-->
      <el-alert
        title="Add goods information"
        type="info"
        center
        show-icon :closable="false">
      </el-alert>
      <!--Steps-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="Basic Data"></el-step>
        <el-step title="Goods Params"></el-step>
        <el-step title="Goods Props"></el-step>
        <el-step title="Goods Images"></el-step>
        <el-step title="Goods Contents"></el-step>
        <el-step title="Finished"></el-step>
      </el-steps>
      <!--Tab-->
      <el-form :model="addForm" status-icon :rules="addFormRules"
               ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'"
                 :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="Basic Data" name="0">
            <el-form-item label="Goods Name" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="Goods Price" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Goods Weight" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Goods Quantity" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Goods Category" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Goods Params" name="1">
            <!--render item-->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData"
                          :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border size="mini"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Goods Props" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Goods Images" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">Click to upload</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="Goods Contents" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">Add Goods</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--preview picture Dialog-->
    <el-dialog
      title="Picture Preview"
      :visible.sync="previewVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Add',
  data () {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: 'Please enter the goods name.',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: 'Please enter the goods price.',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: 'Please enter the goods weight.',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: 'Please enter the goods number',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: 'Please enter the goods category',
            trigger: 'blur'
          }
        ]
      },
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('Failed to get goods category list!')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('Please select the goods category first!')
        return false
      }
    },
    async tabClicked () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('Failed to get the dynamic parameters! ')
        }
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('Failed to get the static properties! ')
        }
        this.onlyTableData = res.data
      }
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      // 1. get the tem_path of the picture
      const filePath = file.response.data.tmp_path
      // 2. find the index of this picture from the array pics
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. use the splice method of the array to delete it from the pics
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    handleSuccess (response) {
      // 1. stitch to get a picInfo obj
      const picInfo = { pic: response.data.tmp_path }
      // 2. push the picInfo to the array pics
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('Please fill the form completely!')
        }
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // manage dynamic and static params
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('Failed to add goods!')
        }
        this.$message.success('Succeeded to add goods!')
        await this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}

</style>
