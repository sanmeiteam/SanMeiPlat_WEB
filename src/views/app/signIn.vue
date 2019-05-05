<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="checkinForm" :rules="checkinRules" ref="checkinForm" label-position="left"
             label-width="0px"
             class="card-box login-form">
      <h3 class="title">课程签到</h3>
      <div class="welcome">
        欢迎来到
        <span id="courseName">灵龟八法初级班39期</span>
        <span id="scheduleName">第3课</span>
      </div>
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
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'login',
    data() {
      return {
        checkinForm: {
          username: '',
          phone: ''
        },
        checkinRules: {
          username: [{required: true, trigger: 'blur', message: "请输入姓名"}],
          phone: [{required: true, trigger: 'blur', message: "请输入手机号"}]
        },
        loading: false
      }
    },
    methods: {
      userCheckin() {


        this.$refs.checkinForm.validate(valid => {
          if (valid) {
            this.loading = true

            let _vue = this;
            this.api({
              url: "/CosCourseSchedule/updateData",
              method: "post",
              data: this.checkinForm
            }).then(() => {
              let msg = "签到成功";
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


          } else {
            return false
          }
        })
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
