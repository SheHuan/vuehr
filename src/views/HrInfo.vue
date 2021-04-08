<template>
  <div>
    <el-card class="box-card" style="width: 400px">
      <div slot="header" class="clearfix">
        <span>{{ hr.name }}</span>
      </div>
      <div>
        <div>
          <img title="点击修改头像" :src="hr.userface" alt="" class="userface">
        </div>
        <div>电话号码：
          <el-tag>{{ hr.telephone }}</el-tag>
        </div>
        <div>手机号码：
          <el-tag>{{ hr.phone }}</el-tag>
        </div>
        <div>居住地址：
          <el-tag>{{ hr.address }}</el-tag>
        </div>
        <div>用户角色：
          <el-tag type="success" style="margin-right: 5px" v-for="(r, index) in hr.roles" :key="index">{{
              r.nameZh
            }}
          </el-tag>
        </div>
        <div class="buttons">
          <el-button type="primary" @click="showUpdateInfoView">修改信息</el-button>
          <el-button type="danger" @click="showUpdatePasswordView">修改密码</el-button>
        </div>
        <el-dialog
            title="修改用户信息"
            :visible.sync="infoDialogVisible"
            width="30%">
          <table>
            <tr>
              <td>
                <el-tag>用户昵称：</el-tag>
              </td>
              <td>
                <el-input v-model="hr2.name"></el-input>
              </td>
            </tr>
            <tr>
              <td>
                <el-tag>电话号码：</el-tag>
              </td>
              <td>
                <el-input v-model="hr2.telephone"></el-input>
              </td>
            </tr>
            <tr>
              <td>
                <el-tag>手机号码：</el-tag>
              </td>
              <td>
                <el-input v-model="hr2.phone"></el-input>
              </td>
            </tr>
            <tr>
              <td>
                <el-tag>用户地址：</el-tag>
              </td>
              <td>
                <el-input v-model="hr2.address"></el-input>
              </td>
            </tr>
          </table>
          <span slot="footer" class="dialog-footer">
          <el-button @click="infoDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doUpdateHrInfo">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="修改密码"
            :visible.sync="pswDialogVisible"
            width="30%">
          <div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
              <el-form-item label="请输入旧密码" prop="oldpass">
                <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="请输入新密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "HrInfo",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      hr: null,
      hr2: null,
      infoDialogVisible: false,
      pswDialogVisible: false,
      ruleForm: {
        oldpass: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        oldpass: [{validator: validatePass, trigger: 'blur'}],
        pass: [{validator: validatePass, trigger: 'blur'}],
        checkPass: [{validator: validatePass2, trigger: 'blur'}]
      }
    };
  },
  mounted() {
    this.initHr();
  },
  methods: {
    initHr() {
      this.getRequest('/hr/info').then(resp => {
        if (resp) {
          this.hr = resp;
          this.hr2 = Object.assign({}, this.hr);
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          // 更新vuex中的当前用户信息
          this.$store.commit('INIT_CURRENT_HR', resp);
        }
      })
    },
    showUpdatePasswordView() {
      this.pswDialogVisible = true;
    },
    showUpdateInfoView() {
      this.infoDialogVisible = true;
    },
    doUpdateHrInfo() {
      this.putRequest('/hr/update', this.hr2).then(resp => {
        if (resp) {
          this.infoDialogVisible = false;
          this.initHr();
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.hrid = this.hr.id;
          this.putRequest('/hr/password', this.ruleForm).then(resp => {
            if (resp) {
              this.getRequest("/logout");
              window.sessionStorage.removeItem("user");
              this.$store.commit('initRoutes', []);
              this.$router.replace("/")
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px
}

.userface {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
}
</style>