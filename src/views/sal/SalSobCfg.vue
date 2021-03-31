<!--员工账套设置-->
<template>
  <div>
    <div>
      <el-table
          :data="emps"
          stripe
          border
          size="small"
          style="width: 100%"
          v-loading="loading"
          element-loading-text="正在加载...">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="email"
            label="电子邮件"
            align="left"
            width="220">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            align="left"
            width="180">
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="所属部门"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            label="工资账套"
            align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{ scope.row.salary.basicSalary }}</td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{ scope.row.salary.trafficSalary }}</td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{ scope.row.salary.lunchSalary }}</td>
                  </tr>
                  <tr>
                    <td>奖金</td>
                    <td>{{ scope.row.salary.bonus }}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{ scope.row.salary.pensionPer }}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{ scope.row.salary.pensionBase }}</td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{ scope.row.salary.medicalPer }}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{ scope.row.salary.medicalBase }}</td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>{{ scope.row.salary.accumulationFundPer }}</td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>{{ scope.row.salary.accumulationFundBase }}</td>
                  </tr>
                  <tr>
                    <td>启用时间</td>
                    <td>{{ scope.row.salary.createDate }}</td>
                  </tr>
                </table>
              </div>
              <el-tag>{{ scope.row.salary.name }}</el-tag>
            </el-tooltip>
            <el-tag v-else>暂未设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right"
            width="300">
          <template slot-scope="scope">
            <el-popover
                placement="left"
                title="修改工资账套"
                width="200"
                @hide="hidePop(scope.row)"
                @show="showPop(scope.row.salary)"
                trigger="click">
              <el-select v-model="currentSalaryId" placeholder="请选择" size="mini">
                <el-option
                    v-for="item in salaries"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
              <el-button
                  slot="reference"
                  size="mini"
                  type="danger">修改账套
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, ->, total"
          @size-change="sizeChange"
          @current-change="currentChange"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalSobCfg",
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      emps: [],
      salaries: [],
      currentSalaryId: null
    }
  },
  mounted() {
    this.initEmps();
    this.initSalaries();
  },
  methods: {
    initEmps() {
      this.loading = true;
      this.getRequest("/salary/sobcfg/" + '?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize).then(resp => {
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.pageNum = currentPage;
      this.initEmps();
    },
    initSalaries() {
      this.getRequest("/salary/sobcfg/salaries").then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    },
    showPop(salary) {
      if (salary) {
        this.currentSalaryId = salary.id;
      } else {
        this.currentSalaryId = null;
      }
    },
    hidePop(emp) {
      if (this.currentSalaryId) {
        this.putRequest("/salary/sobcfg/?empId=" + emp.id
            + "&salaryId=" + this.currentSalaryId).then(resp => {
          if (resp) {
            this.initEmps();
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>