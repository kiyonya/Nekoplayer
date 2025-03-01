import './assets/main.css'
import './assets/theme/style/default_theme.css'
import { createApp, watch } from 'vue'
import App from './windows/App.vue'
import Wallpaper from './windows/wallpaper/Wallpaper.vue'
import router from './router'
import i18n from './i18n'
import * as theme from './utils/theme'
import { store } from './store'
import temp from './store/temp'
import {login, logout} from './api/auth'
import { computed } from 'vue'
import saveData from './store/save'
import { useTheme } from './lib/theme'
import { ShortcutHandler } from './utils/shortcutHandler'
import { startExtension } from './lib/extension'
import { FileDownloader } from './utils/downloader'
import Player from './lib/player/player'
import { ob } from './utils/libs'
import IntersectionAPI from './lib/intersection'
import { getCookie } from './api/cookie'
import { getUserLikes, getUserPlaylist } from './api/user'
import { initFileCache } from './lib/cache/cacheAudio'
import { showSideNotification } from './components/notification/use_notification'
const player = new Player()
export {player}
const fs = require('fs')
const app = createApp(App)
app.config.globalProperties.$theme = theme

app.config.globalProperties.$store = store
app.config.globalProperties.$temp = temp
app.use(router)
app.use(i18n)
app.use(store)
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
const shortcut = computed(()=>{
  return store.state.config.shortcut
})
const deviceScreenSize = computed({
  get:()=>store.state.deviceScreenSize,
  set:(val)=>store.commit("setDeviceScreenSize",val)
})
const viewScrollY = computed(()=>{
  return store.state.viewScrollY
})
const isLogin = computed({
  get:()=>store.state.isLogin,
  set:(val)=>store.commit('isLogin',val)
})
IntersectionAPI.init()
app.directive('intersect', {
  inserted(el, binding) {
    const callback = binding.value; 
    if (typeof callback === 'function') {
      IntersectionAPI.observe(el, callback);
    } else {
      console.error('v-intersect directive requires a function as the value.');
    }
  },
  unbind(el) {
    IntersectionAPI.observer.unobserve(el);
    IntersectionAPI.callbacks.delete(el);
  },
});






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
  const hash = location.hash
  matchDeviceSize()
  window.addEventListener('resize',matchDeviceSize)
  if(hash === "#/wavedesktop"){
    useWaveDesktop()
    return
  }
  //启用扩展
  startExtension()
  
  //获取应用信息
  window.api.queryAppInfo().then(info=>{store.commit('setAppInfo',info);console.table(info)
    //初始化缓存区
    initFileCache()
  })
  useTheme()
  temp.online.value = navigator.onLine
  window.addEventListener('online', () => {
    temp.online.value = true
  })
  window.addEventListener('offline', () => {
    temp.online.value = false
  })
  
  app.directive("lazy",{
    mounted(el,binding){
      if(binding !== false){
        ob.observe(el)
      }
      el.onerror = ()=>{
        el.src = el.dataset.src
      }
    }
  })

  app.directive("horizontal",{
    mounted(el){
      el.addEventListener("wheel",(e)=>{
        el.scrollLeft += e?.deltaY * 1.5
      })
    },
  })
  const cookie = localStorage.getItem('@cookie') || ""
  login(cookie).then(uid=>{
    if(uid){
      getUserLikes(uid).then(data=>{
        const likelist = new Set(Array.from(data.ids))
        store.commit('commitLikeList',likelist)
      })
    }
  })
  app.mount('#app')
  showSideNotification("Hello","欢迎使用猫播",1500,(close)=>{close()})

  //router.push({name:'Recommend'})
  
  //监听快捷键
  new ShortcutHandler(300).listen(window,matchFunc)
  //设置下载器
  
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
}

useApp()

window.unmounted = () => {
  app.unmount()
}
export function openPath(path) {
  window.electron.ipcRenderer.send('shell:openExplorer', path)
}
window.opendir = async () => {
  const path = await window.api.openDir()
  return path
}

function matchFunc(keys){
  const k = keys.sort()
  for(let i in shortcut.value){
    let stk = shortcut.value[i].app
    
    const sk = Array.isArray(stk) ? stk.sort() : [stk]
    if(sk.join('+') === k.join('+')){
      matched(i)
    }
  }

  function matched(name){
    console.log(name)
    switch (name){
      case "previous":
        player.previous()
        break
      case "next":
        player.next()
        break
      case "playAndPause":
        player.playOrPause()
    }
  }
}

function useWaveDesktop(){
  const waveDesktop = createApp(Wallpaper)
  waveDesktop.use(store)
  waveDesktop.mount("#app")
}

function matchDeviceSize(){
  const match = window.matchMedia("(min-width: 1301px)")
  if(match.matches){
      deviceScreenSize.value = 1
  }
  else{
      deviceScreenSize.value = 0
  }
}
function loadGlobalResource(uid){
  getUserPlaylist(uid).then(data=>{
    store.commit("updateUserPlaylist",data)
  })
  getUserLikes(uid).then(data=>{
    
  })
}
export function getViewScroll(key){
  return viewScrollY.value[key] || 0
}
export function resetApp(){
  localStorage.clear()
  logout()
  location.reload()
}

watch(isLogin,()=>{
  if(isLogin.value){
    player.initPersonalFM()
  }
})

window.mine = ()=>{router.push({name:"Mine"})}