<template>
  <div>
    <el-container>
      <el-header class="home-header">
        <div class="title">微人事</div>
        <div>
          <el-button icon="el-icon-bell" type="text" class="chat-btn" @click="goChat"></el-button>
          <el-dropdown class="user-info" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ user.name }}<i><img :src="user.userface" alt=""></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='userinfo'>个人中心</el-dropdown-item>
              <el-dropdown-item command='setting'>设置</el-dropdown-item>
              <el-dropdown-item command='logout' divided>注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 使用 router 后可以不用 @select="menuClick" 来实现菜单跳转 -->
          <el-menu router unique-opened>
            <el-submenu :index="index+''" v-for="(item, index) in routes" v-if="!item.hidden"
                        v-bind:key="index">
              <template slot="title">
                <i :class="item.iconCls" class="icon"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item v-bind:index="child.path" v-for="(child, index) in item.children" v-bind:key="index">
                {{ child.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path !== '/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="home-welcome" v-if="this.$router.currentRoute.path === '/home'">
            欢迎来到微人事！
          </div>
          <router-view class="home-router-view"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  methods: {
    handleCommand(command) {
      if ('logout' === command) {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest('/logout');
          window.sessionStorage.removeItem('user');
          // 跳转到登录页
          this.$router.replace('/');
          // 清空菜单数据
          this.$store.commit('initRoutes', [])
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else if ('userinfo' === command) {
        this.$router.push('/hrInfo')
      }
    },
    goChat() {
      this.$router.push('/chat');
    }
    // 菜单跳转
    // menuClick(index, indexPath) {
    //   console.log(index);
    //   this.$router.push(index);
    // }
  },
  computed: {
    // 返回vuex中保存的菜单数据
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentHr;
    }
  }
}
</script>

<style scoped>
.home-header {
  background-color: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.title {
  font-size: 30px;
  font-family: 华文行楷;
  color: white;
}

.user-info {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  vertical-align: middle; /*用户名垂直居中*/
  margin-left: 10px;
}

.el-dropdown-link {
  color: white;
}

.el-submenu .icon {
  color: #409eff;
  margin-right: 5px;
}

.home-welcome {
  text-align: center;
  margin-top: 100px;
  font-size: 30px;
  font-family: 华文行楷;
  color: #409eff;
}

.home-router-view {
  margin-top: 15px;
}

.chat-btn {
  margin-right: 10px;
  color: white
}
</style>