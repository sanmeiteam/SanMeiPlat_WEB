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
                       style="width:250px;" @change="getList" v-if="listQuery.courseId>'' && this.role!='学员'">
              <el-option label="按课时查询" value=""></el-option>
              <el-option
                v-for="item in classSchedule"
                :key="item.id"
                :label="item.scheduleName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select id="selectUser" v-model="listQuery.tempUserId" clearable placeholder="选择学员"
                       style="width:250px;" @change="getList" v-if="listQuery.courseId>'' && this.role!='学员'">
              <el-option label="按学员查询" value=""></el-option>
              <el-option
                v-for="item in classUsers"
                :key="item.id"
                :label="item.nickname"
                :value="item.id">
              </el-option>
            </el-select>
            <!--<el-input style="width: 200px" v-model="listQuery.keywords" placeholder="输入关键字"-->
            <!--@keyup.enter.native="getList"></el-input>-->
            <el-button style="margin-left: 20px" type="primary" icon="plus" v-if="hasPerm('cosScore:list')"
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
      <el-table-column align="center" label="课时名称" prop="scheduleName" width="80"></el-table-column>
      <el-table-column align="center" label="姓名" prop="userName" width="80"></el-table-column>
      <el-table-column align="center" label="按时签到" prop="signScore" width="80"></el-table-column>
      <el-table-column align="center" label="作业字数" prop="hwkScore" width="80"></el-table-column>
      <el-table-column align="center" label="按时提交作业" prop="timeScore" width="120"></el-table-column>
      <el-table-column align="center" label="讲师评阅" prop="actReviewScore" width="80"></el-table-column>
      <el-table-column align="center" label="课时总分" prop="scores" width="80"></el-table-column>

    </el-table>

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
          pageRow: 1000,//每页条数
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
        }

      }
    },
    created() {
      this.listQuery.userId=this.userId;

      this.getCourses(); //获取所有课程信息
      //获取当前课程
      this.getList(); //获取班级内人员信息
      //alert(this.role);
    },
    computed: {
      ...mapGetters([
        'id',
        'role',
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
        if (this.role == "学员") {
          this.listQuery.tempUserId=this.userId;
          this.getList();
        }
        else {
          this.getCourseSchedule();
          this.getClassUsers();
          this.getList();
        }
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
          url: "/MyHomework/hwkStatistics",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.result;
          this.totalCount = data.totalCount;
        })
      },

      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },


    }
  }

</script>

