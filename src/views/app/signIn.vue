<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="checkinForm" :rules="checkinRules" ref="checkinForm" label-position="left"
             label-width="0px"
             class="card-box login-form">
      <h3 class="title">课程签到</h3>
      <div class="welcome">
        欢迎来到
        <span id="courseName"></span>
        <span id="scheduleName"></span>
      </div>
      <el-divider content-position="left">课程信息</el-divider>

      <div class="welcome">
        <table cellspacing="0" cellpadding="0" width="80%">
          <tr>
            <td>班级总人数：</td>
            <td id="totalNum"></td>
          </tr>
          <tr>
            <td>已签到人数:</td>
            <td id="signedNum"></td>
          </tr>
          <tr>
            <td>已签到人员：</td>
            <td id="signedMember"></td>
          </tr>
          <tr>
            <td>未签到人数:</td>
            <td id="unSignedNum"></td>
          </tr>
          <tr>
            <td>未签到人员：</td>
            <td id="unSignedMember"></td>
          </tr>
        </table>
      </div>

      <el-divider content-position="left">请签到</el-divider>
      <el-form-item required>
        <el-input v-model="checkinForm.username" placeholder="请填写姓名" />
      </el-form-item>
      <el-form-item required>
        <el-input v-model="checkinForm.phone" placeholder="请填写手机号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="userCheckin">
          签到
        </el-button>
      </el-form-item>

      <el-divider content-position="left">签到信息</el-divider>
      <div class="welcome">
        <table cellspacing="0" cellpadding="0" width="80%">
          <tr>
            <td>是否签到:</td>
            <td id="isSign"></td>
          </tr>
          <tr>
            <td>签到人:</td>
            <td id="nickName"></td>
          </tr>
          <tr>
            <td>电话:</td>
            <td id="phone"></td>
          </tr>
          <tr>
            <td>签到时间:</td>
            <td id="signTime"></td>
          </tr>
          <tr>
            <td>签到状态:</td>
            <td id="signState"></td>
          </tr>
          <tr>
            <td>签到设备标识:</td>
            <td id="signDev"></td>
          </tr>
        </table>
      </div>
    </el-form>
  </div>
</template>


<script>
  import axios from 'axios'
  import { getUA } from 'mobile-device-detect';
  export default {
    getUrlKey: function (name) {
      return decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },
    name: 'signIn',
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        checkinForm: {
          tempScheduleId:'',
          courseName:'',
          scheduleName:'',

          nickName: '',
          phone: '',
          isSign: '',
          signTime: '',
          signState: '',
          signDev: ''
        },
        loading: false
      }
    },
    created() {
      this.getInfo(); //获取当前课时信息
      //this.getSignedNum();//获取已签到人数
      //alert(getUA);
    },
    methods: {
      getSignedNum() {
        /////
      },
      getInfo() {
        // if (!isMobile)
        // {
        //   alert("此功能仅支持移动端！");
        //   return;
        // }
        //获取当前课时信息
        this.checkinForm.tempScheduleId="2";
        this.listLoading = true;
        let totalCount=0;
        let _vue=this;
        let signedNum=0;
        let unSignedNum=0;
        let curUA=getUA;
        let isUAExist=0;
        axios.get("api/sign/list",{
          params:this.checkinForm
        }).then(function (response) {
          console.log(response);
          _vue.list=response.data.result;
          totalCount = response.data.result.length;
          _vue.list.forEach(item=>{
            if (item.isSign === '是') {
              signedNum ++; //统计已签到人数
              if (curUA!="" &&curUA!=item.signDev){
                isUAExist=1; //判断该设备信息的设备是否已经签到过
              }
            }
          })


          //计算未签到人数
          unSignedNum=totalCount - signedNum;

          //alert("已签到人数："+signedNum+";未签到人数："+unSignedNum);

          if (totalCount>0){
            document.getElementById("courseName").innerHTML=response.data.result[0].courseName;
            document.getElementById("scheduleName").innerHTML=response.data.result[0].scheduleName;
            document.getElementById("nickName").innerHTML=response.data.result[0].nickName;
            document.getElementById("phone").innerHTML=response.data.result[0].phone;
            document.getElementById("isSign").innerHTML=response.data.result[0].isSign;
            document.getElementById("signTime").innerHTML=response.data.result[0].signTime;
            document.getElementById("signState").innerHTML=response.data.result[0].signState;
            document.getElementById("signDev").innerHTML=response.data.result[0].signDev;
          }
          else {
            document.getElementById("courseName").innerHTML="课程信息无效,请联系承办方";
          }
        })
          .catch(function (error) {
            console.log(error);
          });

      },
      userCheckin() {
        this.loading = true
        let _vue=this;
        let username = _vue.checkinForm.username;
        let phone = _vue.checkinForm.phone;
        let isSigned=0;
        let curUA=getUA;
        let isUAExist=0;
        _vue.list.forEach(item => {
          if (item.username === username && item.phone === phone) {
            ////该人员已经签到
            isSigned=1;
          }
          if (curUA!="" &&curUA!=item.signDev){
            isUAExist=1; //判断该设备信息的设备是否已经签到过
          }
        });
        axios.post("api/sign/sign",{
          params:this.checkinForm
        }).then(function (response) {
            console.log(response);
            let msg = "签到成功";
            this.loading=false;
            this.$message({
              message: msg,
              type: 'success',
              duration: 1 * 1000,
              onClose: () => {

              }
            })
          })
          .catch(function (error) {
            console.log(error);
            let msg = "签到失败，请检查签到信息";
            this.dialogFormVisible = false;
            this.$message({
              message: msg,
              type: 'error',
              duration: 1 * 1000,
              onClose: () => {
              }
            });
          });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../styles/mixin.scss";
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    @include relative;
    height: 100vh;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 1rem 3rem 3rem 3rem;
      color: $light_gray;
      height: 10rem;
    }
    .el-input {
      display: inline-block;
      height: 8rem;
      font-size:4rem;
      width: 85%;
    }
    .el-button {
      height: 8rem;
      font-size:4rem;
      width: 85%;
    }
    el-divider {
      font-size:4rem;
      color: $light_gray;
    }
    .welcome {
      font-size: 3rem;
      color: #fff;
      margin-top: 10rem;
      margin-bottom: 3rem;
    }
    .title {
      font-size: 5rem;
      color: $light_gray;
      margin: 2rem auto 2rem auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      width: 100%;
      height:100%;
      padding: 3rem 3rem 3rem 3rem;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      margin-top:5rem;
      color: #454545;
    }
  }
</style>
