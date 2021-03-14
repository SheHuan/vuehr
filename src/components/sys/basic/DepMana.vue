<!--部门管理-->
<template>
  <div class="dep-container">
    <el-input
        placeholder="请输入入部门名称进行搜索"
        prefix-icon="el-icon-search"
        v-model="filterText">
    </el-input>

    <el-tree
        class="filter-tree"
        :data="allDepartments"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
              class="dep-btn"
              type="primary"
              size="mini"
              @click="() => addDepartment(data)">
            添加部门
          </el-button>
          <el-button
              class="dep-btn"
              type="danger"
              size="mini"
              @click="() => deleteDepartment(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
        title="添加部门"
        :visible.sync="dialogVisible"
        width="30%">
      <el-form :model="department" :rules="rules" ref="updatePos" label-width="110px">
        <el-form-item label="上级部门名称：">
          {{ parentDepartmentName }}
        </el-form-item>
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="department.name" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      rules: {
        name: [{required: true, message: "请输入部门名称", trigger: "blur"}],
      },
      filterText: '',
      allDepartments: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      // 要添加的部门数据
      department: {
        name: '',
        parentId: -1
      },
      parentDepartmentName: ''
    }
  },
  mounted() {
    this.getRequest('/system/basic/department/').then(resp => {
      if (resp) {
        this.allDepartments = resp;
      }
    })
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 实现过滤逻辑，value 输入的值，数中的每一项数据
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    addDepartment(data) {
      this.parentDepartmentName = data.name;
      this.dialogVisible = true;
      this.department.parentId = data.id;
    },
    deleteDepartment(data) {
      if (data.isParent) {
        this.$message.error('该部门下有关联的部门，无法删除！');
        return;
      }
      this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/department/' + data.parentId + '/' + data.id).then(resp => {
          if (resp) {
            this.deleteDepFromDeps(null, this.allDepartments, data.id);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    doAdd() {
      this.$refs.updatePos.validate((valid) => {
        if (valid) {
          this.postRequest('/system/basic/department/', this.department).then(resp => {
            if (resp) {
              this.addDepToDeps(this.allDepartments, resp.obj)
              this.department.name = '';
              this.dialogVisible = false;
            }
          })
        } else {
          return false;
        }
      })
    },
    addDepToDeps(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id === dep.parentId) {
          d.children = d.children.concat(dep);
          if (d.children.length > 0) {
            d.isParent = true;
          }
          return;
        } else {
          this.addDepToDeps(d.children, dep);
        }
      }
    },
    deleteDepFromDeps(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id === id) {
          deps.splice(i, 1);
          if (deps.length === 0 && p) {
            p.isParent = false;
          }
          return;
        } else {
          this.deleteDepFromDeps(d, d.children, id);
        }
      }
    }
  }
}
</script>

<style scoped>
.dep-container {
  width: 500px;
}

.dep-btn {
  padding: 2px;
  font-size: 12px;
}

.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>