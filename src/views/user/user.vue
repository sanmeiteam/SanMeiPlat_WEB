<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <div class="filter-container">
          <div class="left-items" style="float: left;">
            <el-input style="width: 250px" v-model="listQuery.keywords" placeholder="输入关键字"
                      @keyup.enter.native="getList"></el-input>
            <el-select v-model="listQuery.roleId" placeholder="按角色查询" style="width:150px;" @change="getList">
              <el-option label="所有角色" value=""></el-option>
              <el-option
                v-for="item in roles"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" icon="plus" v-if="hasPerm('user:list')"
                       @click="getList">查询
            </el-button>
            <el-button type="primary" icon="plus" v-if="hasPerm('user:add')" @click="showCreate">新增</el-button>
            <el-button type="primary" @click="exportTable" v-if="hasPerm('user:list')">导出</el-button>
          </div>
          <div style="float:left; margin-left: 20px;">
            <el-upload
              class="upload-demo"
              action="/user/importUserExcel"
              :multiple="false"
              :on-success="onSuccess"
              limit="100"
              :show-file-list="false">
              <el-button v-if="hasPerm('user:importExcel')" size="small" style="font-size:14px;" type="primary">点击上传</el-button>
            </el-upload>
          </div>
          <!--<div style="float:left; margin-left: 20px;">-->
            <!--<a :href='"template.xls"' style="color:blue;text-decoration: underline;">模板下载</a>-->
          <!--</div>-->
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
      <!--<el-table-column align="center" label="姓名" prop="nickname"></el-table-column>-->
      <el-table-column align="center" label="用户名" prop="username"></el-table-column>
      <el-table-column align="center" label="角色" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-text="scope.row.roleName" v-if="scope.row.roleId===1"></el-tag>
          <el-tag type="primary" v-text="scope.row.roleName" v-else></el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" prop="sex" width="60"></el-table-column>
      <el-table-column align="center" label="年龄" prop="age" width="60"></el-table-column>
      <el-table-column align="center" label="区域" prop="aera" width="80"></el-table-column>
      <el-table-column align="center" label="学历" prop="education" width="80"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="160"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="160"></el-table-column>
      <el-table-column align="center" label="管理" width="180" v-if="hasPerm('user:update')" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" v-if="scope.row.userId!=userId "
                     @click="removeUser(scope.$index)">删除
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
      <el-form class="small-space" :model="tempUser" label-position="right" label-width="120px"
               style='width: 650px; margin-left:50px; margin-right:50px;'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" required v-if="dialogStatus=='create'">
            <el-input type="text" v-model="tempUser.username">
            </el-input>
          </el-form-item>
            <el-form-item label="用户名" required v-else>
              <el-input type="text" v-model="tempUser.username" disabled="disabled">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--@todo:  1.角色显示的问题 2.低权限不应该修改高权限人员-->
            <el-form-item label="角色" v-if="MyInfo.roleName=='管理员'" required>
              <el-select v-model="tempUser.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roles"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色" v-else required>
              <el-select v-model="tempUser.roleId" placeholder="请选择">
                <el-option key="5" label="学员" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" hidden="hidden">
            <el-form-item label="密码" v-if="dialogStatus=='create'" required>
              <el-input type="password" v-model="tempUser.password">
              </el-input>
            </el-form-item>
            <el-form-item label="新密码" v-else>
              <el-input type="password" v-model="tempUser.password" placeholder="不填则表示不修改">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row hidden="hidden">
          <el-col :span="12">
            <el-form-item label="姓名" required>
              <el-input type="text" v-model="tempUser.nickname">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" required>
              <el-select v-model="tempUser.sex" placeholder="请选择">
                <el-option label="女" value="女"></el-option>
                <el-option label="男" value="男"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" required>
              <el-input type="text" v-model="tempUser.age">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话" required>
              <el-input type="text" v-model="tempUser.phone">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历">
              <el-input type="text" v-model="tempUser.education">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="QQ">
              <el-input type="text" v-model="tempUser.qq">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信">
              <el-input type="text" v-model="tempUser.wechat">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域">
              <el-input type="text" v-model="tempUser.aera">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="介绍人">
              <el-input type="text" v-model="tempUser.introducer">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createUser">创 建</el-button>
        <el-button type="primary" v-else @click="updateUser">修 改</el-button>
      </div>
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
          roleId: '',//角色id
        },
        roles: [],//角色列表
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '新建用户'
        },
        input: {
          keywords: ''
        },
        tempUser: {  //待写入信息  临时信息
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
          roleId: '',
          userId: ''
        },
        MyInfo: {  //登录人信息
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
        }
      }
    },
    created() {
      this.MyInfo.id=this.userId;
      this.getMyInfo();
      this.getList();
      if (this.hasPerm('user:add') || this.hasPerm('user:update')) {
        this.getAllRoles();
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {


  ///获取登录人信息
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
      getAllRoles() {
        this.api({
          url: "/user/getAllRoles",
          method: "get"
        }).then(data => {
          this.roles = data.list;
        })
      },
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/user/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      onSuccess(response) {
        this.$message({
          //message: "上传成功",
          message: response.result,
          type: 'success',
          duration: 3 * 1000,
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
      showCreate() {
        //显示新增对话框
        this.tempUser.username = "";
        this.tempUser.password = "lingguibafa";
        this.tempUser.nickname = "";
        this.tempUser.sex = "";
        this.tempUser.age = "";
        this.tempUser.phone = "";
        this.tempUser.qq = "";
        this.tempUser.wechat = "";
        this.tempUser.aera = "";
        this.tempUser.education = "";
        this.tempUser.introducer = "";
        this.tempUser.roleId = "5";
        this.tempUser.userId = "";
        this.dialogStatus = "create";
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let user = this.list[$index];
        this.tempUser.username = user.username;
        this.tempUser.nickname = user.nickname;
        this.tempUser.sex = user.sex;
        this.tempUser.age = user.age;
        this.tempUser.phone = user.phone;
        this.tempUser.qq = user.qq;
        this.tempUser.wechat = user.wechat;
        this.tempUser.aera = user.aera;
        this.tempUser.education = user.education;
        this.tempUser.introducer = user.introducer;
        this.tempUser.roleId = user.roleId;
        this.tempUser.userId = user.userId;
        this.tempUser.deleteStatus = '1';
        //this.tempUser.password = '';
        this.dialogStatus = "update";
        this.dialogFormVisible = true
      },
      createUser() {
        //添加新用户
        this.tempUser.nickname=this.tempUser.username;
        this.api({
          url: "/user/addUser",
          method: "post",
          data: this.tempUser
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateUser() {
        //修改用户信息
        let _vue = this;
        this.api({
          url: "/user/updateUser",
          method: "post",
          data: this.tempUser
        }).then(() => {
          let msg = "修改成功";
          this.dialogFormVisible = false
          if (this.userId === this.tempUser.userId) {
            msg = '修改成功,部分信息重新登录后生效'
          }
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
      removeUser($index) {
        let _vue = this;
        this.$confirm('确定删除此用户?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let user = _vue.list[$index];
          user.deleteStatus = '2';
          _vue.api({
            url: "/user/updateUser",
            method: "post",
            data: user
          }).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },
      exportTable() {
        require.ensure([], () => {
          const {export_json_to_excel} = require('../../excel/Export2Excel'); //这里必须使用绝对路径
          const tHeader = ['id', '姓名', '用户名', '角色id', '性别', '年龄', '电话', 'QQ', '微信', '区域', '学历', '介绍人', '更新时间', '创建时间']; // 导出的表头名
          const filterVal = ['userId', 'nickname', 'username', 'roleId', 'sex', 'age', 'phone', 'qq', 'wechat', 'aera', 'education', 'introducer', 'updateTime', 'createTime']; // 导出的表头字段名
          const list = this.list;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, `人员信息表`);// 导出的表格名称，根据需要自己命名
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      importfxx(obj) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function (f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = function (e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require('xlsx');
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                type: 'base64'
              });
            } else {
              wb = XLSX.read(binary, {
                type: 'binary'
              });
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
            let arr = []
            outdata.map(v => {
              let obj = {}
              obj.username = v.姓名
              obj.nickname = v.用户名
              obj.roleId = v.角色id
              obj.sex = v.性别
              obj.age = v.年龄
              obj.phone = v.电话
              obj.education = v.学历
              obj.qq = v.QQ
              obj.wechat = v.微信
              obj.aera = v.区域
              obj.introducer = v.介绍人
              arr.push(obj)
            })
            console.log(arr)
            let para = {
              //withList: JSON.stringify(this.da)
              withList: arr
            }
            _this.$message({
              message: '请耐心等待导入成功',
              type: 'success'
            });
            withImport(para).then(res => {

              //window.location.reload()
              this.getList();
            })

          }
          reader.readAsArrayBuffer(f);
        }
        if (rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      },
    }
  }
</script>

