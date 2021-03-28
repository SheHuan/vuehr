<!--工资账套管理-->
<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <el-button icon="el-icon-plus" size="small" type="primary" @click="showAddSalaryView">添加工资账套</el-button>
      <el-button icon="el-icon-refresh" size="small" type="success" @click="initSalaries"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="salaries"
          border
          stripe
          size="small"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            prop="name"
            label="账套名称"
            width="140">
        </el-table-column>
        <el-table-column
            prop="basicSalary"
            label="基本工资"
            width="90">
        </el-table-column>
        <el-table-column
            prop="trafficSalary"
            label="交通补助"
            width="90">
        </el-table-column>
        <el-table-column
            prop="lunchSalary"
            label="午餐补助"
            width="90">
        </el-table-column>
        <el-table-column
            prop="bonus"
            label="奖金"
            width="90">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="启用时间"
            width="120">
        </el-table-column>
        <el-table-column align="center" label="养老金">
          <el-table-column
              prop="pensionPer"
              label="比率"
              width="90">
          </el-table-column>
          <el-table-column
              prop="pensionBase"
              label="基数"
              width="90">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="医疗保险">
          <el-table-column
              prop="medicalPer"
              label="比率"
              width="90">
          </el-table-column>
          <el-table-column
              prop="medicalBase"
              label="基数"
              width="90">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="公积金">
          <el-table-column
              prop="accumulationFundPer"
              label="比率"
              width="90">
          </el-table-column>
          <el-table-column
              prop="accumulationFundBase"
              label="基数"
              width="90">
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        show-close
        @close="closeAddSalaryView"
        width="50%">
      <div class="add-view-container">
        <el-steps direction="vertical" :active="activeItemIndex">
          <el-step :title="itemName" v-for="(itemName, index) in salaryItemNames" :key="index"></el-step>
        </el-steps>
        <el-input v-model="salary[title]" class="add-input" :placeholder="'请输入'+ salaryItemNames[index]+ '...'"
                  v-for="(value, title, index) in salary"
                  :key="index" v-show="activeItemIndex === index"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="preStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">{{
            this.activeItemIndex === this.salaryItemNames.length - 1 ? "完成" : "下一步"
          }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SalSob",
  data() {
    return {
      salaries: [],
      dialogVisible: false,
      dialogTitle: '',
      salaryItemNames: [
        "基本工资",
        "交通补助",
        "午餐补助",
        "奖金",
        "养老金比率",
        "养老金基数",
        "医疗保比率",
        "医疗保基数",
        "公积金比率",
        "公积金基数",
        "账套名称"
      ],
      activeItemIndex: 0,
      salary: {
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionPer: 0,
        pensionBase: 0,
        medicalPer: 0,
        medicalBase: 0,
        accumulationFundPer: 0,
        accumulationFundBase: 0,
        name: ''
      }
    }
  },
  mounted() {
    this.initSalaries();
  },
  methods: {
    initSalaries() {
      this.getRequest("/salary/sob/").then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    },
    showAddSalaryView() {
      this.dialogTitle = '添加工资账套';
      this.dialogVisible = true;
    },
    closeAddSalaryView() {
      this.activeItemIndex = 0;
      this.salary = {
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionPer: 0,
        pensionBase: 0,
        medicalPer: 0,
        medicalBase: 0,
        accumulationFundPer: 0,
        accumulationFundBase: 0,
        name: ''
      }
    },
    preStep() {
      if (this.activeItemIndex === 0) {
        return;
      }
      this.activeItemIndex--;
    },
    nextStep() {
      if (this.activeItemIndex === this.salaryItemNames.length - 1) {
        if (this.salary.id) {
          this.putRequest("/salary/sob/", this.salary).then(resp => {
            if (resp) {
              this.initSalaries();
              this.dialogVisible = false;
            }
          })
        } else {
          this.postRequest("/salary/sob/", this.salary).then(resp => {
            if (resp) {
              this.initSalaries();
              this.dialogVisible = false;
            }
          })
        }
        return;
      }
      this.activeItemIndex++;
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/salary/sob/' + data.id).then(resp => {
          if (resp) {
            this.initSalaries();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    handleEdit(data) {
      this.dialogTitle = '编辑工资账套';
      this.dialogVisible = true;
      this.salary.basicSalary = data.basicSalary;
      this.salary.trafficSalary = data.trafficSalary;
      this.salary.lunchSalary = data.lunchSalary;
      this.salary.bonus = data.bonus;
      this.salary.pensionPer = data.pensionPer;
      this.salary.pensionBase = data.pensionBase;
      this.salary.medicalPer = data.medicalPer;
      this.salary.medicalBase = data.medicalBase;
      this.salary.accumulationFundPer = data.accumulationFundPer;
      this.salary.accumulationFundBase = data.accumulationFundBase;
      this.salary.name = data.name;
      this.salary.id = data.id;
    }
  }
}
</script>

<style scoped>
.add-view-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.add-view-container .add-input {
  width: 400px;
}
</style>