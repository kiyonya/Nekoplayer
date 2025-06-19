const osMap = {
  pc: {
    os: 'pc',
    appver: '3.1.6.203622',
    osver: 'Microsoft-Windows-10-Professional-build-22631-64bit',
    channel: 'netease',
  },
  linux: {
    os: 'linux',
    appver: '1.2.1.0428',
    osver: 'Deepin 20.9',
    channel: 'netease',
  },
  android: {
    os: 'android',
    appver: '8.20.20.231215173437',
    osver: '14',
    channel: 'xiaomi',
  },
  iphone: {
    os: 'iPhone OS',
    appver: '9.0.90',
    osver: '16.2',
    channel: 'distribution',
  },
}
const os = 'pc'
function cookieToJson(cookie:string):object{
  if (!cookie) return {}
    let cookieArr = cookie.split(';')
    let obj = {}
    cookieArr.forEach((i) => {
      let arr = i.split('=')
      if (arr.length == 2) obj[arr[0].trim()] = arr[1].trim()
    })
    return obj
}


import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie } from '@/api/cookie';
// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:11451',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json'},
  withCredentials:true,
});
async function request<T>(config: AxiosRequestConfig & { nocookie?: boolean; body?: any }): Promise<T> {
  const { url, method = 'post', body = {}, nocookie = false, ...restConfig } = config;
  const headers = {
    ...restConfig.headers,
  };
  if (!nocookie) {
    body.cookie = {
      ...cookieToJson(getCookie()),
      osver: osMap[os].os,
      os: os,
      channel: osMap[os].channel,
      appver: osMap[os].appver,
    }
  } 
  else{
    body.noCookie = true
  }
  const requestData = {
    ...restConfig,
    method,
    url,
    data: body ? JSON.stringify(body) : undefined,
    headers,
  };
  try {
    const response: AxiosResponse<T> = await instance(requestData);

    const msg = `[${response.status}][${response.statusText}]${response.request.responseURL}`
  
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export default request;