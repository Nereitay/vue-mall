<template>
  <div class="login_container">
    <div class="login_box">
      <!--Avatar-->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!--Login Form-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--username-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--password-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!--button-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">Login</el-button>
          <el-button type="info" @click="resetLoginForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      /* Login data binding */
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      /* object of loginForm verification rules */
      loginFormRules: {
        username: [
          {
            required: true,
            message: 'Please enter your username',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: 'The length of the name should between 3 and 10',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please enter your password',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: 'The length of the password should between 6 and 15',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    /* click reset button */
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('Login failed!')
        this.$message.success('Login succeeded!')
        // 1. save the token after login succeeded into the client session Storage
        // 1.1 all the api interfaces except login should be allowed to visit after the login succeeded
        // 1.2 token only invalid when the website opens, so it should be stored in sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        // 2 redirect to the home of backend, rout: /home
        await this.$router.push('/home')
      })
    }
  }

}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
