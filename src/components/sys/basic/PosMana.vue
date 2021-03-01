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
          style="width: 70%"
          @selection-change="handleSelectionChange">
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
            width="200">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
            width="200">
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

      <el-button type="danger" size="small" :disabled="multipleSelection.length===0" @click="batchDeletePosition"
                 class="batch-delete-btn">
        批量删除职位
      </el-button>
    </div>
    <el-dialog
        title="修改职位"
        :visible.sync="dialogVisible"
        width="30%">
      <el-form :model="updatePos" :rules="rules" ref="updatePos" label-width="100px">
        <el-form-item prop="name" label="职位名称">
          <el-input v-model="updatePos.name" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "PosMana",
  data() {
    return {
      // 添加的职位数据
      pos: {
        name: ''
      },
      positions: [],
      dialogVisible: false,
      // 编辑的职位数据
      updatePos: {
        name: ''
      },
      rules: {
        name: [{required: true, message: "请输入新的职位名称", trigger: "blur"}],
      },
      multipleSelection: []
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
      // this.updatePos = data;
      // 深拷贝，不直接赋值
      Object.assign(this.updatePos, data);
      this.dialogVisible = true;
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
    },
    // 更新职位
    doUpdate() {
      this.$refs.updatePos.validate((valid) => {
        if (valid) {
          this.putRequest('/system/basic/pos/', this.updatePos).then(resp => {
            if (resp) {
              this.initPositions();
              this.updatePos.name = '';
              this.dialogVisible = false;
            }
          })
        } else {
          return false;
        }
      })
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量删除职位
    batchDeletePosition() {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/system/basic/pos/' + ids).then(resp => {
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

.batch-delete-btn {
  margin-top: 10px;
}
</style>