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
            <el-input style="width: 200px" v-model="listQuery.keywords" placeholder="输入关键字"
                      @keyup.enter.native="getList"></el-input>
            <el-button style="margin-left: 20px" type="primary" icon="plus" v-if="hasPerm('class:list')"
                       @click="getList">查询
            </el-button>
            <el-button type="primary" icon="plus" v-if="hasPerm('class:add')&&listQuery.courseId>''" @click="showCreate">新增</el-button>
            <el-button type="primary" @click="exportTable" v-if="hasPerm('class:list')&&listQuery.courseId>''">导出</el-button>
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
      <!--<el-table-column align="center" label="课程" prop="courseName" width="200"></el-table-column>-->
      <el-table-column align="center" label="课时编号" prop="scheduleNo" width="80"></el-table-column>
      <el-table-column align="center" label="课时名称" prop="scheduleName"></el-table-column>
      <el-table-column align="center" label="日期" prop="scheduleDate" width="100"></el-table-column>
      <el-table-column align="center" label="时段" prop="period" width="80"></el-table-column>
      <el-table-column align="center" label="签到时间" prop="startTime" width="100"></el-table-column>
      <el-table-column align="center" label="心得字数" prop="homeworkWords" width="80"></el-table-column>
      <el-table-column align="center" label="最晚提交时间" prop="lastDate" width="120"></el-table-column>
      <!--<el-table-column align="center" label="签到学分" prop="signScore" width="80"></el-table-column>-->
      <!--<el-table-column align="center" label="按时提交" prop="homeworkTimeScore" width="80"></el-table-column>-->
      <!--<el-table-column align="center" label="字数符合" prop="homeworkWordsScore" width="80"></el-table-column>-->
      <!--<el-table-column align="center" label="讲师评阅" prop="reviewScore" width="80"></el-table-column>-->
      <el-table-column align="center" label="创建时间" prop="createTime" width="100"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="120"></el-table-column>
      <el-table-column align="center" label="管理" width="320" v-if="hasPerm('class:update')" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" icon="edit" @click="showQRCode(scope.$index)">签到二维码</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="margin-top:-5vh;">
      <el-form class="small-space" :model="tempData" label-position="right" label-width="120px"
               style='width: 650px; margin-left:50px; margin-right:50px;'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课时编号" required>
              <el-select v-model="tempData.scheduleNo" placeholder="请选择" @change="setScheduleName">
                <el-option label="0" value="0"></el-option>
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
                <el-option label="5" value="5"></el-option>
                <el-option label="6" value="6"></el-option>
                <el-option label="7" value="7"></el-option>
                <el-option label="8" value="8"></el-option>
                <el-option label="9" value="9"></el-option>
                <el-option label="10" value="10"></el-option>
                <el-option label="11" value="11"></el-option>
                <el-option label="12" value="12"></el-option>
                <el-option label="13" value="13"></el-option>
                <el-option label="14" value="14"></el-option>
                <el-option label="15" value="15"></el-option>
                <el-option label="16" value="16"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课时名称" required>
              <el-input type="text" v-model="tempData.scheduleName" disabled="disabled">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开课日期" required>
              <el-date-picker v-model="tempData.scheduleDate"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              style="width:205px;"
                              @change="setLastDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课时段" required>
              <el-select v-model="tempData.period" placeholder="请选择">
                <el-option label="上午" value="上午"></el-option>
                <el-option label="下午" value="下午"></el-option>
                <el-option label="晚上" value="晚上"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="签到时间" required>
              <el-time-select
                v-model="tempData.startTime"
                :picker-options="{
    start: '08:00',
    step: '00:30',
    end: '19:30'
  }"
                placeholder="签到时间"
                format="HH:mm"
                value-format="HH:mm"
                style="width:205px;">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="心得字数" required>
              <el-input type="text" v-model="tempData.homeworkWords">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最晚提交时间" required>
              <el-date-picker v-model="tempData.lastDate"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              style="width:205px;" disabled="disabled">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="签到学分" required>
              <el-input type="text" v-model="tempData.signScore">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按时提交学分" required>
              <el-input type="text" v-model="tempData.homeworkTimeScore">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业字数学分" required>
              <el-input type="text" v-model="tempData.homeworkWordsScore">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="讲师评阅学分" required>
              <el-input type="text" v-model="tempData.reviewScore">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="QRCodeDialogFormVisible" style="margin-top:-5vh;">
      <el-form class="small-space" :model="tempData" label-position="right" label-width="120px"
               style='width: 500px;'>
        <div style="width:500px;text-align:center; margin-left: 150px;margin-top:-50px;">
          <canvas id="canvas" style="display: none;"></canvas>
          <img id="img">
        </div>
      </el-form>
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
  import QRCode from 'qrcode'
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
        QRCodeDialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加',
          qrcode: '签到二维码'
        },
        tempData: {
          id:'',
          courseId: '',
          courseName: '',
          scheduleNo: '',
          scheduleName: '',
          scheduleDate: '',
          period: '',
          startTime: '',
          homeworkWords: '',
          lastDate: '',
          signScore: '',
          homeworkTimeScore: '',
          homeworkWordsScore: '',
          reviewScore: ''
        },
        codes:'',
        imgUrl:''
      }
    },
    created() {
      this.listQuery.userId=this.userId;
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
    components: {
      QRCode: QRCode
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
          url: "/CosCourseSchedule/list",
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
      //选择课时编号时，自动生成课时名称
      setScheduleName() {
        if (this.tempData.scheduleNo=="0")
        {
          this.tempData.scheduleName="面试课";
        }
        else {
          this.tempData.scheduleName="第"+this.tempData.scheduleNo+"课";
        }
      },
      //选择开课时间时，设置最晚提交作业时间
      setLastDate() {
        var str = this.tempData.scheduleDate;
        str = str.replace(/-/g, '/');
        var date = new Date(str);
        date.setDate(date.getDate() + 3);
        this.tempData.lastDate=date.Format("yyyy-MM-dd");
      },

      showCreate() {
        //显示新增对话框
        this.tempData.courseId = this.listQuery.courseId;
        this.tempData.courseName = "";
        this.tempData.scheduleNo = "";
        this.tempData.scheduleName = "";
        this.tempData.scheduleDate = "";
        this.tempData.period = "上午";
        this.tempData.startTime = "8:30";
        this.tempData.homeworkWords = "2000";
        this.tempData.lastDate = "";
        this.tempData.signScore = "4";
        this.tempData.homeworkTimeScore = "2";
        this.tempData.homeworkWordsScore = "2";
        this.tempData.reviewScore = "4";
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
      showUpdate($index) {
        let schd = this.list[$index];
        this.tempData.id=schd.id;
        this.tempData.courseId = schd.courseId;
        this.tempData.courseName = schd.courseName;
        this.tempData.scheduleNo = schd.scheduleNo;
        this.tempData.scheduleName = schd.scheduleName;
        this.tempData.scheduleDate = schd.scheduleDate;
        this.tempData.period = schd.period;
        this.tempData.startTime = schd.startTime;
        this.tempData.homeworkWords = schd.homeworkWords;
        this.tempData.lastDate = schd.lastDate;
        this.tempData.signScore=schd.signScore;
        this.tempData.homeworkTimeScore=schd.homeworkTimeScore;
        this.tempData.homeworkWordsScore=schd.homeworkWordsScore;
        this.tempData.reviewScore=schd.reviewScore;
        this.dialogStatus = "update";
        this.dialogFormVisible = true
      },
      createData() {
        //添加新数据
        this.api({
          url: "/CosCourseSchedule/addData",
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
          url: "/CosCourseSchedule/updateData",
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
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let cla = _vue.list[$index];
          _vue.api({
            url: "/CosCourseSchedule/deleteData",
            method: "post",
            data: cla
          }).then(() => {
            _vue.getList();
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },
      showQRCode($index) {
        let schd = this.list[$index];
        this.tempData.id = schd.id;
        let tempid1=this.tempData.id * 3134 + 1;
        let tempid2=this.tempData.id * 13 + 7;
        this.dialogStatus = "qrcode";
        this.QRCodeDialogFormVisible = true;
        let url="http://" + window.location.href.split('/')[2] +"/signin?"+encodeURIComponent("="+tempid1 + "a" + tempid2);
        window.setTimeout(function(){
          let canvas = document.getElementById('canvas');
          QRCode.toCanvas(canvas, url,{
            width:400,
            height:400,
          } , function (error) {
            if (error) console.error(error)
            console.log('success!');
          });
          document.getElementById("img").src = canvas.toDataURL();
        },100);
      },
      exportTable() {
        require.ensure([], () => {
          const {export_json_to_excel} = require('../../excel/Export2Excel'); //这里必须使用绝对路径
          const tHeader = ['id', '课程', '课时编号', '课时名称', '日期', '时段', '签到时间', '心得字数', '最晚提交时间', '签到学分', '按时提交学分', '作业字数学分', '讲师评阅学分', '更新时间', '创建时间']; // 导出的表头名
          const filterVal = ['id', 'courseName', 'scheduleNo', 'scheduleName', 'scheduleDate', 'period', 'startTime', 'homeworkWords', 'lastDate', 'signScore', 'homeworkTimeScore', 'homeworkWordsScore', 'reviewScore', 'updateTime', 'createTime']; // 导出的表头字段名
          const list = this.list;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, `课程表信息`);// 导出的表格名称，根据需要自己命名
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }

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

