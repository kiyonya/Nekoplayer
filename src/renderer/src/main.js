import './assets/main.css'
import './assets/theme/style/default_theme.css'
import { createApp, watch } from 'vue'
import App from './windows/App.vue'
import router from './router'
import i18n from './i18n'
import * as theme from './utils/theme'
import { store } from './store'
import { login } from './api/auth'
import { computed } from 'vue'
import { useTheme } from './lib/theme'
import { startExtension } from './lib/extension'
import Player from './lib/player/player'
import { ob } from './utils/libs'
import { getUserLikes } from './api/user'
import {
  showConfirmDialog,
  showQuitDialog,
  showSideNotification
} from './components/notification/use_notification'
import { LocalMusic } from './lib/player/local'
import Toolkit from './lib/player/toolkit'
import path from 'path-browserify'
import { registeAppHotkey, registeGlobalHotKey } from './lib/hotkey'
import { getSongUrl } from './api/song'
const localMusic = new LocalMusic()
const toolkit = new Toolkit()
const player = new Player()

export { player, localMusic, toolkit }
const deviceScreenSize = computed({
  get: () => store.state.deviceScreenSize,
  set: (val) => store.commit('setDeviceScreenSize', val)
})
const isLogin = computed({
  get: () => store.state.isLogin,
  set: (val) => store.commit('isLogin', val)
})
const config = computed(() => store.state.config)
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
  const zoomLevel = computed(() => store.state.config.appZoomLevel)
  window?.webFrame?.setZoomLevel(Number(zoomLevel.value) || 0)
  const app = createApp(App)
  app.config.globalProperties.$theme = theme
  app.config.globalProperties.$store = store
  app.use(router)
  app.use(i18n)
  app.use(store)
  matchDeviceSize()
  window.addEventListener('resize', matchDeviceSize)
  window.os = getUserOsType()
  startExtension()
  useTheme()
  registeAppHotkey()
  registeGlobalHotKey()
  //上传网络状态
  store.commit('isOnline', window.navigator.onLine)
  window.addEventListener('online', () => {
    store.commit('isOnline', true)
  })
  window.addEventListener('offline', () => {
    store.commit('isOnline', false)
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
  app.mount('#app')
  const cookie = localStorage.getItem('@cookie') || ''
  login(cookie).then((uid) => {
    if (uid) {
      getUserLikes(uid).then((data) => {
        const likelist = new Set(Array.from(data.ids))
        store.commit('commitLikeList', likelist)
      })
    }
  })
  window.ln = () => {
    store.commit('isLogin', true)
  }
  window.uln = () => {
    store.commit('isLogin', false)
  }
  showSideNotification('Hello', '欢迎使用猫播', 1500, (close) => {
    close()
  })
  console.log(
    `%c
    888b    888          888               8888888b.  888                                    
    8888b   888          888               888   Y88b 888                                    
    88888b  888          888               888    888 888                                    
    888Y88b 888  .d88b.  888  888  .d88b.  888   d88P 888  8888b.  888  888  .d88b.  888d888 
    888 Y88b888 d8P  Y8b 888 .88P d88""88b 8888888P"  888     "88b 888  888 d8P  Y8b 888P"   
    888  Y88888 88888888 888888K  888  888 888        888 .d888888 888  888 88888888 888     
    888   Y8888 Y8b.     888 "88b Y88..88P 888        888 888  888 Y88b 888 Y8b.     888     
    888    Y888  "Y8888  888  888  "Y88P"  888        888 "Y888888  "Y88888  "Y8888  888     
                                                                        888                  
                                                                   Y8b d88P                  
                                                                    "Y88P"                   
  `,
    'color: skyblue;'
  )
  watch(isLogin, () => {
    if (isLogin.value) {
      player.initPersonalFM()
    }
  })
}
function matchDeviceSize() {
  const match = window.matchMedia('(min-width: 1300px)')
  if (match.matches) {
    deviceScreenSize.value = 1
  } else {
    deviceScreenSize.value = 0
  }
}
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
  let text = e.dataTransfer.getData('text/plain')
  if (text) {
    try {
      let url = new URL(text)
      if (['music.163.com'].includes(url.hostname)) {
        //网易云链接处理
        console.log(text)
        const path = url.pathname.substring(1)
        const query = text.split('?')[1]
        const params = new URLSearchParams(query)
        let id = params.get('id')
        if (path === 'playlist' && id) {
          router.push({ name: 'Playlist', params: { id: id } })
        } else if (path === 'artist' && id) {
          router.push({ name: 'Artist', params: { id: id } })
        } else if (path === 'song' && id) {
          let source = { type: 'web_drag_item', id: id }
          player.playInsertTracks(id, [{ id: id, source }], source)
        } else if (path === 'user/home' && id) {
          router.push({ name: 'User', params: { id: id } })
        } else if (path === 'album' && id) {
          router.push({ name: 'Album', params: { id: id } })
        }
      }
    } catch (e) {}
  }
  if (files.length <= 0) {
    return
  }
  const paths = Array.from(files).map((i) => i.path)
  if (paths.every((i) => ['.flac', '.mp3', '.wav'].includes(path.extname(i)))) {
    player.quickPlayAudioFiles(paths)
  } else if (['.jpg', '.png', '.jpeg', '.webp', '.tif', '.gif'].includes(path.extname(paths[0]))) {
    store.commit('updateTheme', { key: 'backgroundMode', value: 'image' })
    store.commit('updateTheme', { key: 'backgroundImage', value: paths[0].replace(/\\/g, '/') })
  } else if (['.mp4', '.webm', '.avi', '.wmv', '.mkv'].includes(path.extname(paths[0]))) {
    store.commit('updateTheme', { key: 'backgroundMode', value: 'video' })
    store.commit('updateTheme', { key: 'backgroundVideo', value: paths[0].replace(/\\/g, '/') })
  }
})

useApp()

export async function closeApp() {
  let quitBehavior = config.value.exitBehavior || 'close'

  if (quitBehavior === 'ask') {
    let choice = await showQuitDialog('退出行为', '', [
      { label: '隐藏到托盘', act: 'hide' },
      { label: '直接退出', act: 'close' }
    ])
    if (choice == 'canceled') {
      return
    } else {
      quitBehavior = choice
    }
  }

  if (quitBehavior === 'close') {
    window.electron.ipcRenderer.send('main:close')
  } else if (quitBehavior === 'hide') {
    window.electron.ipcRenderer.send('main:hide')
  }
}

window.downloadTest = async () => {
  let savePath = 'C:\\Users\\lenovo\\Desktop\\dp'
  let ids = [432486474, 2676706396, 2672829798]
  ids = ids.map((id) => getSongUrl(id, 'lossless'))
  let urls = (await Promise.all(ids)).map((i) => i.url)
  console.log(urls)
  let i = 0
  let taskIds = []
  for (let url of urls) {
    let taskid = await window.electron.ipcRenderer.invoke('file:addDownloadTask', {
      url,
      savePath,
      fileName: i + '.flac'
    })
    taskIds.push(taskIds)
    i++
  }
  console.log(taskIds)
  // 添加任务...

  let int = setInterval(async () => {
    const status = await window.electron.ipcRenderer.invoke('file:getDownloadTasksStatus')
    if (status?.every((i) => i.status === 'completed')) {
      clearInterval(int)
      console.log('任务已完成')
    }
    console.log(status)
  }, 500)
}
