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
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      filterText: '',
      allDepartments: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
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

    },
    deleteDepartment(node, data) {

    },
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