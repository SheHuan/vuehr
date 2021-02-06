<template>
  <div>
    <el-form :rules="rules" v-bind:model="loginForm" class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked"></el-checkbox>
      <el-button type="primary" class="loginButton">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: function () {
    return {
      rules: {
        username: [{required: true, message: "请输入用户名", trigger: "blur"}],
        password: [{required: true, message: "请输入密码", trigger: "blur"}]
      },
      loginForm: {
        username: "admin",
        password: "123456"
      },
      checked: true
    }
  }
}
</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}

.loginButton {
  width: 100%;
  margin-top: 15px;
}
</style>