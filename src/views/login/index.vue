<template>
  <div class="login-container">
    <div class="content">
      <div class="logo">
        <span class="svg-container">
          <svg-icon icon-class="logo1" />
        </span>
      </div>
      <div class="title-container">
        <h3 class="title">XXX平台系统登录</h3>
      </div>
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <div class="ipContainer">
          <el-form-item prop="ipConfig" class="ipform">
            <span class="svg-container svg-container_ip">
              <svg-icon icon-class="IP" />
            </span>
            <el-input name="ipConfig" type="text" v-model="loginForm.ipConfig" autoComplete="on" placeholder="IP地址" />
          </el-form-item>
          <!--<span class="colon">:</span>-->
          <el-form-item prop="port" class="portform">
            <span class="svg-container">
              <svg-icon icon-class="port" />
            </span>
            <el-input name="port" type="text" v-model="loginForm.port" autoComplete="on" placeholder="端口号" />
          </el-form-item>
        </div>
        <el-form-item prop="username" class="userform">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="user" />
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
        </el-form-item>

        <el-form-item prop="password" class="passwordform">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>

        <el-button type="primary" style="width:100%;margin-bottom:20px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
        <div class="register-container">
          <span class="register-tips">没有账号？</span>
          <span class="register-btn" @click="jumpToRegister">注册</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { mapMutations } from 'vuex'
import service from '@/utils/request'
// import { getUserId } from '@/api/getUsers'
/* eslint-disable */
export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入正确的密码！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'rengu',
        password: 'rengu',
        ipConfig: '192.168.31.13',
        port: 8080
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    jumpToRegister() {
      this.$router.replace('/register')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        let username = this.loginForm.username;
        let password = this.loginForm.password;
        let ip = this.loginForm.ipConfig;
        let port = this.loginForm.port;
        let expireDays = 30;
        if (valid) {
          this.loading = true
         /* this.setloginname(username)
          this.setIP(ip)
          console.log(store.getters)*/
          this.setPort(port)
          this.setCookie('username', username, expireDays)
          // this.setCookie('password', password, expireDays)
          this.setCookie('ip', ip, expireDays)
          this.setCookie('port', port, expireDays)
          service.defaults.baseURL = 'http://' + ip + ':' + port // 动态设置api接口

          /*let formData = new FormData();
          formData.append('username', username);
          formData.append('password', password);
          formData.append('grant_type', 'password');
          formData.append('scope', 'SCOPES');
          formData.append('client_id', 'OAUTH_CLIENT_ID');
          formData.append('enctype', "multipart/form-data");*/

          let qs = require('qs');
          let formData = qs.stringify({
            "username": username,
            'password': password,
            'grant_type': 'password',
            'scope': 'SCOPES',
            'client_id': 'OAUTH_CLIENT_ID',
            'enctype': 'OAUTH_CLIENT_ID'
          })

          this.$store.dispatch('LoginByUsername', formData).then(() => {
            this.loading = false
            // this.getUserInfo()
            this.$router.push({ path: '/projectManage' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
   /* getUserInfo () {
      getUserId().then((res) => {
        this.setCookie('userId', res.data.data.id)
      })
    },*/
    login: function () {
      /*let username = $("input#username").val();
      let password = $("input#password").val();*/
      let username = this.loginForm.username;
      let password = this.loginForm.password;
      /*let ip = $("input#ip").val();
      let port = $("input#port").val();*/
      let ip = this.loginForm.ipConfig;
      let port = this.loginForm.port;
      //let expireDays = 1000 * 60 * 60 * 24 * 15;
      let expireDays = 30;        //天数

      if (username.length == 0 || password.length == 0) {
        //alert("请输入正确的用户名或密码。");
        /*layer.msg('请输入正确的用户名或密码！');*/
        return;
      } else {
        this.setCookie('username', username, expireDays);
        this.setCookie('password', password, expireDays);
      }

      //ip地址
      var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      var reg = ip.match(exp);
      if (reg == null) {
        //alert("IP地址不合法！");
        /*layer.msg('IP地址不合法！');*/
        return;
      } else {
        this.setCookie('ip', ip, expireDays);
      }
      if (port.length == 0) {
        /*layer.msg('请输入端口号！');*/
        return;
      } else {
        this.setCookie('port', port, expireDays);
      }

      this.setIP(ip)
      this.setPort(port)
      this.setloginname(username)
      /*alert(this.getIP())*/
      this.$axios.get(this.getIP() + "users/login",
        {
          auth: {
            username: username,
            password: password
          }
        }
      )
        .then(res => {
          console.log('success')
          /*commit('SET_TOKEN', role)*/
          /*this.$store.commit('SET_TOKEN','Admin-Token')*/
         /* this.setToken('Admin-Token')*/

          console.log(res.data)
          /*this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.$router.replace('/')
          })*/
          let userData = res.data
          console.log(2)
          //将用户名、密码的值存入cookie中
          console.log(username)
          this.setCookie('username', username, expireDays);
          this.setCookie('password', password, expireDays);
          this.setCookie('userId', res.data.data.id, expireDays);
          this.setCookie('ip', ip, expireDays);
          this.setCookie('port', port, expireDays);
          this.setCookie('Admin-Token','admin', expireDays);
          let userInfo1 = {
            username: userData.username,
            password: 'admin',
            /*password: userData.data.password,
            ip: userData.ip,
            port: userData.port,*/
            userId: userData.data.id
          }
          console.log(userInfo1)
        /*  this.$store.dispatch('LoginByUsername', userInfo1).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            console.log('loginByUserNameError')
            this.loading = false
          })*/
          this.$router.replace('/')
        })
        .catch(function (error) {
          //console.log(res.data.data);
          console.log(typeof(error.response));
          if(typeof(error.response) == "undefined"){
            /*layer.msg('请检查IP或端口号是否正确！');*/
          }else{
            /*layer.msg('请输入正确的用户名或密码！');*/
            error.response.data.length = 0;
          }
          //console.log(error.response.data);
        });
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setRoles: 'SET_ROLES',
      setName: 'SET_NAME',
      setIP: 'SET_IP',
      setPort: 'SET_PORT',
      setloginname: 'SET_LOGINNAME'
    })
  },
  created() {
    this.setIP(this.loginForm.ipConfig)
    this.setPort(this.loginForm.port)
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style scoped>
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #f9f9f9;
  }
  .login-container .content{
    margin:40px auto;
  }
  .logo{
    text-align: center;
    font-size: 60px;
    margin-bottom: 30px;
    cursor: pointer;
  }
  .login-container .el-form-item {
    margin-bottom: 24px;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 24%;
    padding: 35px 20px 15px 20px;
    margin: 0 auto;
    background-color: #fff;
    border:1px solid #ccc;
    border-radius:8px;
  }
  .title-container {
    position: relative;
  }
  .title {
    font-size: 18px;
    /*font-weight: 400;*/
    color: #000;
    margin: 0px auto 10px auto;
    text-align: center;
    /*font-weight: bold;*/
  }
  .ipform, .portform, .userform, .passwordform {
    position: relative;
  }
  .login-form span.svg-container{
    position: absolute;
    z-index:99;
    top:0;
    left:6px;
  }
  .show-pwd {
    position: absolute;
    z-index:99;
    top:0;
    right: 8px;
  }
  .register-container{
    text-align: center;
    font-size: 14px;
  }
  .register-container .register-btn{
    color: #409EFF;
    cursor: pointer;
  }
</style>
