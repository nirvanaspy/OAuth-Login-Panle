<template>
  <div class="userManage-container">
    <el-header>
      <div class="right-menu">
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <!--<pan-thumb class="proImg" width="40px" height="40px" image="./2/jpg">
            </pan-thumb>-->
            <!--<img class="user-avatar" src="./2.jpg">-->
            <span class="user-avatar">
              <svg-icon icon-class="LOGO"></svg-icon>
            </span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="display:block;">
              <span>{{userName}}</span>
            </el-dropdown-item>
            <router-link to="/projectManage">
              <el-dropdown-item divided>
                <span style="display:block;">项目管理</span>
              </el-dropdown-item>
            </router-link>
            <!--<el-dropdown-item>
              <span v-if="role === 'admin'" style="display:block;">用户管理</span>
              <span v-else @click="modifyPasswordVisible = true" style="display:block;">修改密码</span>
            </el-dropdown-item>-->
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <div class="login-form">
      <div class="title-container">
        <h3 class="title" style="margin-bottom:10px">
          用户管理
        </h3>
        <div>
          <div class="searchContainer" style="display: inline-block;margin-bottom:10px;">
            <el-input style="width: 200px;" class="filter-item" placeholder="用户名" v-model="searchQuery">
            </el-input>
          </div>
          <el-button size="mini"
                     plain
                     @click="handleCreate"
                     style="float:right;margin-top:2px;">添加
          </el-button>
        </div>
      </div>
      <el-table :key='tableKey'
                :data="listA"
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                fit
                highlight-current-row
                height="80%"
                style="width: 100%;border-radius:4px;border:1px solid #f9f9f9;">
        <el-table-column min-width="150px" :label="$t('table.username')">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">{{$t('table.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--修改用户-->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="modifyRules" ref="modifyDataForm" :model="form" label-width="80px" style="width: 80%;margin: 0 auto">
        <el-form-item label="新密码" prop="passwordNew">
          <el-input v-model="form.passwordNew" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="passwordAgain">
          <el-input v-model="form.passwordAgain" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateUser">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--创建用户-->
    <el-dialog title="添加用户" :visible.sync="createUserFormVisible" width="40%">
      <el-form :rules="rules" ref="createDataForm" :model="createForm" label-width="80px" style="width: 80%;margin: 0 auto">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="createForm.username" type="password"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="passwordAgain">
          <el-input v-model="createForm.passwordAgain" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createUserFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="createUser">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PanThumb from '@/components/PanThumb'
  import { isvalidUsername } from '@/utils/validate'
  import { UserList, updateUser, deleteUser, addUser } from '@/api/getUsers'
  import store from '../../store'

  /* import LangSelect from '@/components/LangSelect'*/
  /* import SocialSign from './socialsignin'*/

  /*eslint-disable*/
  export default {
    components: { PanThumb },
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入用户名！'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入正确的密码,至少六位！'))
        } else {
          callback()
        }
      }

      const validatePasswordAgain = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入正确的密码,至少六位！'))
        } else if(this.createForm.passwordAgain !== this.createForm.password) {
          callback(new Error('两次密码输入不一致，请再次输入新密码！'))
        } else {
          callback()
        }
      }
      return {
        userName: '',
        selectedId: '',
        tableKey: 0,
        list: [],
        dialogFormVisible: false,
        createUserFormVisible: false,
        modifyPasswordVisible: false,
        formLabelWidth: '100px',
        searchQuery: '',
        temp: {
          id: '',
          name: '',
          description: ''
        },
        form: {
          passwordAgain: '',
          passwordNew: ''
        },
        createForm: {
          username: '',
          password: '',
          passwordAgain: ''
        },
        rules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
        },
        modifyRules: {
          passwordNew: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
        },
        loading: false,
        listLoading: true,
        showDialog: false,
        userData:{
          username: '',
          password: ''
        },
        token: '',
        role: ''
      }
    },
    created() {
      this.userName = this.getCookie('username')
      this.role = store.getters.roles
      this.getList()
    },
    methods: {
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      resetCreate() {
        this.createForm = {
          username: '',
          password: '',
          passwordAgain: ''
        }
      },
      resetModify () {
        this.form = {
          passwordAgain: '',
          passwordNew: ''
        }
      },
      getList() {
        this.listLoading = true
        if(this.role == 'admin') {
          UserList().then(response => {
            this.list = response.data.data
            this.total = response.data.total
            this.listLoading = false
            this.listLength = response.data.data.length
          })
        }
      },
      handleCreate() {
        this.resetCreate()
        this.createUserFormVisible = true
        this.$nextTick(() => {
          this.$refs['createDataForm'].clearValidate()
        })
      },
      createUser() {
        this.$refs.createDataForm.validate(valid => {
          if(valid) {
            var qs = require('qs');
            let data = {
              'username': this.createForm.username,
              'password': this.createForm.password
            }
            let datapost = qs.stringify(data)
            addUser(datapost).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.createUserFormVisible = false
            }).catch(() => {
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.resetModify()
        this.selectedId = row.id;
        // console.log(this.selectedId);
        // this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['modifyDataForm'].clearValidate()
        })
      },
      updateUser() {
        this.$refs['modifyDataForm'].validate((valid) => {
          if (valid) {
            let data = {
              password: this.form.passwordNew
            }

            const id = this.selectedId;
            let qs = require('qs');

            let userData = qs.stringify(data);
            updateUser(userData, id).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '失败',
                message: '更改失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        let id = row.id;
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.username.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .userManage-container {
    height: 100%;
    width: 100%;
    background-color: #f9f9f9;
    .login-form {
      height:80%;
      position: absolute;
      left: 0;
      right: 0;
      width: 60%;
      padding: 0px 35px 15px 35px;
      margin: 10px auto;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login,&_ip {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        font-weight: 400;
        /*color: $light_gray;*/
        margin: 20px auto 20px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 10px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          font-size: 40px;
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
