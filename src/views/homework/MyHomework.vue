<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <div class="filter-container">
          <div class="left-items" style="float: left;">
            <el-select v-model="listQuery.courseId" placeholder="选择课程" style="width:250px;" @change="getList">
              <el-option label="请选择课程" value=""></el-option>
              <el-option
                v-for="item in courses"
                :key="item.id"
                :label="item.courseName"
                :value="item.id">
              </el-option>
            </el-select>
            <!--<el-input style="width: 200px" v-model="listQuery.keywords" placeholder="输入关键字"-->
                      <!--@keyup.enter.native="getList"></el-input>-->
            <el-button style="margin-left: 20px" type="primary" icon="plus" v-if="hasPerm('class:list')"
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
      <!--<el-table-column align="center" label="姓名" prop="nickName" width="100"></el-table-column>-->

      <el-table-column align="center" label="标题" prop="title"></el-table-column>
      <!--<el-table-column align="center" label="内容" prop="content" width="80"></el-table-column>-->
      <el-table-column align="center" label="心得字数" prop="homeworkWords" width="80"></el-table-column>
      <el-table-column align="center" label="公开程度" prop="secret" width="80"></el-table-column>
      <el-table-column align="center" label="讲师评阅" prop="comment" width="120"></el-table-column>
      <!--<el-table-column align="center" label="评阅学分" prop="reviewScore" width="100"></el-table-column>-->
      <!--<el-table-column align="center" label="评阅时间" prop="reviewTime" width="100"></el-table-column>-->

      <el-table-column align="center" label="创建时间" prop="createTime" width="100"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="120"></el-table-column>
      <el-table-column align="center" label="管理" width="120" v-if="hasPerm('class:update')" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">上传心得</el-button>
          <!--<el-button type="danger" icon="delete"  v-if="hasPerm('class:delete')"-->
                     <!--@click="removeData(scope.$index)">删除-->
          <!--</el-button>-->
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" fullscreen="true">
      <el-form class="small-space" :model="tempData" label-position="right" label-width="100px"
               style='margin-left:30px; margin-right:50px; ' >
        <el-row>
          <el-col :span="18">
            <el-form-item label="心得标题" required>
              <el-input type="text" v-model="tempData.title" style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公开程度" required>
              <el-select v-model="tempData.secret" placeholder="请选择" style="width:100%;">
                <el-option label="完全公开" value="完全公开"></el-option>
                <el-option label="平台可见" value="平台可见"></el-option>
                <el-option label="课程可见" value="课程可见"></el-option>
                <el-option label="班级可见" value="班级可见"></el-option>
                <el-option label="个人可见" value="个人可见"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="心得内容" required >
          <div>
            <quill-editor style="width:100%;" 
                          v-model="tempData.content"
                          ref="myQuillEditor"
                          :options="editorOption"
                          >
            </quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createData">添 加</el-button>
        <el-button type="primary" v-else @click="updateData">提 交</el-button>
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
          courseId:'',
          userId:'', //登录的用户id
        },
        courses:[], //课程列表
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
          reviewTime: ''
        }
      }
    },
    created() {
      this.listQuery.userId=this.userId;
      this.tempData.userId=this.userId;
      this.getCourses(); //获取所有课程信息
      //获取当前课程
      this.getList(); //获取班级内人员信息
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
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/MyHomework/list",
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


      showCreate() {
        //显示新增对话框
        this.tempData.courseId = this.listQuery.courseId;
        this.tempData.courseName = "";
        this.tempData.scheduleNo = "";
        this.tempData.scheduleId = "";
        this.tempData.scheduleName = "";
        this.tempData.scheduleDate = "";
        this.tempData.lastDate = "";

        this.tempData.hwkUserId = "";
        this.tempData.userName = "";
        this.tempData.nickName = "";

        this.tempData.title = "";
        this.tempData.content = "";
        this.tempData.homeworkWords = "";
        this.tempData.secret = "";
        this.tempData.comment = "";
        this.tempData.reviewScore = "";
        this.tempData.reviewTime = "";

        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
      showUpdate($index) {
        let tmp = this.list[$index];
        this.tempData.id=tmp.id;
        this.tempData.courseId = tmp.courseId;
        this.tempData.courseName = tmp.courseName;
        this.tempData.scheduleId = tmp.scheduleId;
        this.tempData.scheduleNo = tmp.scheduleNo;
        this.tempData.scheduleName = tmp.scheduleName;
        this.tempData.scheduleDate = tmp.scheduleDate;
        this.tempData.lastDate = tmp.lastDate;

        this.tempData.hwkUserId = tmp.hwkUserId;
        this.tempData.userName = tmp.userName;
        this.tempData.nickName = tmp.nickName;

        this.tempData.title=tmp.title;
        this.tempData.content=tmp.content;
        this.tempData.homeworkWords=tmp.homeworkWords;

        if (tmp.secret =="" || tmp.secret == null ){
          this.tempData.secret="完全公开";
        }
        else {
          this.tempData.secret=tmp.secret;
        }
        this.tempData.comment=tmp.comment;
        this.tempData.reviewScore=tmp.reviewScore;
        this.tempData.reviewTime=tmp.reviewTime;

        this.dialogStatus = "update";
        this.dialogFormVisible = true;
      },
      createData() {
        //添加新数据
        this.api({
          url: "/MyHomework/addData",
          method: "post",
          data: this.tempData
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateData() {
        //修改信息
        let tmpContent=this.tempData.content.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ');
        let tmpWords=tmpContent.replace(/\s+/g,"").length;
        if (tmpWords<2000)
        {
          this.$confirm('您的心得字数不足2000, 是否继续提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ///继续提交
            this.tempData.homeworkWords=tmpWords;
            let _vue = this;
            this.api({
              url: "/MyHomework/updateData",
              method: "post",
              data: this.tempData
            }).then(() => {
              let msg = "上传心得成功";
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

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            });
          });

          /////
        }
        else {

          this.tempData.homeworkWords=tmpWords;
          let _vue = this;
          this.api({
            url: "/MyHomework/updateData",
            method: "post",
            data: this.tempData
          }).then(() => {
            let msg = "上传心得成功";
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

          ////
        }

      },
      removeData($index) {
        let _vue = this;
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let cla = _vue.list[$index];
          _vue.api({
            url: "/MyHomework/deleteData",
            method: "post",
            data: cla
          }).then(() => {
            _vue.getList();
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },
      // exportTable() {
      //   require.ensure([], () => {
      //     const {export_json_to_excel} = require('../../excel/Export2Excel'); //这里必须使用绝对路径
      //     const tHeader = ['id', '课程', '课时编号', '课时名称', '日期', '时段', '签到时间', '心得字数', '最晚提交时间', '签到学分', '按时提交学分', '作业字数学分', '讲师评阅学分', '更新时间', '创建时间']; // 导出的表头名
      //     const filterVal = ['id', 'courseName', 'scheduleNo', 'scheduleName', 'scheduleDate', 'period', 'startTime', 'homeworkWords', 'lastDate', 'signScore', 'homeworkTimeScore', 'homeworkWordsScore', 'reviewScore', 'updateTime', 'createTime']; // 导出的表头字段名
      //     const list = this.list;
      //     const data = this.formatJson(filterVal, list);
      //     export_json_to_excel(tHeader, data, `课程表信息`);// 导出的表格名称，根据需要自己命名
      //   })
      // },
      // formatJson(filterVal, jsonData) {
      //   return jsonData.map(v => filterVal.map(j => v[j]))
      // }

    }
  }
  Date.prototype.Format = function(fmt)
  { //author: meizz
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  }
</script>

