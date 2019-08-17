<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <div class="filter-container">
            <div class="left-items" style="float: left;">
              <el-input style="width: 200px" v-model="listQuery.keywords" placeholder="输入关键字"
                        @keyup.enter.native="getList"></el-input>
              <el-button style="margin-left: 20px" type="primary" icon="plus" v-if="hasPerm('org:list')" @click="getList">查询</el-button>
              <el-button type="primary" icon="plus" v-if="hasPerm('org:add')" @click="showCreate">新增</el-button>
              <el-button type="primary" @click="exportTable" v-if="hasPerm('org:list')">导出</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="承办方" prop="organizer" width="200"></el-table-column>
      <el-table-column align="center" label="承办方负责人" prop="organizerMasterName" width="120"></el-table-column>
      <el-table-column align="center" label="承办方地址" prop="organizerAddress"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="100"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="120"></el-table-column>
      <el-table-column align="center" label="管理" width="180" v-if="hasPerm('org:update')" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete"  v-if="hasPerm('org:delete')"
                     @click="removeUser(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<el-pagination-->
      <!--@size-change="handleSizeChange"-->
      <!--@current-change="handleCurrentChange"-->
      <!--:current-page="listQuery.pageNum"-->
      <!--:page-size="listQuery.pageRow"-->
      <!--:total="totalCount"-->
      <!--:page-sizes="[10, 20, 50, 100]"-->
      <!--layout="total, sizes, prev, pager, next, jumper">-->
    <!--</el-pagination>-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempData" label-position="right" label-width="120px"
               style='width: 650px; margin-left:50px; margin-right:50px;'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承办方" required>
              <el-input type="text" v-model="tempData.organizer">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承办方负责人" required>
              <el-select :filterable="true" v-model="tempData.organizerMaster" :clearable="true" placeholder="请选择人员">
                <el-option v-for="item in userList" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="承办地址" required>
              <el-input type="text" v-model="tempData.organizerAddress">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createData">添 加</el-button>
        <el-button type="primary" v-else @click="updateData">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 1000,//每页条数
          keywords:"", //关键字查询
        },
        userList: [],//课程类型 下拉列表
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '新建用户'
        },
        tempData: {
          id:'',
          organizer: '',
          organizerMaster:'',
          organizerMasterName: '',
          organizerAddress: ''
        }
      }
    },
    created() {
      this.getList();
      if (this.hasPerm('org:add') || this.hasPerm('org:update')) {
        this.getUsers();
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {
      getUsers() {
        this.api({
          url: "/SysOrganizer/getUsers",
          method: "get"
        }).then(data => {
          this.userList = data.result;
        })
      },
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/SysOrganizer/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.result;
          this.totalCount = data.totalCount;
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      handleFilter() {
        //查询事件
        this.listQuery.pageNum = 1
        this.getList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },

      showCreate() {
        //显示新增对话框
        this.tempData.organizer = "";
        this.tempData.organizerMaster = "";
        this.tempData.organizerMasterName = "";
        this.tempData.organizerAddress = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },

      showUpdate($index) {
        let tmp = this.list[$index];
        this.tempData.id=tmp.id;
        this.tempData.organizer = tmp.organizer;
        this.tempData.organizerMaster = tmp.organizerMaster;
        this.tempData.organizerMasterName = tmp.organizerMasterName;
        this.tempData.organizerAddress = tmp.organizerAddress;
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createData() {
        //添加新用户
        this.api({
          url: "/SysOrganizer/addData",
          method: "post",
          data: this.tempData
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateData() {
        //修改用户信息
        let _vue = this;
        this.api({
          url: "/SysOrganizer/updateData",
          method: "post",
          data: this.tempData
        }).then(() => {
          let msg = "修改成功";
          this.dialogFormVisible = false;
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              _vue.getList();
            }
          })
        })
      },
      removeUser($index) {
        let _vue = this;
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let course = _vue.list[$index];
          _vue.api({
            url: "/SysOrganizer/deleteData",
            method: "post",
            data: course
          }).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },
      exportTable() {
        require.ensure([], () => {
          const {export_json_to_excel} = require('../../excel/Export2Excel'); //这里必须使用绝对路径
          const tHeader = ['id', '承办方', '承办方负责人','承办方地址', '更新时间', '创建时间']; // 导出的表头名
          const filterVal = ['id', 'organizer', 'organizerMasterName', 'organizerAddress','updateTime', 'createTime']; // 导出的表头字段名
          const list = this.list;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, `承办方信息`);// 导出的表格名称，根据需要自己命名
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }

    }
  }
</script>
