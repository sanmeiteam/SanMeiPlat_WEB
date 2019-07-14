<template>
  <div class="app-container">
    <el-form class="small-space" :model="MyInfo" label-position="right" label-width="100px"
             style='margin-left:30px; margin-right:50px; ' >
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名" style="font-weight:bold;">
            <el-input type="text" v-model="MyInfo.username" style="width: 100%;" disabled="disabled">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色" style="font-weight:bold;">
            <el-input type="text" v-model="MyInfo.roleName" style="width: 100%;" disabled="disabled">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div style="position:absolute;margin:0px 10px 0px 50px;width:200px;height:250px;border:solid 0px blue;text-align: center;">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            请上传头像
          </div>
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
          <el-form-item label="性别" style="font-weight:bold;" required>
            <el-select v-model="MyInfo.sex" placeholder="请选择" style="width:100%;">
              <el-option label="女" value="女"></el-option>
              <el-option label="男" value="男"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="年龄" style="font-weight:bold;">
            <el-input type="text" v-model="MyInfo.age" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学历" style="font-weight:bold;">
            <el-input type="text" v-model="MyInfo.education" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="区域" style="font-weight:bold;">
            <el-input type="text" v-model="MyInfo.aera" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="QQ" style="font-weight:bold;">
            <el-input type="text" v-model="MyInfo.qq" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="微信" style="font-weight:bold;">
            <el-input type="text" v-model="MyInfo.wechat" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="介绍人" style="font-weight:bold;">
            <el-input type="text" v-model="MyInfo.introducer" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="height: 20px;"></el-row>
      <el-row>
        <el-col :span="18" style="text-align: center;">
          <el-button type="primary" @click="saveMyInfo">保存信息</el-button>
          <el-button type="info" @click="changePassword">修改密码</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
      <el-form class="small-space" :model="MyInfo" label-position="right" label-width="120px"
               style='width: 350px; margin-left:50px; margin-right:50px;'>
        <el-form-item label="请输入新密码：" required>
          <el-input type="password" v-model="MyInfo.password1" style="width: 100%;">
          </el-input>
        </el-form-item>
        <el-form-item label="请再输入一次：" required>
          <el-input type="password" v-model="MyInfo.password2" style="width: 100%;">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="SavePassword">提交密码</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>

  .avatar-uploader .el-upload {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    z-index: 10;
    width: 178px;
    height: 178px;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'MyInfo',
    data() {
      return {
        imageUrl: '',
        MyInfo: {
          username: '',
          passWord: '',
          password1: '',
          password2: '',
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
        dialogStatus: 'update',
        textMap: {
          update: '修改密码'
        },
        dialogFormVisible: false,
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
        this.api({
          url: "/user/updateMyInfo",
          method: "post",
          data: this.MyInfo
        }).then(response => {
          //弹出消息框
          if (response.result>""){
            this.$message({
              message: response.result,
              type: 'success',
              duration: 1 * 3000,
              onClose: () => {
                //this.getList();
              }
            })
          }

        });
      },
      changePassword()
      {
        this.MyInfo.password1="";
        this.MyInfo.password2="";
        this.dialogStatus= 'update';
        this.dialogFormVisible = true;
      },
      SavePassword()
      {
        if (this.MyInfo.password1>'' && this.MyInfo.password2==this.MyInfo.password1)
        {
          this.MyInfo.passWord=this.MyInfo.password1;
          this.api({
            url: "/user/changePsd",
            method: "post",
            data: this.MyInfo
          }).then(response => {
            this.dialogFormVisible = false;
            //弹出消息框
            if (response.result>""){
              this.$message({
                message: response.result,
                type: 'success',
                duration: 1 * 3000,
                onClose: () => {
                  //this.getList();
                }
              })
            }

          });
        }
        else{
          alert("密码为空或两次密码不一致！");
        }
      },

      //上传头像
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }



    }
  }
</script>
