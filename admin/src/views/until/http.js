import axios from 'axios'
import qs from 'qs'
const http = axios.create({
    baseURL: '/api',
    timeout: 1000,
    headers: {
        token: localStorage.getItem('token') //请求头
      }
  });
  //请求拦截器
  axios.interceptors.request.use( (config =>{
      console.log(config)
      //请求之前做的东西
    config.headers.token = localStorage.getItem('token')
    return config
  }))
  //响应拦截器
  axios.interceptors.response.use((response => {
      return response

  })  )
  export default http