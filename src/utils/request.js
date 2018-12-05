import axios from 'axios'
// import { Message } from 'element-ui'
import store from '@/store'
import { getToken, getIp, getPort, getExpire } from '@/utils/auth'
// create an axios instance
const ip_set = store.getters.ipconfig
const port = store.getters.port
// const config_set = 'http://' + ip_set + ':' + port
const ipConfig = getIp()
const portConfig = getPort()
const serviceConfig = 'http://' + ipConfig + ':' + portConfig

const timeStamp = getExpire()
const qs = require('qs')
const service = axios.create({
  /* baseURL: process.env.BASE_API,*/
  /* baseURL: serviceConfig*/
  baseURL: serviceConfig // api的base_url
  /* baseURL: "http://192.168.0.107:9090",*/// api的base_url

})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = 'Bearer' + getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  if (timeStamp < (new Date()) / 1000) {
    const formData = qs.stringify({
      'grant_type': 'refresh_token',
      'scope': 'SCOPES',
      'client_id': 'OAUTH_CLIENT_ID',
      'enctype': 'OAUTH_CLIENT_ID',
      'Authorization': 'Bearer' + getToken(),
      'refresh_token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJyZW5ndSIsInNjb3BlIjpbIlNDT1BFUyJdLCJhdGkiOiI3NTQ4YjIwMS1hMzQ0LTQ1OGYtODQzOC0yN2FhODZiZDM4YzEiLCJleHAiOjE1MzE0NjU3MDQsInVzZXJJZCI6ImU4MTVhOTU3LTc0MDUtNGU2Ni1iYjI2LTg4ZGVlZmJkYmI3ZSIsImF1dGhvcml0aWVzIjpbIlJPTEVfYWRtaW4iLCJST0xFX3VzZXIiXSwianRpIjoiZTEyMjg4ZjEtZjEzYy00ZmRiLWJjMGQtN2QyMTQ2MTliNjU0IiwiY2xpZW50X2lkIjoiT0FVVEhfQ0xJRU5UX0lEIn0.z2BnRQpIreqQEN-ORJO7Z77aXkmB3t8w4fBxsq3-8fo'
    })
    axios({
      method: 'post',
      url: service.defaults.baseURL + '/oauth/token',
      // data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJyZW5ndSIsInNjb3BlIjpbIlNDT1BFUyJdLCJhdGkiOiJkNThhZjU2MC0zY2Y1LTQ1ZDMtOWNkNi1lZDBhYmIyNDBjMTciLCJleHAiOjE1MzE0NTg3MzcsInVzZXJJZCI6IjZjYTlmMjI5LWQ2N2QtNDYzMC05ODhhLWYwOGMxNTY3NDg5YSIsImF1dGhvcml0aWVzIjpbIlJPTEVfYWRtaW4iLCJST0xFX3VzZXIiXSwianRpIjoiNmExODkzZmEtZDUwMi00ODA2LThlZDAtMTBhZjM0YTRmMTBhIiwiY2xpZW50X2lkIjoiT0FVVEhfQ0xJRU5UX0lEIn0.X_U7GV7kUEcirtCSR2lUsihng3e7EiM0Y66iNEb3m3Q'
      data: formData
    }).then(function(res) {
      alert('22223rrr')
      // resolve()
    }).catch(() => {
      // reject()
    })
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    console.log('err' + error)// for debug
    /*  Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })*/
    return Promise.reject(error)
  })

export default service
