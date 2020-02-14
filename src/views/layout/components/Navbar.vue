<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb style="border:solid 0px green;"></breadcrumb>
    <div style="border: solid 0px red; height: 50px;font-size:15px;width:285px;float:right;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td width="0"><div class="userInfoCls" id="loginUserInfo"></div></td>
          <td width="100" style="text-align: left;border-right:solid 1px #dddddd;">
            您好 ：<span id="curUserName"></span>
          </td>
          <td width="50" style="text-align: center;border-right:solid 1px #dddddd;">
            <router-link class="inlineBlock" to="/">
              首页
            </router-link>
          </td>
          <td width="80" style="text-align: center;border-right:solid 1px #dddddd;">
            <router-link class="inlineBlock" to="/personal/MyInfo">
                修改密码
            </router-link>
          </td>
          <td width="50" style="text-align: center;">
            <span @click="logout" style="display:block; cursor: pointer;">退出</span>
          </td>
        </tr>
      </table>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
    return{
      userList:[], //人员信息
      listQuery: {
        curUserId:'', //登录用户id
        curUserName:'',//登录用户姓名
      },
    }
  },
  created() {
    this.getUsers();

  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'userId',
      'nickname'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    gotoIndex() {
      ////跳到首页
    },

    getUsers() {

      this.api({
        url: "/PersonalMyPage/curUser",
        method: "get",
        params: this.userId
      }).then(data => {
        this.userList = data.result;
        document.getElementById("curUserName").innerHTML=this.userList[0].userName;
      });
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: fixed;
  width: 100%;
  padding-right:180px;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background-color: #fcfcfc;
  z-index: 1002;
  border:solid 0px blue;
  }
.hamburger-container {
  line-height: 58px;
  height: 50px;
  border:solid 0px red;
  float: left;
  padding: 0 10px;
}

.banner-container {
  height:60px;
  width:100%;
  position: fixed;
  top: 0;
  left:0;
  z-index:1002;
  background-color:#24292e;
  border:solid 1px #24292e;

  //平台名字样式
  .banner_title {
    font-size:30px;
    color:white;
    font-family: "黑体" ;
    margin-left:20px;
    display: block;
  }

  //登录信息 样式
  .userInfoCls {
    font-size:15px;
    color:#d3d3d3;
    font-family: "黑体" ;
  }

  //登录头像 下拉
  .avatar-container {
    height: 50px;
    display: inline-block;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 0px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

