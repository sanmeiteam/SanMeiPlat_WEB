<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <div class="filter-container">
          <div class="left-items" style="float: left;">

            <el-input style="width: 250px" v-model="listQuery.keywords" placeholder="输入关键字"
                      @keyup.enter.native="getList"></el-input>
            <el-select v-model="listQuery.role" placeholder="按角色查询" style="width:150px;" @change="getList">
              <el-option label="所有角色" value=""></el-option>
              <el-option label="讲师" value="讲师"></el-option>
              <el-option label="助教" value="助教"></el-option>
              <el-option label="班长" value="班长"></el-option>
              <el-option label="组长" value="组长"></el-option>
              <el-option label="学员" value="学员"></el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" icon="plus" v-if="hasPerm('class:list')"
                       @click="getList">查询
            </el-button>
            <el-button type="primary" icon="plus" v-if="hasPerm('class:add')" @click="showCreate">新增</el-button>
            <el-button type="primary" @click="exportTable" v-if="hasPerm('class:list')">导出</el-button>
          </div>
          <div style="float:left; margin-left: 20px;">
            <el-upload
              class="upload-demo"
              action="api/user/importUserExcel"
              :multiple="false"
              :on-success="onSuccess"
              limit="100"
              :show-file-list="false">
              <el-button v-if="hasPerm('class:importExcel')" size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-table :data="list"
              v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="课程" prop="courseName" style="width: 120px;"></el-table-column>
      <el-table-column align="center" label="账号" prop="username"></el-table-column>
      <el-table-column align="center" label="姓名" prop="nickname"></el-table-column>
      <el-table-column align="center" label="性别" prop="sex" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="角色" prop="role" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="是否复训" prop="oldMember" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="分数" prop="score" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="170"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="170"></el-table-column>
      <el-table-column align="center" label="管理" width="220" v-if="hasPerm('class:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete"  v-if="hasPerm('class:delete')"
                     @click="removeData(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempData" label-position="right" label-width="120px"
               style='width: 650px; margin-left:50px; margin-right:50px;'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程/班级" required>
              <el-input type="text" v-model="tempData.courseName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" required>
              <el-input type="text" v-model="tempData.nickname">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" required>
              <el-input type="text" v-model="tempData.username">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" required>
              <el-input type="text" v-model="tempData.sex">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" required>
              <el-select v-model="tempData.role" placeholder="请选择">
                <el-option label="讲师" value="讲师"></el-option>
                <el-option label="助教" value="助教"></el-option>
                <el-option label="班长" value="班长"></el-option>
                <el-option label="组长" value="组长"></el-option>
                <el-option label="学员" value="学员"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学分" required>
              <el-input type="text" v-model="tempData.score">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否复训" required>
              <el-input type="text" v-model="tempData.oldMember">
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

const ColProps = {
xs: 24,
sm: 12,
lg: 6,
style: {
marginBottom: 5,
},
}

<style rel="stylesheet/scss" lang="scss" scoped>
  .button {

  }
</style>

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
          pageRow: 50,//每页条数
          keywords: '', //关键字查询
          role: '',//角色 班内角色
        },
        curCourseId:'',
        curCourseName:'',
        courses:[], //课程列表
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        input: {
          keywords: ''
        },
        tempData: {
          id:'',
          courseId: '',
          courseName: '',
          userId: '',
          username: '',
          nickname: '',
          sex: '',
          role: '',
          oldMember: '',
          score: ''
        }
      }
    },
    created() {
      this.getCourses(); //获取所有课程信息
      //获取当前课程
      this.getList(); //获取班级内人员信息
    },
    computed: {
      ...mapGetters([
        'id'
      ])
    },
    methods: {

      getCourses() {
        this.api({
          url: "/CosClass/getCourses",
          method: "get"
        }).then(data => {
          this.courses = data.list;
        })
      },
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/CosClass/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      onSuccess() {
        this.$message({
          message: "上传成功",
          type: 'success',
          duration: 1 * 1000,
          onClose: () => {
            this.getList();
          }
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val;
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleFilter() {
        //查询事件
        this.listQuery.pageNum = 1;
        this.getList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showCreate() {
        //显示新增对话框
        this.tempData.userId = "";
        this.tempData.username = "";
        this.tempData.nickname = "";
        this.tempData.sex = "";
        this.tempData.role = "";
        this.tempData.oldMember = "";
        this.tempData.score = "";
        this.dialogStatus = "create";
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let cla = this.list[$index];
        this.tempData.id=cla.id;
        this.tempData.userId = cla.userId;
        this.tempData.username = cla.username;
        this.tempData.nickname = cla.nickname;
        this.tempData.sex = cla.sex;
        this.tempData.role = cla.role;
        this.tempData.score = cla.score;
        this.dialogStatus = "update";
        this.dialogFormVisible = true
      },
      createData() {
        //添加新数据
        this.api({
          url: "/CosClass/addData",
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
          url: "/CosClass/updateData",
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
      removeData($index) {
        let _vue = this;
        this.$confirm('确定删除此用户?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let cla = _vue.list[$index];
          _vue.api({
            url: "/user/deleteClass",
            method: "post",
            data: cla
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
          const tHeader = ['id', '姓名', '用户名', '角色id', '性别', '年龄', '电话', 'QQ', '微信', '区域', '学历', '介绍人', '更新时间', '创建时间']; // 导出的表头名
          const filterVal = ['userId', 'nickname', 'username', 'roleId', 'sex', 'age', 'phone', 'qq', 'wechat', 'aera', 'education', 'introducer', 'updateTime', 'createTime']; // 导出的表头字段名
          const list = this.list;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, `人员信息表`);// 导出的表格名称，根据需要自己命名
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }


    }
  }
</script>

