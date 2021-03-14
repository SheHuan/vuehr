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
        <el-button type="primary" icon="el-icon-plus" size="small" @click="showAddEmpDialog">添加员工</el-button>
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
                @click="handleEditEmployee(scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="primary"
                @click="handleMoreInfo(scope.$index, scope.row)">高级资料
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDeleteEmployee(scope.row)">删除
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
    <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        @close="closeEmployeeDialog"
        width="70%">
      <div>
        <el-form :model="emp" :rules="empRules" ref="empForm">
          <el-row :gutter="0">
            <el-col :span="6">
              <el-form-item label="姓名:" prop="name">
                <el-input class="emp-info-item" placeholder="请输入员工姓名" size="mini" prefix-icon="el-icon-edit"
                          v-model="emp.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                    class="emp-info-item"
                    v-model="emp.birthday"
                    type="date"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌:" prop="politicId">
                <el-select class="emp-info-item2" v-model="emp.politicId" placeholder="请选择政治面貌" size="mini">
                  <el-option
                      v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="6">
              <el-form-item label="民族:" prop="nationId">
                <el-select class="emp-info-item" v-model="emp.nationId" placeholder="请选择民族" size="mini">
                  <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input class="emp-info-item" placeholder="请输入籍贯" size="mini" prefix-icon="el-icon-edit"
                          v-model="emp.nativePlace"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input class="emp-info-item" placeholder="请输入电子邮箱" size="mini" prefix-icon="el-icon-message"
                          v-model="emp.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系地址:" prop="address">
                <el-input class="emp-info-item2" placeholder="请输入联系地址" size="mini" prefix-icon="el-icon-edit"
                          v-model="emp.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <el-select class="emp-info-item" v-model="emp.posId" placeholder="请选择职位" size="mini">
                  <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select class="emp-info-item" v-model="emp.jobLevelId" placeholder="请选择职称" size="mini">
                  <el-option
                      v-for="item in jobLevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:" prop="departmentId">
                <el-popover
                    placement="right"
                    title="请选择部门"
                    width="260"
                    trigger="manual"
                    v-model="depViewVisible">
                  <el-tree
                      :data="allDeps"
                      :props="defaultProps"
                      default-expand-all
                      @node-click="handleDepNodeClick"></el-tree>
                  <div slot="reference" class="emp-info-item3" @click="showDepView">{{ currentEmpName }}</div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码:" prop="phone">
                <el-input class="emp-info-item" placeholder="请输入电话号码" size="mini" prefix-icon="el-icon-phone"
                          v-model="emp.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="phone">
                <el-input class="emp-info-item" disabled size="mini" v-model="emp.workID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select class="emp-info-item" v-model="emp.tiptopDegree" placeholder="请选择学历" size="mini">
                  <el-option
                      v-for="item in tiptopDegrees"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校:" prop="school">
                <el-input class="emp-info-item" placeholder="请输入毕业院校" size="mini" prefix-icon="el-icon-edit"
                          v-model="emp.school"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称:" prop="specialty">
                <el-input class="emp-info-item2" placeholder="请输入专业名称" size="mini" prefix-icon="el-icon-edit"
                          v-model="emp.specialty"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <el-date-picker
                    class="emp-info-item"
                    v-model="emp.beginDate"
                    type="date"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    placeholder="入职日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                    class="emp-info-item"
                    v-model="emp.conversionTime"
                    type="date"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    placeholder="转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginContract">
                <el-date-picker
                    class="emp-info-item"
                    v-model="emp.beginContract"
                    type="date"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    placeholder="合同起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同终止日期:" prop="endContract">
                <el-date-picker
                    class="emp-info-item"
                    v-model="emp.endContract"
                    type="date"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    placeholder="合同终止日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号:" prop="idCard">
                <el-input class="emp-info-item2" placeholder="请输入身份证号" size="mini" prefix-icon="el-icon-edit"
                          v-model="emp.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式:" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况:" prop="wedlock">
                <el-radio-group v-model="emp.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddEmployee">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      depViewVisible: false,
      dialogVisible: false,
      loading: false,
      pageNum: 1,
      pageSize: 10,
      emps: [],
      total: 0,
      keyword: '',
      dialogTitle: '',
      emp: {
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "",
        workID: "",
        conversionTime: "",
        notWorkDate: null,
        beginContract: "",
        endContract: "",
        workAge: null
      },
      empRules: {
        name: [{required: true, message: "请输入姓名", trigger: "blur"}],
        gender: [{required: true, message: "请选择性别", trigger: "blur"}],
        birthday: [{required: true, message: "请选择生日", trigger: "blur"}],
        idCard: [{required: true, message: "请输入身份证号", trigger: "blur"}],
        wedlock: [{required: true, message: "请选择婚姻状况", trigger: "blur"}],
        nationId: [{required: true, message: "请选择民族", trigger: "blur"}],
        nativePlace: [{required: true, message: "请输入籍贯", trigger: "blur"}],
        politicId: [{required: true, message: "请选择政治面貌", trigger: "blur"}],
        email: [{required: true, message: "请输入电子邮箱", trigger: "blur"}, {
          type: "email",
          message: "邮箱格式错误",
          trigger: "blur"
        }],
        phone: [{required: true, message: "请输入电话号码", trigger: "blur"}],
        address: [{required: true, message: "请输入联系地址", trigger: "blur"}],
        departmentId: [{required: true, message: "请选择部门", trigger: "blur"}],
        jobLevelId: [{required: true, message: "请选择职称", trigger: "blur"}],
        posId: [{required: true, message: "请选择职位", trigger: "blur"}],
        engageForm: [{required: true, message: "请选择聘用形式", trigger: "blur"}],
        tiptopDegree: [{required: true, message: "请选择学历", trigger: "blur"}],
        specialty: [{required: true, message: "请输入专业名称", trigger: "blur"}],
        school: [{required: true, message: "请输入毕业院校", trigger: "blur"}],
        beginDate: [{required: true, message: "请选择入职日期", trigger: "blur"}],
        conversionTime: [{required: true, message: "请选择转正日期", trigger: "blur"}],
        beginContract: [{required: true, message: "请选择合同起始日期", trigger: "blur"}],
        endContract: [{required: true, message: "请选择合同终止日期", trigger: "blur"}]
      },
      // 民资
      nations: [],
      // 政治面貌
      politicsstatus: [],
      // 职称
      jobLevels: [],
      // 职位
      positions: [],
      // 学历
      tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '幼儿园'],
      // 部门
      allDeps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentEmpName: '请选择部门'
    }
  },
  mounted() {
    this.initEmps();
    this.initPositions();
    this.initData();
  },
  methods: {
    initEmps() {
      this.loading = true;
      let url = '/employee/basic/' + '?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize + '&keyword=' + this.keyword;
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
    },
    showAddEmpDialog() {
      this.dialogTitle = "添加员工";
      this.dialogVisible = true;
      this.getMaxWorkID();
    },
    initData() {
      // 请求民族数据
      let nations = window.sessionStorage.getItem('nations');
      if (!nations) {
        this.getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem('nations', JSON.stringify(resp));
          }
        });
      } else {
        this.nations = JSON.parse(nations);
      }
      // 请求政治面貌
      let politicsstatus = window.sessionStorage.getItem('politicsstatus');
      if (!politicsstatus) {
        this.getRequest('/employee/basic/politicsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp;
            window.sessionStorage.setItem('politicsstatus', JSON.stringify(resp));
          }
        });
      } else {
        this.politicsstatus = JSON.parse(politicsstatus);
      }
      // 请求职称
      let joblevels = window.sessionStorage.getItem('joblevels');
      if (!joblevels) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.jobLevels = resp;
            window.sessionStorage.setItem('joblevels', JSON.stringify(resp));
          }
        })
      } else {
        this.jobLevels = JSON.parse(joblevels);
      }
      // 请求部门
      let allDeps = window.sessionStorage.getItem('allDeps');
      if (!allDeps) {
        this.getRequest('/employee/basic/departments').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem('allDeps', JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(allDeps);
      }
    },
    initPositions() {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    // 获取工号
    getMaxWorkID() {
      this.getRequest('/employee/basic/maxWorkID').then(resp => {
        if (resp) {
          this.emp.workID = resp.obj;
        }
      })
    },
    showDepView() {
      this.depViewVisible = true;
    },
    // 选择部门
    handleDepNodeClick(itemEmp) {
      this.depViewVisible = false;
      this.emp.departmentId = itemEmp.id;
      this.currentEmpName = itemEmp.name;
    },
    // 添加员工/编辑员工
    doAddEmployee() {
      this.$refs.empForm.validate((valid) => {
        if (valid) {
          console.log('111')
          if (this.emp.id) {// 编辑
            console.log('222')
            this.putRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps()
              }
            })
          } else {// 添加
            console.log('333')
            this.postRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps()
              }
            })
          }
        }
      })
    },
    // 删除
    handleDeleteEmployee(emp) {
      this.$confirm('此操作将永久删除【' + emp.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/employee/basic/' + emp.id).then(resp => {
          if (resp) {
            this.initEmps();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // 编辑员工
    handleEditEmployee(emp) {
      this.dialogTitle = "编辑员工";
      this.dialogVisible = true;
      this.emp = emp;
      this.currentEmpName = emp.department.name;
    },
    // 清空emp信息
    emptyEmployee() {
      this.emp = {
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "",
        workID: "",
        conversionTime: "",
        notWorkDate: null,
        beginContract: "",
        endContract: "",
        workAge: null
      };
      this.currentEmpName = '请选择部门';
    },
    closeEmployeeDialog() {
      this.depViewVisible = false;
      this.emptyEmployee();
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

.emp-info-item {
  width: 150px;
}

.emp-info-item2 {
  width: 200px;
}

.emp-info-item3 {
  display: inline-block;
  box-sizing: border-box;
  width: 150px;
  height: 28px;
  line-height: 28px;
  font-size: 13px;
  color: #606266;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  cursor: pointer;
  vertical-align: middle;
  padding-left: 8px;
}
</style>