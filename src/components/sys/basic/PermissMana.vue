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
      <el-collapse v-model="activeName" accordion @change="change">
        <el-collapse-item :title="item.nameZh" :name="item.id" v-for="(item, index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0; color: red" icon="el-icon-delete" type="text"></el-button>
            </div>
            <div>
              <!--ref="tree"表示当前组件的名称，可以用来查找组件-->
              <el-tree show-checkbox
                       :data="allMenus"
                       :props="defaultProps"
                       node-key="id"
                       :default-checked-keys="checkedMenus"
                       ref="tree">
              </el-tree>

              <div class="button-group">
                <el-button size="mini" @click="activeName=-1">取消修改</el-button>
                <el-button size="mini" type="primary" @click="doUpdate(item.id,index)">确认修改</el-button>
              </div>
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
      activeName: -1,
      // 全部menu
      allMenus: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 选中的menu
      checkedMenus: []
    }
  },
  mounted() {
    // 初始化表格
    this.initRoles();
  },
  methods: {
    // 打开折叠面板
    change(roleId) {
      if (roleId) {
        this.initAllMenus();
        this.initCheckedMenu(roleId);
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
    },
    initCheckedMenu(roleId) {
      this.getRequest('/system/basic/permiss/mids/' + roleId).then(resp => {
        console.log(1111)
        if (resp) {
          console.log(2222)
          this.checkedMenus = resp;
        }
      })
    },
    // index表示列表中第几个角色
    doUpdate(roleId, index) {
      let tree = this.$refs.tree[index];
      let checkedKeys = tree.getCheckedKeys(true);
      let url = '/system/basic/permiss/?roleId=' + roleId;
      checkedKeys.forEach(key => {
        url += '&menuIds=' + key;
      });
      this.putRequest(url).then(resp => {
        if (resp) {
          this.activeName = -1;
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

.button-group {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>