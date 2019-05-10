<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="checkinForm" ref="checkinForm" label-position="left"
             label-width="0px"
             class="card-box login-form">
      <h3 class="title">课程签到</h3>
      <div class="welcome" style="font-weight: bold;">
        欢迎来到
        <span id="courseName"></span>
        <span id="scheduleName"></span><br>
        请于&nbsp;<span id="scheduleDate"></span>&nbsp;<span id="startTime"></span>&nbsp;之前签到
      </div>
      <el-form-item>
        <el-input v-model="checkinForm.nickName" placeholder="请填写姓名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="checkinForm.phone" placeholder="请填写手机号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" @click="userCheckin">
          签到
        </el-button>
      </el-form-item>
      <div id="signSwitch" class="welcome" style="display: none;">
        <div class="info">
          尊敬的<span id="nickName" style="color:blue;"></span>老师，
          您已于<span id="signTime" style="color:blue;"></span>签到成功！
          签到状态为：<span id="signState" style="color:blue;"></span>
          <span id="isSign" style="display: none;"></span>
          <span id="phone" style="display:none;"></span>
        </div>

      </div>
      <div class="welcome">
        已签到人数:&nbsp;<span id="signedNum"></span>人/共<span id="totalNum"></span>人
      </div>
      <div class="info">
        已签到人员：<span id="signedMember"></span>
      </div>
      <div class="info">
        未签到人员：<span id="unSignedMember"></span>
      </div>
      <div class="info" style="display: none;">
        签到设备标识：<span id="signDev"></span>
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
        isUAExist:0,//是否该设备已经签到过
        checkinForm: {
          tempScheduleId:'',
          courseName:'',
          scheduleName:'',
          scheduleDate:'',
          startTime:'',
          ////个人信息
          signUser:'',
          nickName: '',
          phone: '',
          isSign: '',
          signTime: '',
          signState: '',
          signDev: ''
        }
      }
    },
    mounted() {
      this.getInfo(); //获取当前课时信息
    },
    methods: {
      getInfo() {
        //获取当前课时信息
        document.getElementById("signSwitch").style.display = "none";
        this.checkinForm.tempScheduleId="2";
        let totalCount=0;
        let tempParams={};
        let _this=this;
        let signedNum=0;
        let signedMember="";
        let unSignedMember="";
        tempParams=this.checkinForm;
        //alert(getUA);
        //document.getElementById("signDev").innerHTML = getUA;
        axios.get("api/sign/list",{
          params:tempParams
        })
          .then( (response) => {
            _this.list = response.data.result;
            totalCount = _this.list.length;
            if (totalCount<=0) {
              alert("页面加载失败，请联系管理员！");
              return ;
            }
            else{
              _this.checkinForm.courseName=_this.list[0].courseName;
              _this.checkinForm.scheduleName=_this.list[0].scheduleName;
              _this.checkinForm.scheduleDate=_this.list[0].scheduleDate;
              _this.checkinForm.startTime=_this.list[0].startTime;
              document.getElementById("courseName").innerHTML=_this.checkinForm.courseName;
              document.getElementById("scheduleName").innerHTML=_this.checkinForm.scheduleName;
              document.getElementById("scheduleDate").innerHTML=_this.checkinForm.scheduleDate;
              document.getElementById("startTime").innerHTML=_this.checkinForm.startTime;
            }
            _this.list.forEach(item=>{
              if (item.isSign === '是') {
                signedNum ++; //统计已签到人数
                signedMember += item.nickName+"&nbsp;";
                if (getUA > "" && getUA == item.signDev){
                  _this.isUAExist=1; //判断该设备信息的设备是否已经签到过
                  document.getElementById("signSwitch").style.display="block";
                  document.getElementById("nickName").innerHTML=item.nickName;
                  document.getElementById("phone").innerHTML=item.phone;
                  document.getElementById("isSign").innerHTML=item.isSign;
                  document.getElementById("signTime").innerHTML=item.signTime;
                  document.getElementById("signState").innerHTML=item.signState;
                  if (item.signState=="正常")
                  {
                    document.getElementById("signState").style.color="blue";
                  }
                  else
                  {
                    document.getElementById("signState").style.color="red";
                  }
                }
              }
              else{
                unSignedMember += item.nickName+"&nbsp;";
              }
              document.getElementById("totalNum").innerHTML=totalCount;
              document.getElementById("signedNum").innerHTML=signedNum;
              document.getElementById("signedMember").innerHTML=signedMember;
              document.getElementById("unSignedMember").innerHTML=unSignedMember;
            })
          })
          .catch((error) => {
          console.log(error);
          alert("获取数据异常，请联系管理员！");
          });
      },
      userCheckin() {
        let _vue=this;

        let date=new Date();
        let ddate=new Date(Date.parse(_vue.checkinForm.scheduleDate + " " +_vue.checkinForm.startTime));
        if (date.Format("yyyy-MM-dd") == ddate.Format("yyyy-MM-dd") && date.Format("hh:mm:ss")>=ddate.Format("hh:mm:ss"))
        {
          //alert(_vue.getLocalTime(ddate.setHours(ddate.getHours()+4)));

          alert("当前时间不在签到时间内！");
          return;
        }
        let isExist=0;//人员是否存在  0是不存在  1是存在
        if (this.isUAExist==1) {////通过设备判断
          alert("该设备已经签到过，不能重复签到！");
          return;
        }
        ///判断有效时间内签到

        _vue.list.forEach(item => {
          if (item.nickName == _vue.checkinForm.nickName && item.phone == _vue.checkinForm.phone) {////该人员存在
            isExist = 1;
            if (item.isSign=="是"){///已经签到
              alert("该人员已经签到，无需重复签到！");
            }
            else{
              _vue.checkinForm.signUser=item.signUser;
              _vue.checkinForm.scheduleDate=item.scheduleDate;
              _vue.checkinForm.startTime=item.startTime;
              _vue.checkinForm.isSign="是";
              _vue.checkinForm.signState="正常";
              _vue.checkinForm.signDev=getUA;
              axios.post("api/sign/sign",this.checkinForm).then((response) => {
                alert("签到成功，祝您学习愉快！");
                this.getInfo();
                document.getElementById("signSwitch").style.display="block";
              }).catch( (error) => {
                console.log(error);
                alert("签到异常，请联系管理员！");
              })
            }
          }
        });
        if (isExist==0){
          alert("该人员不存在，或填写信息有误！");
        }
      },
      getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
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
<style rel="stylesheet/scss" lang="scss">
  @import "../../styles/mixin.scss";
  .login-container {
    @include relative;
    height: 100vh;
    background-color: #fff;
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
      color: #000;
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
      color: #000;
    }
    .welcome {
      font-size: 3rem;
      color: #000;
      margin-top: 5rem;
      margin-bottom: 3rem;
    }
    .info{
      font-size: 3rem;
      color: #000;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
    .title {
      font-size: 5rem;
      color: #000;
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
      margin-top:3rem;
      color: #454545;
    }
  }
</style>
