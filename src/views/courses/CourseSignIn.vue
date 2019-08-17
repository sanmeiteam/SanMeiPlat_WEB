<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <div class="filter-container">
          <div class="left-items" style="float: left;">
            <el-select v-model="listQuery.courseId" placeholder="选择课程" style="width:250px;"
                       @change="getDropList">
              <el-option label="请选择课程" value=""></el-option>
              <el-option
                v-for="item in courses"
                :key="item.id"
                :label="item.courseName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="listQuery.tempScheduleId" clearable placeholder="选择课时"
                       style="width:250px;" @change="getList" v-if="listQuery.courseId>''">
              <el-option label="按课时查询" value=""></el-option>
              <el-option
                v-for="item in classSchedule"
                :key="item.id"
                :label="item.scheduleName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" icon="plus" v-if="hasPerm('sign:list')"
                       @click="getList">查询
            </el-button>
            <!--<el-button type="primary" icon="plus" v-if="hasPerm('class:add')&&listQuery.courseId>''" @click="showCreate">新增</el-button>-->
            <!--<el-button type="primary" @click="exportTable" v-if="hasPerm('class:list')&&listQuery.courseId>''">导出</el-button>-->
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-table :data="list"
              v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="课时名称" prop="scheduleName"></el-table-column>
      <el-table-column align="center" label="日期" prop="scheduleDate" width="100"></el-table-column>
      <el-table-column align="center" label="上课时间" prop="startTime" width="100"></el-table-column>
      <el-table-column align="center" label="姓名" prop="nickName" width="100"></el-table-column>
      <el-table-column align="center" label="是否签到" prop="isSign" width="80"></el-table-column>
      <el-table-column align="center" label="签到状态" prop="signState" width="80"></el-table-column>
      <el-table-column align="center" label="补签人" prop="signUserName" width="80"></el-table-column>
      <el-table-column align="center" label="签到时间" prop="signTime" width="100"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="100"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="120"></el-table-column>
      <el-table-column align="center" label="管理" width="120" v-if="hasPerm('sign:add')" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="signData(scope.$index)" v-if="list[scope.$index].isSign!='是'" >补签</el-button>
          <el-button type="primary" icon="edit" v-if="list[scope.$index].isSign=='是'" disabled="disabled" >补签</el-button>
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
          pageRow: 100,//每页条数
          keywords: '', //关键字查询
          role: '',//角色 班内角色
          courseId:'',
          tempUserId:'',//选择学员ID
          userId:'', //登录用户ID
          tempScheduleId:'', //选择课时ID
        },
        courses:[], //课程列表
        classUsers:[], //班内人员列表
        classSchedule:[], //课时列表
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编写心得',
          create: '添加'
        },
        tempData: {
          id:'',
          userId:'', //  此处是 登录人
          signUser:'', //  此处是 签到人
          scheduleId: '',
          scheduleDate: '',
          startTime: '',
          signTime:''
        }
      }
    },
    created() {
      this.listQuery.userId=this.userId;
      this.tempData.userId=this.userId;
      this.getCourses(); //获取所有课程信息
      //获取当前课程
      this.getList(); //获取签到信息
      document.addEventListener('keydown',this.handleEvent);
    },
    computed: {
      ...mapGetters([
        'id',
        'userId'
      ])
    },
    methods: {
      getCourses() {
        this.api({
          url: "/CosCourses/getCourses",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.courses = data.result;
        })
      },
      getDropList(){
        this.getCourseSchedule();
        // this.getClassUsers();
        this.getList();
      },
      getCourseSchedule() {
        this.api({
          url: "/MyHomework/getCourseSchedule",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.classSchedule = data.result;
        })
      },
      getClassUsers() {
        this.api({
          url: "/MyHomework/getClassUsers",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.classUsers = data.result;
        })
      },
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/sign/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.result;
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

      signData($index) {
        //签到
        let tmp = this.list[$index];
        this.tempData.scheduleId = tmp.scheduleId;
        this.tempData.scheduleDate = tmp.scheduleDate;
        this.tempData.startTime = tmp.startTime;
        this.tempData.signTime = tmp.signTime;
        this.tempData.signUser = tmp.signUser;

        let _vue = this;
        this.api({
          url: "/sign/addData",
          method: "post",
          data: this.tempData
        }).then(() => {
          let msg = "签到成功";
          this.dialogFormVisible = false;
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 500,
            onClose: () => {
              _vue.getList();
            }
          })
        })
      },

    }
  }

</script>

