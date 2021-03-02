<!--权限组-->
<template>
  <div>
    <div class="permission-manage">
      <el-input class="name-input" size="small" placeholder="请输入角色英文名称" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input class="namezh-input" size="small" placeholder="请输入角色中文名称" v-model="role.nameZh"></el-input>
      <el-button type="primary" size="small" icon="el-icon-plus">添加角色</el-button>
    </div>
    <div class="role-collapse">
      <el-collapse accordion @change="change">
        <el-collapse-item :title="item.nameZh" :name="item.id" v-for="(item, index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0; color: red" icon="el-icon-delete" type="text"></el-button>
            </div>
            <div>
              <el-tree show-checkbox :data="allMenus" :props="defaultProps"></el-tree>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roles: [],
      allMenus: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    // 初始化表格
    this.initRoles();
  },
  methods: {
    // 打开折叠面板
    change(name) {
      if (name) {
        this.initAllMenus();
      }
    },
    initRoles() {
      this.getRequest('/system/basic/permiss/').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    },
    initAllMenus() {
      this.getRequest('/system/basic/permiss/menus').then(resp => {
        if (resp) {
          this.allMenus = resp;
        }
      })
    }
  }
}
</script>

<style scoped>
.permission-manage {
  display: flex;
  justify-content: flex-start;
}

.permission-manage .name-input {
  width: 350px;
}

.permission-manage .namezh-input {
  width: 300px;
  margin-left: 10px;
  margin-right: 10px;
}

.role-collapse {
  margin-top: 10px;
  width: 900px;
}
</style>