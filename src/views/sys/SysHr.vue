<!--操作员管理-->
<template>
  <div>
    <div class="search-container">
      <el-input class="search-input" v-model="keyword" placeholder="请输入用户名称..." size="small"
                prefix-icon="el-icon-search"></el-input>
      <el-button type="primary" icon="el-icon-search" size="small" @click="searchHr">搜索</el-button>
    </div>
    <div class="hr-container">
      <el-card class="hr-card" v-for="(hr, index) in hrs" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ hr.name }}</span>
          <el-button style="float: right; padding: 3px 0; color: red" type="text" icon="el-icon-delete"
                     @click="deletHr(hr.id)"></el-button>
        </div>
        <div>
          <el-image
              class="user-face"
              :src="hr.userface"
              :alt="hr.name">
          </el-image>
          <div class="hr-info-content">
            <div>用户名：{{ hr.name }}</div>
            <div>手机号码：{{ hr.phone }}</div>
            <div>电话号码：{{ hr.telephone }}</div>
            <div>地址：{{ hr.address }}</div>
            <div>状态：
              <el-switch
                  @change="enableChange(hr)"
                  v-model="hr.enabled"
                  active-text="启用"
                  inactive-text="禁用">
              </el-switch>
            </div>
            <div>角色：
              <el-tag class="hr-role" size="mini" type="success" v-for="(role ,index2) in hr.roles" :key="index2">
                {{ role.nameZh }}
              </el-tag>
              <el-popover
                  placement="bottom"
                  title="角色列表"
                  width="200"
                  trigger="click"
                  @show="showPop(hr.roles)"
                  @hide="hidePop(hr)">
                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                  <el-option
                      v-for="(role, index) in allRoles"
                      :key="index"
                      :label="role.nameZh"
                      :value="role.id">
                  </el-option>
                </el-select>
                <el-button icon="el-icon-more" slot="reference" size="mini" type="text"></el-button>
              </el-popover>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysHr",
  data() {
    return {
      keyword: '',
      hrs: [],
      allRoles: [],
      selectedRoles: []
    }
  },
  mounted() {
    this.initHrs();
  },
  methods: {
    searchHr() {

    },
    initHrs() {
      this.getRequest('/system/hr/').then(resp => {
        if (resp) {
          this.hrs = resp;
        }
      })
    },
    deleteHr(id) {

    },
    enableChange(hr) {
      console.log(hr)
      this.putRequest('/system/hr/', hr).then(resp => {
        if (resp) {
          this.initHrs();
        }
      })
    },
    initAllRoles() {
      this.getRequest('/system/hr/role').then(resp => {
        if (resp) {
          this.allRoles = resp;
        }
      })
    },
    showPop(roles) {
      this.selectedRoles = []
      this.initAllRoles();
      roles.forEach(r => {
        this.selectedRoles.push(r.id)
      })
    },
    hidePop(hr) {
      let url = '/system/hr/role?hrid=' + hr.id;
      this.selectedRoles.forEach(r => {
        url += '&rids=' + r
      });
      this.putRequest(url).then(resp => {
        if (resp) {
          this.initHrs();
        }
      })
    }
  }
}
</script>

<style scoped>
.search-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.search-container .search-input {
  width: 400px;
  margin-right: 10px;
}

.hr-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.hr-card {
  width: 350px;
  margin-top: 20px;
}

.user-face {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: block;
  border-radius: 50%;
}

.hr-info-content {
  margin-top: 20px;
  font-size: 12px;
  color: #409eff;
}

.hr-role {
  margin-right: 4px;
}

</style>