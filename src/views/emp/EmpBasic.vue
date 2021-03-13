<!--基本资料-->
<template>
  <div>
    <div class="top-bar-container">
      <div>
        <el-input placeholder="请输入员工名称" prefix-icon="el-icon-search" size="small" class="search-input"
                  v-model="keyword" clearable @clear="searchEmp"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchEmp">搜索</el-button>
        <el-button type="primary" size="small">
          <i class="fa fa-angle-double-down"></i>高级搜索
        </el-button>
      </div>
      <div>
        <el-button type="success" size="small">
          <i class="fa fa-level-up"></i>导入数据
        </el-button>
        <el-button type="success" size="small">
          <i class="fa fa-level-down"></i>导出数据
        </el-button>
        <el-button type="primary" icon="el-icon-plus" size="small">添加员工</el-button>
      </div>
    </div>
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
            width="100">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="idCard"
            label="身份证号码"
            align="left"
            width="150">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            label="婚姻"
            width="80">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            label="民族"
            width="80">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            label="籍贯"
            width="80">
        </el-table-column>
        <el-table-column
            prop="politicsstatus.name"
            label="政治面貌">
        </el-table-column>
        <el-table-column
            prop="email"
            label="电子邮件"
            align="left"
            width="180">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="address"
            label="联系地址"
            align="left"
            width="230">
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="所属部门"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            width="100">
        </el-table-column>
        <el-table-column
            prop="jobLevel.name"
            label="职称"
            width="100">
        </el-table-column>
        <el-table-column
            prop="engageForm"
            label="聘用形式"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            label="入职日期"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            label="转正日期"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            label="合同起始日期"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="endContract"
            label="合同终止日期"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            label="合同期限"
            width="80">
          <template slot-scope="scope">
            {{ scope.row.contractTerm }}年
          </template>
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            label="最高学历"
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right"
            width="260">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="primary"
                @click="handleMoreInfo(scope.$index, scope.row)">高级资料
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      emps: [],
      total: 0,
      keyword: ''
    }
  },
  mounted() {
    this.initEmps();
  },
  methods: {
    initEmps() {
      this.loading = true;
      let url = '/emp/basic/' + '?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize + '&keyword=' + this.keyword;
      this.getRequest(url).then(resp => {
        if (resp) {
          if (resp.total === 0) {
            this.$message.info('未找到员工！')
          }
          this.emps = resp.data;
          this.total = resp.total;
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    searchEmp() {
      this.pageSize = 10;
      this.pageNum = 1;
      this.initEmps();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.pageNum = currentPage;
      this.initEmps();
    }
  }
}
</script>

<style scoped>
.top-bar-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.search-input {
  width: 400px;
  margin-right: 10px;
}

.top-bar-container .fa {
  margin-right: 5px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>