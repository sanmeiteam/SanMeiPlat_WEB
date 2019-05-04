<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <!--<el-form-item label="课程种类">-->
          <!--<el-select :filterable="true" v-model="listQuery.id" :clearable="true" placeholder="请选择课程种类">-->
            <!--<el-option v-for="item in list" :key="item.id" :label="item.courseType" :value="item.id"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <!--<el-button type="primary" icon="plus" v-if="hasPerm('user:add')" @click="selectCosCourseType">查询</el-button>-->
          <el-button type="primary" icon="plus" v-if="hasPerm('cosType:add')" @click="showCreate">添加</el-button>
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
      <!--<el-table-column align="center" label="是否有效" prop="deleteStatus" width="90"></el-table-column>-->
      <el-table-column align="center" label="创建时间" prop="createTime" width="200"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="200"></el-table-column>
      <el-table-column align="center" label="管理" width="220" v-if="hasPerm('cosType:update')">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempData" label-position="right" label-width="120px"
               style='width: 650px; margin-left:50px; margin-right:50px;'>
        <el-row>
          <el-col :span="24">
            <el-form-item label="课程类型" required>
              <el-input type="text" v-model="tempData.courseType" placeholder="填写课程类型">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createData">添 加</el-button>
        <el-button type="primary" v-else @click="updateData">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
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
          create: '新建课程类型'
        },
        tempData: {
          id:'',
          courseType: ''
        }
      }
    },
    created() {
      if (this.hasPerm('cosType:add') || this.hasPerm('cosType:update')) {
        this.getList();
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/CosCourseType/list",
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
        //显示新增对话框
        this.tempData.id = "";
        this.tempData.courseType = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },

      showUpdate($index) {
        let course = this.list[$index];
        this.tempData.id=course.id;
        this.tempData.courseType = course.courseType;
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createData() {
        //添加新用户
        this.api({
          url: "/CosCourseType/addData",
          method: "post",
          data: this.tempData
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateData() {
        //修改用户信息
        let _vue = this;
        this.api({
          url: "/CosCourseType/updateData",
          method: "post",
          data: this.tempData
        }).then(() => {
          let msg = "修改成功";
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
      },
      removeUser($index) {
        let _vue = this;
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let course = _vue.list[$index];
          _vue.api({
            url: "/CosCourseType/deleteData",
            method: "post",
            data: course
          }).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      }


    }
  }
</script>
