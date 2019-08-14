<template>
  <div class="app-container">
    <div style="text-align: center;font-size:24px;margin-top: 10px;">三昧古中医平台操作指导</div>
    <div style="padding:10px 40px 10px 40px;line-height: 2em; font-size:18px;">
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;欢迎您使用三昧古中医平台，平台将为您提供课程服务、心得共享，帮助您在课堂之外也继续提升。
      </p>

      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-edit-outline"></i>&nbsp;&nbsp;&nbsp;&nbsp;
        为了便于平台管理及信息共享，请您
        <router-link style="color:blue;text-decoration: underline;" to="/personal/MyInfo">完善个人信息</router-link>
        。
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-check"></i>&nbsp;&nbsp;&nbsp;&nbsp;
        课前——在线签到。
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;扫描每次课的签到二维码，进入签到页面，填写“姓名”，“手机号”点击签到。如图：
        <br />
        <img src="../../assets/images/signin.jpg" style="width: 300px;" />
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-check"></i>&nbsp;&nbsp;&nbsp;&nbsp;
        课后：完成作业。
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;进入三昧古中医平台，进入“我的作业”选择您正在参与的课程，点击“写心得”完成作业。如图：
        <br /><br />
        <img src="../../assets/images/hw.png" style="width: 100%;" />
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;写作业时，可以在线编辑，也可以在word中编辑完复制到平台中，编写完作业提交即可。如图：
        <br />
        <img src="../../assets/images/hw2.png" style="width: 100%;" />
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;祝大家学习愉快，如在使用过程中有任何问题，可通过灵龟八法微信群/QQ群，截图说明问题，发送给助教老师，由助教老师汇总后联系系统管理员。
      </p>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {

      }
    },
    created() {

    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {

    }
  }
</script>
