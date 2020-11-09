<template>
  <el-container class="home-container">
    <!--header-->
    <el-header>
      <div>
        <img src="../assets/horse.png" alt="">
        <span style="font-family: 'Arial Unicode MS',serif">Mall Management System</span>
      </div>
      <el-button type="info" @click="logout">Logout</el-button>
    </el-header>
    <!--Body-->
    <el-container>
      <!--Aside-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--aside Menu-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#4098FF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <!--L1 menu-->
          <el-submenu :index="item.id + '' " v-for="item in menuList" :key="item.id">
            <!--template of L1-->
            <template slot="title">
              <!--Icon-->
              <i :class="iconsObj[item.id]"></i>
              <!--Text-->
              <span>{{ item.authName }}</span>
            </template>
            <!-- L2 Menu-->
            <el-menu-item :index=" '/' + subItem.path " v-for="subItem in item.children"
                          :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <!--template of L2-->
              <template slot="title">
                <!--Icon-->
                <i class="el-icon-menu"></i>
                <!--Text-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!--Main-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // aside menu list
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // collapse or not
      isCollapse: false,
      // activated path link
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // get all menu list
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // press the button, switch the state of collapse
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // save the activated state of link
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
