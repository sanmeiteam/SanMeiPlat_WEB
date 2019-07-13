<template>
  <el-menu class="banner-container" mode="horizontal">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
      <tr>
        <td><div class="banner_title">三昧古中医平台</div></td>
        <td></td>
        <td width="200"><div class="userInfoCls" id="loginUserInfo"></div></td>
        <td width="80">
          <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <router-link class="inlineBlock" to="/">
              <el-dropdown-item @click="gotoIndex">
                首页
              </el-dropdown-item>
            </router-link>
            <router-link class="inlineBlock" to="/personal/MyInfo">
              <el-dropdown-item>
                修改密码
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </td>
      </tr>
    </table>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb
  },
  mounted() {
    document.getElementById("loginUserInfo").innerHTML="尊敬的 <span style='color:#00ccee;'>"+this.nickname+"</span> ，您好！";
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'nickname'
    ])
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    gotoIndex() {
      ////跳到首页
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
      margin-top: 5px;
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

