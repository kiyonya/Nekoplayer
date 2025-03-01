<template>
  <ModalWindow :mask="false" @close="closeWindow">
    <h1>登录网易云账号</h1>
    <div class="login">
      <div class="qr">
        <img
          :src="qrimg"
          alt=""
        />
        <div class="masker"></div>
        <span class="qr-tip" style="color: aliceblue">{{ qrmsg }}</span>
      </div>

      <div class="other">
        <div class="selector">
          <span @click="loginMethod = 0">验证码</span>
          <span @click="loginMethod = 1">密码</span>
          <!-- <span @click="loginMethod = 2">邮箱</span> -->
          <span @click="loginMethod = 3" >游客</span>
        </div>
        <div class="view phone-captcha" v-if="loginMethod === 0">
          <input type="text" placeholder="请输入手机号" v-model="loginAsCaptcha.phone"/>
          <div class="captcha">
            <input type="text" name="" id="" placeholder="请输入验证码" v-model="loginAsCaptcha.captcha" />
            <button class="get" @click="getCaptcha">{{ captchaFreeze > 0 ? captchaFreeze + "s" : "获取验证码" }}</button>
          </div>
          <button class="login-go" @click="phoneAndCaptchaLogin()">登录</button>
        </div>

        <div class="view phone-password" v-if="loginMethod === 1">
          <input type="text" placeholder="请输入手机号" v-model="loginAsPassword.phone"/>
          <input type="text" placeholder="请输入密码" v-model="loginAsPassword.password"/>
          <button class="login-go">登录</button>
        </div>

        <div class="view mail" v-if="loginMethod === 2">
          <div class="nmail">
            <input type="text" placeholder="请输入邮箱"/>
            <span class="adn">@163.com</span>
          </div>
          <input type="text" placeholder="请输入密码"/>
          <button class="login-go">登录</button>
        </div>

        <div class="view anonymous" v-if="loginMethod === 3" >
          <span class="tip"></span>
          <button class="login-go" @click="()=>{
            anonimousLogin().then(closeWindow)
          }">登录</button>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>
<script setup>
import ModalWindow from './windows/ModalWindow.vue'
import {  getQRKey, getQRImg, checkQR,sendCaptcha,verifyCaptcha,anonimousLogin,refreshProfile, login } from '../api/auth'
import {setCookie} from '../api/cookie'
import { store } from '@/store'
import { ref } from 'vue'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
const crypto = require('crypto')
const loginStatus = computed({
  get: () => store.state.loginStatus,
  set: (val) => {
    store.commit('updateLoginStatus', val)
  }
})
const loginMethod = ref(0)
const loginAsCaptcha = ref({
  phone:'',
  captcha:''
})
const loginAsPassword = ref({
  phone:'',
  password:'',
  enc:'md5'
})
const qrimg = ref('')
const qrmsg = ref('扫描二维码以登录')
let qrChecker = null
function getQRcodeLogin() {
  return new Promise(async (resolve, reject) => {
    const unikey = await getQRKey()
    qrimg.value = (await getQRImg(unikey))?.data?.qrimg
    qrChecker = setInterval(async () => {
      const qrStatus = await checkQR(unikey)
      const code = qrStatus?.code
      if (code === 800) {
        qrmsg.value = '二维码过期'
        clearInterval(qrChecker)
        reject('timeout')
      } else if (code === 801) {
        qrmsg.value = '扫描二维码以登录'
      } else if (code === 802) {
        qrmsg.value = '待确认'
      } else if (code === 803) {
        qrmsg.value = '登录成功'
        clearInterval(qrChecker)
        resolve(qrStatus.cookie)
      }
    }, 1000)
  })
}

function loginAsQRCode() {
  getQRcodeLogin()
    .then((cookie) => {
      localStorage.setItem("@cookie",cookie)
      login(cookie)
    })
    .catch(() => {
      loginAsQRCode()
    })
}

let captchaFreeze = ref(0)
async function getCaptcha(){
  if(captchaFreeze.value > 0){return}
  const phone = loginAsCaptcha.value.phone
  if(!phone){return}
  const data = await sendCaptcha(phone)
  if(!data?.data){return}
  captchaFreeze.value = 60
  let timer = setInterval(() => {
    if(captchaFreeze.value <= 0){
      clearInterval(timer)
      return
    }
    captchaFreeze.value --
   
  }, 1000);
}
async function phoneAndCaptchaLogin(){
  const phone = loginAsCaptcha.value.phone
  const captcha = loginAsCaptcha.value.captcha
  if(!phone || !captcha || captcha.length !== 4){return}
  const verify = await verifyCaptcha(phone,captcha)
  if(verify?.data === true){
    //登陆成功 进行检查和更新
    document.cookie
  }
}
onMounted(() => {
  loginAsQRCode()
})
onUnmounted(()=>{
  clearInterval(qrChecker)
})
function closeWindow(){
  store.commit('showLoginWindow',false)
}
</script>
<style scoped>
.login {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  .other {
    display: flex;
    flex-direction: column;
    color: var(--text-o-2);
    flex: 1;
    gap: 0.5rem;
  }
  .selector {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  input {
    width: 16rem;
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
    outline: none;
    background: var(--ui-light);
    border: none;
    color: var(--text);
    border-radius: var(--br-1);
  }

  .phone-captcha {
    .captcha {
      width: 17.2rem;
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      input {
        width: 10rem;
      }
      .get {
        flex: 1;
        font-size: 0.8rem;
      }
    }
    
  }
  .mail{
    .nmail{
      width: 17.2rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      input {
        width: 10rem;
      }
      .adn{
        display: block;
        flex: 1;
      }
    }

  }
  .anonymous{
    .login-go{
      width: 17.2rem;
    }
  }
  .qr {
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    
    img {
        width: 12rem;
        height: 12rem;
        border-radius: var(--br-2);
      }
    .qr-tip{
      font-size: 0.9rem;
    }
  }

  .login-go {
      width: 100%;
      background: var(--strong);
      color: #fff;
    }
}
</style>
