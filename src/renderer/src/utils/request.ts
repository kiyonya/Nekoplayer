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
    body.cookie = getCookie()
  } 
  const requestData = {
    ...restConfig,
    method,
    url,
    data: body ? JSON.stringify(body) : undefined,
    headers,
  };
  //console.log(requestData)
  try {
    const response: AxiosResponse<T> = await instance(requestData);
    console.log(response)
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