<!--权限组-->
<template>
  <div>
    <div class="permission-manage">
      <el-input class="name-input" size="small" placeholder="请输入角色英文名称" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input class="namezh-input" size="small" placeholder="请输入角色中文名称" v-model="role.nameZh"></el-input>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">添加角色</el-button>
    </div>
    <div class="role-collapse">
      <el-collapse v-model="activeName" accordion @change="change">
        <el-collapse-item :title="item.nameZh" :name="item.id" v-for="(item, index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0; color: red" icon="el-icon-delete" type="text"
                         @click="deleteRole(item)"></el-button>
            </div>
            <div>
              <!--ref="tree"表示当前组件的名称，可以用来查找组件-->
              <!--防止不同树中数据错乱-->
              <el-tree show-checkbox
                       :data="allMenus"
                       :props="defaultProps"
                       :key="index"
                       node-key="id"
                       :default-checked-keys="checkedMenus"
                       ref="tree">
              </el-tree>

              <div class="button-group">
                <el-button size="mini" @click="closeCollapse">取消修改</el-button>
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
    change(roleId) {
      // 打开折叠面板
      if (roleId) {
        this.initAllMenus();
        this.initCheckedMenu(roleId);
      } else {
        // 关闭折叠面板
        // 由于所有树共有相同的数据源，为优化体验，先清空已选中的menu
        // this.checkedMenus = []
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
        if (resp) {
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
          this.closeCollapse();
        }
      })
    },
    closeCollapse() {
      this.activeName = -1
    },
    addRole() {
      if (!this.role.name || !this.role.nameZh) {
        this.$message.error('请完善角色信息！');
        return;
      }
      this.postRequest('/system/basic/permiss/role', this.role).then(resp => {
        if (resp) {
          this.role.name = '';
          this.role.nameZh = '';
          this.initRoles();
        }
      })
    },
    deleteRole(role) {
      this.$confirm('此操作将永久删除【' + role.nameZh + '】角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/permiss/role/' + role.id).then(resp => {
          if (resp) {
            this.initRoles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
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