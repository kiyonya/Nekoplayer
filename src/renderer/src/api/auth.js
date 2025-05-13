import request from '../utils/request'
import { computed, ref } from 'vue'
import { store } from '@/store'
import { clearCookie, getCookie, setCookie } from './cookie'
const loginStatus = computed({
  get: () => store.state.loginStatus,
  set: (val) => {
    store.commit('updateLoginStatus', val)
  }
})
export async function checkLoginStatus(cookie) {
  //if(!cookie){return {data:{profile:null}}}
  const data = await request({
    url: `/login/status`,
    body: {
      cookie
    }
  })
  return data
}

export async function getQRKey() {
  const data = await request({
    url: `/login/qr/key?timestamp=${Date.now()}`
  })
  return data?.data?.unikey
}

export async function getQRImg(key) {
  const data = await request({
    url: `/login/qr/create?key=${key}&qrimg=png`
  })
  return data
}

export async function checkQR(key) {
  const data = await request({
    url: `/login/qr/check?key=${key}&timestamp=${Date.now()}`
  })
  return data
}

/**
 *
 * @param {number} phone
 * @returns
 */
export async function sendCaptcha(phone) {
  const data = await request({
    url: `/captcha/sent?phone=${phone}`
  })
  return data
}
/**
 *
 * @param {number} phone
 * @param {number} captcha
 * @returns
 */
export async function verifyCaptcha(phone, captcha) {
  const data = await request({
    url: `/captcha/verify?phone=${phone}&captcha=${captcha}`
  })
  return data
}

export async function refreshLogin() {
  const data = await request({
    url: `/login/refresh`
  })
}

export async function anonimousLogin() {
  const data = await request({
    url: `/register/anonimous`
  })
  setCookie(data?.cookie)
  loginStatus.value = 0
  store.commit("updateProfile",{ userId: data?.userId, nickname: '游客' })
  return true
}

export async function refreshProfile(cookie) {
  const status = await checkLoginStatus(cookie || getCookie())
  const profile = status?.data?.data?.profile
  if (profile) {
    store.commit('updateProfile',profile)
    return profile
  }
}

export async function logout() {
    request({
      url: '/logout'
    })
  store.commit("isLogin",false)
  store.commit("updateProfile",{})
  localStorage.removeItem("@cookie")
}
export async function login(cookie) {
  const loginStatus = await checkLoginStatus(cookie)
  const userProfile = loginStatus?.data?.profile
  const account = loginStatus?.data?.account
  if(account?.anonimousUser){
    store.commit("isLogin",false)
    return false
  }
  else if(userProfile){
    store.commit("isLogin",true)
    store.commit('updateProfile',userProfile)
    return userProfile.userId
  }
}