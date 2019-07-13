<template>
  <div class="app-container">
    <el-form class="small-space" :model="MyInfo" label-position="right" label-width="100px"
             style='margin-left:30px; margin-right:50px; ' >
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.username" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.sex" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="padding-left: 50px;">
          <el-button type="primary" @click="changePassword">修改密码</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="年龄" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.age" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.roleName" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="学历" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.education" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="区域" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.aera" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="手机" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.phone" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="QQ" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.qq" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="微信" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.wechat" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="介绍人" style="font-weight:bold;" required>
            <el-input type="text" v-model="MyInfo.introducer" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="height: 20px;"></el-row>
      <el-row>
        <el-col :span="18" style="text-align: center;">
          <el-button type="primary" @click="saveMyInfo">提 交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'MyInfo',
    data() {
      return {
        MyInfo: {
          username: '',
          password: '',
          nickname: '',
          sex: '',
          age: '',
          phone: '',
          qq: '',
          wechat: '',
          aera: '',
          education: '',
          introducer: '',
          roleName: '',
          id: ''
        },
        loading: false
      }
    },
    created() {
      this.MyInfo.id=this.userId;
      this.getMyInfo();
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {
      getMyInfo() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/user/myInfo",
          method: "get",
          params: this.MyInfo
        }).then(data => {
          this.listLoading = false;
          debugger
          this.list = data.result;
          this.MyInfo.username=this.list[0].userName;
          this.MyInfo.sex=this.list[0].sex;
          this.MyInfo.age=this.list[0].age;
          this.MyInfo.roleName=this.list[0].roleName;
          this.MyInfo.education=this.list[0].education;
          this.MyInfo.aera=this.list[0].aera;
          this.MyInfo.qq=this.list[0].qq;
          this.MyInfo.wechat=this.list[0].wechat;
          this.MyInfo.phone=this.list[0].phone;
          this.MyInfo.introducer=this.list[0].introducer;
        })
      },
      saveMyInfo()
      {

      },
      changePassword()
      {

      }
    }
  }
</script>
