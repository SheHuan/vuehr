<template>
  <div>
    <el-form
        :rules="rules"
        ref="loginForm"
        v-bind:model="loginForm"
        class="login-container"
        v-loading="loading"
        element-loading-text="正在登陆...">
      <h3 class="login-title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="code-item">
          <el-input type="text" v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码"
                    @keydown.enter.native='submitLogin' style="width: 200px"></el-input>
          <img :src="codeUrl" @click="updateVerifyCode" style="width: 100px; height: 30px">
        </div>
      </el-form-item>
      <el-checkbox v-model="checked"></el-checkbox>
      <el-button type="primary" class="login-button" @click="submitLogin">登录</el-button>
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
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        code: [{required: true, message: "请输入验证码", trigger: "blur"}]
      },
      loginForm: {
        username: "admin",
        password: "123",
        code: ''
      },
      checked: true,
      loading: false,
      codeUrl: '/verifyCode?time=' + new Date()
    }
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
            this.loading = false;
            if (resp) {
              window.sessionStorage.setItem('user', JSON.stringify(resp.obj))
              // 获得登录时携带的重定向地址
              let path = this.$route.query.redirect;
              // 登录成功后跳转到首页或者指定地页面
              this.$router.replace((path === '/' || path === undefined) ? '/home' : path)
            } else {
              this.updateVerifyCode();
            }
          }).finally(() => {
            this.loading = false;
          })
        } else {
          this.$message.error('请输入所有字段！')
          return false;
        }
      })
    },
    updateVerifyCode() {
      this.codeUrl = '/verifyCode?time=' + new Date();
    }
  }
}
</script>

<style scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login-title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}

.login-button {
  width: 100%;
  margin-top: 15px;
}

.code-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>