<!--职位管理-->
<template>
  <div>
    <div>
      <el-input
          placeholder="添加职位"
          prefix-icon="el-icon-plus"
          size="small"
          class="pos-input"
          @keydown.enter.native="addPosition"
          v-model="pos.name">
      </el-input>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addPosition">添加</el-button>
    </div>
    <div class="pos-table">
      <el-table
          :data="positions"
          border
          stripe
          size="small"
          style="width: 70%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位名称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        name: ''
      },
      positions: []
    }
  },
  mounted() {
    // 初始化表格
    this.initPositions();
  },
  methods: {
    initPositions() {
      this.getRequest('/system/basic/pos/').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    // 编辑职位
    handleEdit(index, data) {

    },
    // 删除职位
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // 添加职位
    addPosition() {
      if (this.pos.name) {
        this.postRequest('/system/basic/pos/', this.pos).then(resp => {
          if (resp) {
            this.pos.name = '';
            this.initPositions();
          }
        })
      } else {
        this.$message.error('请输入职位名称！');
      }
    }
  }
}
</script>

<style scoped>
.pos-input {
  width: 300px;
  margin-right: 10px;
}

.pos-table {
  margin-top: 10px;
}
</style>