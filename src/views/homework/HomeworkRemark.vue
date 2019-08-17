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
            <el-select v-model="listQuery.tempUserId" clearable placeholder="选择学员"
                       style="width:250px;" @change="getList" v-if="listQuery.courseId>''">
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
            <el-button style="margin-left: 20px" type="primary" icon="plus" v-if="hasPerm('hwkR:list')"
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
      <!--<el-table-column align="center" label="日期" prop="scheduleDate" width="100"></el-table-column>-->
      <el-table-column align="center" label="最晚提交时间" prop="lastDate" width="120"></el-table-column>

      <!--<el-table-column align="center" label="用户id" prop="hwkUserId" width="120"></el-table-column>-->
      <!--<el-table-column align="center" label="用户名" prop="userName" width="100"></el-table-column>-->
      <el-table-column align="center" label="姓名" prop="nickName" width="100"></el-table-column>

      <el-table-column align="center" label="标题" prop="title"></el-table-column>
      <!--<el-table-column align="center" label="内容" prop="content" width="80"></el-table-column>-->
      <el-table-column align="center" label="心得字数" prop="homeworkWords" width="80"></el-table-column>
      <el-table-column align="center" label="公开程度" prop="secret" width="80"></el-table-column>
      <el-table-column align="center" label="讲师评阅" prop="showComment" width="120"></el-table-column>
      <!--<el-table-column align="center" label="评阅学分" prop="reviewScore" width="100"></el-table-column>-->
      <!--<el-table-column align="center" label="评阅时间" prop="reviewTime" width="100"></el-table-column>-->

      <el-table-column align="center" label="创建时间" prop="createTime" width="100"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="120"></el-table-column>
      <el-table-column align="center" label="管理" width="120" v-if="hasPerm('hwkR:update')" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">评阅心得</el-button>
          <!--<el-button type="danger" icon="delete"  v-if="hasPerm('class:delete')"-->
          <!--@click="removeData(scope.$index)">删除-->
          <!--</el-button>-->
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" fullscreen="true">
      <el-form class="small-space" :model="tempData" label-position="right" label-width="100px"
               style='margin-left:30px; margin-right:50px; ' >
        <el-row>
          <el-col :span="18">
            <el-form-item label="心得标题">
              <el-input type="text" v-model="tempData.title" style="width: 100%;" disabled="disabled">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公开程度">
              <el-select v-model="tempData.secret" placeholder="请选择" style="width:100%;" disabled="disabled">
                <el-option label="完全公开" value="完全公开"></el-option>
                <el-option label="平台可见" value="平台可见"></el-option>
                <el-option label="课程可见" value="课程可见"></el-option>
                <el-option label="班级可见" value="班级可见"></el-option>
                <el-option label="个人可见" value="个人可见"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="心得内容" >
          <div>
            <quill-editor style="width:100%;"
                          v-model="tempData.content"
                          ref="myQuillEditor"
                          :options="editorOption"
                          disabled="disabled"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item label="讲师评阅" style="font-weight:bold;">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="tempData.comment">
          </el-input>
        </el-form-item>
        <el-form-item label="评阅学分" style="font-weight:bold;">
          <!--<el-select v-model="tempData.reviewScore" placeholder="请选择" >-->
            <!--<el-option label="4" value="4"></el-option>-->
            <!--<el-option label="3" value="3"></el-option>-->
            <!--<el-option label="2" value="2"></el-option>-->
            <!--<el-option label="1" value="1"></el-option>-->
            <!--<el-option label="0" value="0"></el-option>-->
          <!--</el-select>-->
          <el-rate
            v-model="tempData.reviewScore"
            show-score style="padding-top:9px;" :max="4"
            text-color="#ff9900"
            score-template="  {value}分">
          </el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;margin-top:-40px;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviewData">提 交</el-button>
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
        },
        tempData: {
          id:'',
          userId:'', //登录用户ID
          courseId: '',
          courseName: '',
          scheduleId: '',
          scheduleNo: '',
          scheduleName: '',
          scheduleDate: '',
          lastDate: '',

          hwkUserId: '',
          userName: '',
          nickName: '',

          title: '',
          content: '',
          homeworkWords: '',
          secret: '',
          comment: '',
          reviewScore: '',
          reviewTime: '',
          reviewTeacherId: ''
        }
      }
    },
    created() {
      this.listQuery.userId=this.userId;
      this.tempData.userId=this.userId;
      this.getCourses(); //获取所有课程信息
      //获取当前课程
      this.getList(); //获取班级内人员信息
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
        this.getClassUsers();
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
          url: "/MyHomework/remarkList",
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
      //自定义方法---


      showUpdate($index) {
        let tmp = this.list[$index];
        this.tempData.id=tmp.id;
        // this.tempData.courseId = tmp.courseId;
        // this.tempData.courseName = tmp.courseName;
        // this.tempData.scheduleId = tmp.scheduleId;
        // this.tempData.scheduleNo = tmp.scheduleNo;
        // this.tempData.scheduleName = tmp.scheduleName;
        // this.tempData.scheduleDate = tmp.scheduleDate;
        // this.tempData.lastDate = tmp.lastDate;
        //
        // this.tempData.hwkUserId = tmp.hwkUserId;
        // this.tempData.userName = tmp.userName;
        // this.tempData.nickName = tmp.nickName;

        this.tempData.title=tmp.title;
        this.tempData.content=tmp.content;
        // this.tempData.homeworkWords=tmp.homeworkWords;

        if (tmp.secret =="" || tmp.secret == null ){
          this.tempData.secret="完全公开";
        }
        else {
          this.tempData.secret=tmp.secret;
        }
        this.tempData.comment=tmp.comment;
        if (tmp.reviewScore=="" || tmp.reviewScore==null) {
          this.tempData.reviewScore='4';
        }
        else{
          this.tempData.reviewScore=tmp.reviewScore;
        }
        this.tempData.reviewTime=tmp.reviewTime;
        this.tempData.reviewTeacherId=this.userId;

        this.dialogStatus = "update";
        this.dialogFormVisible = true;
      },
      reviewData() {
        //保存&草稿
        // this.tempData.comment=this.comment.content.replace(/\t+/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
        let _vue = this;
        this.api({
          url: "/MyHomework/remarkData",
          method: "post",
          data: this.tempData
        }).then(() => {
          let msg = "评阅成功";
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

    }
  }

</script>

