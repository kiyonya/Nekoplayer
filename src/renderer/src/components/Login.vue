<template>
  <ModalWindow :mask="false" @close="closeWindow">
    <div class="login">
      <!-- 二维码扫码登录 -->
      <div class="qr-login">
        <h2 class="title">扫描二维码登录</h2>
        <div class="qr-img-container">
          <div class="qr-mask" v-if="showQRMask">
            <span class="qr-tip">等待扫码</span>
          </div>
          <img :src="qrimg" alt="二维码" class="qrcode">
        </div>
        <span class="tip">打开 网易云音乐 点击<br>
          [推荐]界面左上角图标扫码登录</span>
      </div>

      <div class="gp"></div>
      <!-- 其他登录方式，手机验证码登录 -->
      <div class="phone-login">
        <div class="selector">
          <span :class="{'hl':loginMethod == 0}" @click="loginMethod = 0">短信登录</span>
          <span :class="{'hl':loginMethod == 1}" @click="loginMethod = 1">密码登录</span>
        </div>
        <!-- 短信 -->
        <div  v-if="loginMethod == 0" class="mth">
          <input type="text" name="" placeholder="请输入手机号" v-model="loginAsCaptcha.phone">
          <div class="code">
            <input type="text" placeholder="请输入验证码" v-model="loginAsCaptcha.captcha">
            <button class="get-code" @click="getCaptcha">{{ captchaFreeze ? captchaFreeze : "获取验证码" }}</button>
          </div>
          <button class="dologin" @click="phoneAndCaptchaLogin">登录</button>
        </div>
        <!-- 密码 -->
        <div  v-if="loginMethod == 1" class="mth">
          <input type="text" placeholder="请输入手机号" v-model="loginAsPassword.phone">
          <div class="password">
            <input type="text" placeholder="请输入密码" v-model="loginAsPassword.password">
            <!-- 可见 -->
            <!-- 不可见 -->
          </div>
          <button class="dologin" @click="phoneAndPasswordLogin">登录</button>
        </div>
        

        <!-- 更多 -->
         <div class="more">
          <span class="more-tip tip">使用其他方式登录</span>

          <div class="more-icon">
            <!-- 图标 -->
            <Icon icon="majesticons:mail" class="i"/>
             <span>网易邮箱</span>
          </div>


         </div>

      </div>




    </div>
  </ModalWindow>
</template>
<script setup>
import ModalWindow from './windows/ModalWindow.vue'
import { getQRKey, getQRImg, checkQR, sendCaptcha, login,cellphoneLogin } from '../api/auth'
import { store } from '@/store'
import { ref } from 'vue'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
const showQRMask = ref(false)
const loginStatus = computed({
  get: () => store.state.loginStatus,
  set: (val) => {
    store.commit('updateLoginStatus', val)
  }
})
const loginMethod = ref(0)
const loginAsCaptcha = ref({
  phone: '',
  captcha: ''
})
const loginAsPassword = ref({
  phone: '',
  password: '',
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
        closeWindow()
      }
    }, 1000)
  })
}

function loginAsQRCode() {
  getQRcodeLogin()
    .then((cookie) => {
      localStorage.setItem("@cookie", cookie)
      login(cookie)
    })
    .catch(() => {
      loginAsQRCode()
    })
}

let captchaFreeze = ref(0)
async function getCaptcha() {
  if (captchaFreeze.value > 0) { return }
  const phone = loginAsCaptcha.value.phone
  if (!phone) { return }
  const data = await sendCaptcha(phone)
  if (!data?.data) { 
    alert(data?.message)
    return }
  captchaFreeze.value = 60
  let timer = setInterval(() => {
    if (captchaFreeze.value <= 0) {
      clearInterval(timer)
      return
    }
    captchaFreeze.value--

  }, 1000);
}
async function phoneAndCaptchaLogin() {
  const phone = loginAsCaptcha.value.phone
  const captcha = loginAsCaptcha.value.captcha
  if (!phone || !captcha || captcha.length !== 4) { return }
  const loginAuth = await cellphoneLogin({
    phone,captcha
  })
  console.log(loginAuth)
}

async function phoneAndPasswordLogin() {
  const phone = loginAsPassword.value.phone
  const password = loginAsPassword.value.password
  if (!phone || !password) { return }
  const loginAuth = await cellphoneLogin({
    phone,password
  })
  console.log(loginAuth)
}





onMounted(() => {
  loginAsQRCode()
})
onUnmounted(() => {
  clearInterval(qrChecker)
})
function closeWindow() {
  store.commit('showLoginWindow', false)
}
</script>
<style scoped>
.login {
  width: 45rem;
  height: 25rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: var(--text-o-1);
  box-sizing: border-box;
  padding: 1rem 1rem;
  gap: 1rem;
}
.gp{
  width: 1px;
  height: 100%;
  margin-top: auto;
  margin-bottom: auto;
 background: var(--text-o-4);
 border-radius: 1px;
 opacity: 0.1;
 
}
input{
  background: var(--ui-light);
  box-sizing: border-box;
  padding: 0.8rem 0.8rem;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-o-1);
  border-radius: var(--br-1);
  outline: none;
  letter-spacing: 1px;
}
input:focus{
  outline: var(--strong) solid 2px;
}
button{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0.5rem;
  font-weight: 600;
  background: var(--strong);
  border: none;
  border-radius: var(--br-1);
  color: white;
}
.title{
  font-size: 1.2rem;
}
.tip{
  color: var(--text-o-4);
  font-size: 0.9rem;
  text-align: center;
  opacity: 0.7;
}
.qr-login{
  display: flex;
  flex-direction: column;
  gap: 1.7rem;
  align-items: center;
  width: 30%;

  .qr-img-container{
    width: 12rem;
    height: 12rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: var(--br-2);
    padding: 0.6em;
    box-sizing: border-box;
    background-color: var(--ui-dark);
  }

  .qrcode{
    width: 100%;
    height: 100%;
    z-index: 1;
    border-radius: var(--br-1);
  }
}

.phone-login{
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .hl{
    font-weight: 600;
  }
  
  .selector{
    display: flex;
    flex-direction: row;
    gap: 2rem;
    font-size: 1.1rem;
  }
  .mth{
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 22rem;
  }
  .password{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;

    input{
      flex: 1;
    }
  }
  .code{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    
    height: fit-content;
    button{
      height: 100%;
      min-width: 6rem;
    }

    input{
      flex: 1;
    }
  }
  
  .dologin{
    font-size: 1.1rem;
    letter-spacing: 1px;
  }

  .more{
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;

    .more-tip{
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: row;
      gap: 0.8rem;
      align-items: center;
    }
    .more-tip::before,::after{
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.301);
    }

    .more-icon{
      .i{
        width: 1.5em;
        height: 1.5em;
        padding: 0.5rem;
        background: var(--ui-light);
        border-radius:var(--br-1);
      }
      width: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap:0.3rem ;
      font-size: small;
      color: var(--text-o-3);
      margin-top: 1rem;
    }
  }
}
</style>