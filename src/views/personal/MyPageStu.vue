<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card class="box-card">
            <el-steps :space="200" :active="2" finish-status="success">
              <el-step title="已完成"></el-step>
              <el-step title="已完成"></el-step>
              <el-step title="学习中"></el-step>
              <el-step title="8月06日"></el-step>
              <el-step title="8月09日"></el-step>
              <el-step title="8月11日"></el-step>
              <el-step title="8月15日"></el-step>
              <el-step title="8月18日"></el-step>
            </el-steps>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" style="height:100px;">
          <div style="font-size:15px;margin-bottom:5px;color:#44BB44;font-weight:bold;">
            当前积分：
          </div>
          <div style="text-align:center;width:100%;font-weight: bold;color:red;font-size:26px;">980分</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-tabs type="border-card">
          <el-tab-pane label="班级心得">
            <el-table
              :data="tableData"
              style="width: 100%"
              >
              <el-table-column
                prop="address"
                label="标题">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="100">
              </el-table-column>
              <el-table-column
                prop="date"
                label="日期"
                width="120">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="课程心得">课程心得</el-tab-pane>
          <el-tab-pane label="全部心得">全部心得</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="12">
        <el-tabs type="border-card">
          <el-tab-pane label="活动通知">班内心得</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

  </div>
</template>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }

</style>
<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        activeNames: ['1'],
        userList:[], //人员信息
        listQuery: {
          curUserId:'', //登录用户id
          roleName:'',//登录用户的角色名称
        },

        role: '',//角色 班内角色
        curClassHW:[], //当前课程作业
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
      }
    },
    created() {
      this.listQuery.curUserId=this.userId;
      this.getUsers();
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {
      //获取当前登录用户信息
      getUsers() {
        this.api({
          url: "/PersonalMyPage/curUser",
          method: "get",
          params: this.userId
        }).then(data => {
          this.userList = data.result;
          this.listQuery.roleName=this.userList[0].roleName;

        });

        //获取课程心得
        //getHW

      },




    }
  }
</script>
