import './assets/main.css'
import './assets/theme/style/default_theme.css'
import { createApp, watch } from 'vue'
import App from './windows/App.vue'
import router from './router'
import i18n from './i18n'
import * as theme from './utils/theme'
import { store } from './store'
import temp from './store/temp'
import { login, logout } from './api/auth'
import { computed } from 'vue'
import saveData from './store/save'
import { useTheme } from './lib/theme'
import { startExtension } from './lib/extension'
import Player from './lib/player/player'
import { ob } from './utils/libs'
import { getUserLikes} from './api/user'
import { showSideNotification } from './components/notification/use_notification'
import DesktopPlayer from './windows/DesktopPlayer.vue'
import { LocalMusic } from './lib/player/local'
import Toolkit from './lib/player/toolkit'
import path from 'path-browserify'
import { registeAppHotkey } from './lib/hotkey'

const player = new Player()
const localMusic = new LocalMusic()
const toolkit = new Toolkit()
export { player, localMusic, toolkit }
const loginStatus = computed({
  get: () => store.state.loginStatus,
  set: (val) => {
    store.commit('updateLoginStatus', val)
  }
})
const profile = computed({
  get: () => store.state.profile,
  set: (val) => {
    store.commit('updateProfile', val)
  }
})
const shortcut = computed(() => {
  return store.state.config.shortcut
})
const deviceScreenSize = computed({
  get: () => store.state.deviceScreenSize,
  set: (val) => store.commit('setDeviceScreenSize', val)
})
const viewScrollY = computed(() => {
  return store.state.viewScrollY
})
const isLogin = computed({
  get: () => store.state.isLogin,
  set: (val) => store.commit('isLogin', val)
})
//初始化audio

/**
 * 读取主题
 * 设置主题
 * 读取配置项
 * 读取本地存储数据
 *
 * 初始化AUDIO
 * 设置audio状态
 *
 * ~用户是否联网？
 * 挂载dom到app
 *
 * 读取存储cookies
 * 验证cookies
 *  ~是否显示登录窗口
 *
 * 退出时存储
 * 发送退出指令到主进程
 *
 */
function useApp() {
  const app = createApp(App)
  app.config.globalProperties.$theme = theme
  app.config.globalProperties.$store = store
  app.config.globalProperties.$temp = temp
  app.use(router)
  app.use(i18n)
  app.use(store)
  matchDeviceSize()
  window.addEventListener('resize', matchDeviceSize)
  window.os = getUserOsType()
  startExtension()
  useTheme()
  registeAppHotkey()
  temp.online.value = navigator.onLine
  window.addEventListener('online', () => {
    temp.online.value = true
  })
  window.addEventListener('offline', () => {
    temp.online.value = false
  })

  app.directive('lazy', {
    mounted(el, binding) {
      if (binding !== false) {
        ob.observe(el)
      }
      el.onerror = () => {
        el.src = el.dataset.src
      }
    }
  })

  app.directive('horizontal', {
    mounted(el) {
      el.addEventListener('wheel', (e) => {
        el.scrollLeft += e?.deltaY * 1.5
      })
    }
  })
  const cookie = localStorage.getItem('@cookie') || ''
  login(cookie).then((uid) => {
    if (uid) {
      getUserLikes(uid).then((data) => {
        const likelist = new Set(Array.from(data.ids))
        store.commit('commitLikeList', likelist)
      })
    }
  })
  app.mount('#app')
  showSideNotification('Hello', '欢迎使用猫播', 1500, (close) => {
    close()
  })

  window.unmountApp = () => {
    app.unmount()
  }

  console.log('app挂载完成')

  window.exitApp = () => {
    console.log('退出')
    saveData()
  }
  window.restartApp = () => {
    app.unmount()
    location.reload()
  }
  window.unmounted = () => {
    app.unmount()
  }
}
function useDesktop() {
  const mountel = document.createElement('div')
  document.body.appendChild(mountel)
  const app = createApp(DesktopPlayer)
  app.mount(mountel)
}
function GUIDE() {
  const hash = location.hash
  if (hash === '#/desktopplayer') {
    useDesktop()
  } else {
    useApp()
  }
}
export function openPath(path) {
  window.electron.ipcRenderer.send('shell:openExplorer', path)
}
window.opendir = async () => {
  const path = await window.api.openDir()
  return path
}
function matchDeviceSize() {
  const match = window.matchMedia('(min-width: 1301px)')
  if (match.matches) {
    deviceScreenSize.value = 1
  } else {
    deviceScreenSize.value = 0
  }
}
export function getViewScroll(key) {
  return viewScrollY.value[key] || 0
}
export function resetApp() {
  localStorage.clear()
  logout()
  location.reload()
}
watch(isLogin, () => {
  if (isLogin.value) {
    player.initPersonalFM()
  }
})

GUIDE()

function getUserOsType() {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/android/.test(userAgent)) {
    return 'android'
  }
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'iphone'
  }
  if (/linux/.test(userAgent)) {
    return 'linux'
  }
  if (/macintosh|mac os x/.test(userAgent)) {
    return 'pc'
  }
  if (/windows/.test(userAgent)) {
    return 'pc'
  }
  return 'pc'
}

document.addEventListener('dragover', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.body.style.cursor = 'pointer'
})

document.addEventListener('dragleave', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.body.style.cursor = 'auto'
})

document.addEventListener('drop', (e) => {
  e.preventDefault()
  e.stopPropagation()
  document.body.style.cursor = 'auto'
 let files = e.dataTransfer.files
  if (files.length <= 0) {
    return
  }
  const paths = Array.from(files).map(i=>i.path)
  if(paths.every(i=>[".flac",".mp3",".wav"].includes(path.extname(i)))){
    player.quickPlayAudioFiles(paths)
  }
  else if([".jpg",".png",".jpeg",".webp",".tif"].includes(path.extname(paths[0]))){
    store.commit('updateTheme', { key: "backgroundMode", value: "image" })
    store.commit('updateTheme', { key: "backgroundImage", value: paths[0].replace(/\\/g, '/') })
  }
})
