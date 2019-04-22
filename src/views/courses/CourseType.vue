<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item label="课程种类">
          <el-select :filterable="true" v-model="listQuery.id" :clearable="true" placeholder="请选择课程种类">
            <el-option v-for="item in list" :key="item.id" :label="item.courseType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" v-if="hasPerm('user:add')" @click="selectCosCourseType">查询</el-button>
          <el-button type="primary" icon="plus" v-if="hasPerm('user:add')" @click="showCreate">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="课程种类" prop="courseType" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="是否有效" prop="deleteStatus" width="90"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="200"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="200"></el-table-column>
      <el-table-column align="center" label="管理" width="220" v-if="hasPerm('user:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" v-if="scope.row.userId!=userId "
                     @click="removeUser(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <addCourseType ref="addCourseType"></addCourseType>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  // import AddCourseType from '@components/courses/addCourseTypeModel';

  export default {

    // component: {AddCourseType},

    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          courseType: '',
          id: '',
          pageNum: 1,//页码
          pageRow: 50,//每页条数
        },
        roles: [],//角色列表
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '新建用户'
        },
        tempUser: {
          username: '',
          password: '',
          nickname: '',
          roleId: '',
          userId: ''
        }
      }
    },
    created() {
      if (this.hasPerm('user:add') || this.hasPerm('user:update')) {
        this.getList();
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {
      selectCosCourseType() {
        this.api({
          url: "/CosCourseType/selectCosCourseType",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.list = data.result;
        })
      },
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/CosCourseType/selectCosCourseType",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.result;
          this.totalCount = data.totalCount;
        })
        this.listLoading = false;
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      handleFilter() {
        //查询事件
        this.listQuery.pageNum = 1
        this.getList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },

      showCreate() {
        //括号里面写传入的参数,新增时候可以不填,更新时候填入参数用于回显
        console.log("0000")
        debugger
        this.$refs["addCourseType"].show();
      },
      showUpdate($index) {
        let user = this.list[$index];
        this.tempUser.username = user.username;
        this.tempUser.nickname = user.nickname;
        this.tempUser.roleId = user.roleId;
        this.tempUser.userId = user.userId;
        this.tempUser.deleteStatus = '1';
        this.tempUser.password = '';
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createUser() {
        //添加新用户
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
    }
  }
</script>
