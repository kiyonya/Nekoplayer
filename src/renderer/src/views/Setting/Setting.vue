<template>
  <div class="page">
    <div class="nav">
      <div
        class="item"
        v-for="page in pages"
        @click="viewpage = page.id"
        :class="{ hl: viewpage === page.id }"
      >
        {{ page.name }}
      </div>
    </div>
    <div class="view">
      <div class="common area" v-if="viewpage === 'common'">
        <div class="account">
          <img :src="resize(profile?.avatarUrl,200)" alt="" class="avatar">
          <div class="user-info">
            <h2 class="user-name">{{ isLogin ? profile?.nickname : '未登录'  }}</h2>
            <span class="sign">{{ profile?.signature }}</span>
          </div>
          <button class="native-o-button" @click="logout" v-if="isLogin">退出登录</button>
          <button class="native-o-button" @click="store.commit('showLoginWindow',true)" v-else="isLogin">登录</button>
        </div>
        <div class="group">
          <div class="cell">
          <span class="tip">重置应用(遇到问题点我)</span>
          <button class="set-btn" @click="resetApp">重置</button>
          </div>
        </div>
      </div>
      <div class="appearance area" v-if="viewpage === 'appearance'">
        <h1 class="title">基础外观</h1>
        <div class="group">
          <div class="cell cell-col">
            <span class="tip">主题颜色（配色主题）</span>
            <div class="themes">
              <div
                class="theme-shell"
                @click="setTheme({ key: 'color', value: 'default:follow' })"
                :class="{ used: theme.color === 'default:follow' }"
              >
                <div class="theme-color follow">
                  <Icon icon="lets-icons:color-mode" class="icon" />
                </div>
                <span>跟随系统</span>
              </div>
              <div
                class="theme-shell"
                @click="setTheme({ key: 'color', value: 'default:dark' })"
                :class="{ used: theme.color === 'default:dark' }"
              >
                <div class="theme-color dark">
                  <Icon icon="material-symbols-light:dark-mode" class="icon" />
                </div>
                <span>深色模式</span>
              </div>
              <div
                class="theme-shell"
                @click="setTheme({ key: 'color', value: 'default:light' })"
                :class="{ used: theme.color === 'default:light' }"
              >
                <div class="theme-color light">
                  <Icon icon="material-symbols-light:light-mode" class="icon" />
                </div>
                <span>浅色模式</span>
              </div>
            </div>
          </div>

          <div class="cell">
            <span class="tip">应用字体（部分字体可能不生效）</span>
            <select
              name=""
              id=""
              :value="theme.font"
              @change="
                (e) => {
                  setTheme({ key: 'font', value: e.target.value })
                }
              "
            >
              <option value="system-ui">默认字体</option>
              <option
                :value="font?.postscriptName || font?.fullName || font?.family"
                v-for="font in fonts"
                class="text-limit"
              >
                {{ font.fullName }}
              </option>
            </select>
          </div>
        </div>

        <h1 class="title">自定义外观</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">应用背景模式</span>
            <select
              name=""
              id=""
              :value="theme.backgroundMode"
              @change="
                (e) => {
                  setTheme({ key: 'backgroundMode', value: e.target.value })
                }
              "
            >
              <option value="none">无</option>
              <option value="image">图片</option>
              <option value="bloom">色彩晕染</option>
            </select>
          </div>

          <div class="background-image" v-if="theme.backgroundMode === 'image'">
            <div class="edit-img">
              <div class="image-ctn">
                <img
                  :src="theme.backgroundImage"
                  v-if="theme.backgroundImage"
                  alt=""
                  :style="{
                    filter: `blur(${theme.backgroundImageBlur}px) brightness(${theme.backgroundImageBrightness}) saturate(${theme.backgroundImageSaturate})`,
                    objectFit: theme.backgroundImageFit
                  }"
                />
              </div>
              <div class="img-set cell">
                <button class="set-btn" @click="useImage">选择图片</button>
                <select
                  name=""
                  id=""
                  @change="(e) => setTheme({ key: 'backgroundImageFit', value: e.target.value })"
                  :value="theme.backgroundImageFit"
                >
                  <option value="cover">覆盖</option>
                  <option value="contain">包含</option>
                  <option value="fill">填充</option>
                </select>
              </div>
            </div>
            <div class="img-parmas">
              <div class="slider">
                <span class="tip">明度</span>
                <VueSlider
                  width="30rem"
                  :lazy="true"
                  v-model="theme.backgroundImageBrightness"
                  :max="5"
                  :min="0"
                  :interval="0.1"
                ></VueSlider>
              </div>

              <div class="slider">
                <span class="tip">模糊度</span>
                <VueSlider
                  width="30rem"
                  :lazy="true"
                  v-model="theme.backgroundImageBlur"
                  :max="100"
                  :min="0"
                  :interval="1"
                ></VueSlider>
              </div>
              <div class="slider">
                <span class="tip">饱和度</span>
                <VueSlider
                  width="30rem"
                  :lazy="true"
                  v-model="theme.backgroundImageSaturate"
                  :max="5"
                  :min="0"
                  :interval="0.1"
                ></VueSlider>
              </div>
              <div class="slider">
                <span class="tip">不透明度</span>
                <VueSlider
                  width="30rem"
                  :lazy="true"
                  v-model="theme.backgroundImageOpacity"
                  :max="1"
                  :min="0"
                  :interval="0.1"
                ></VueSlider>
              </div>
            </div>
          </div>

          <div class="cell">
            <span class="tip">第三方主题</span>
          </div>
        </div>

        <h1 class="title">播放页外观</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">播放页背景模式</span>
            <select
              name=""
              id=""
              :value="config.musicPlayerBackgroundMode"
              @change="
                (e) => {
                  config = { key: 'musicPlayerBackgroundMode', value: e.target.value }
                }
              "
            >
              <option value="dynamic">动态（高性能）</option>
              <option value="image">图片</option>
              <option value="none">无</option>
            </select>
          </div>
          <div class="cell">
            <span class="tip">歌词模糊</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.musicPlayerLyricBlur"
              @change="
                (e) => {
                  config = { key: 'musicPlayerLyricBlur', value: e.target.checked }
                }
              "
            />
          </div>
          <div class="cell">
            <span class="tip">歌词辉光</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.musicPlayerLyricGlow"
              @change="
                (e) => {
                  config = { key: 'musicPlayerLyricGlow', value: e.target.checked }
                }
              "
            />
          </div>
        </div>
      </div>
      <div class="play area" v-if="viewpage === 'play'">
        <h1 class="title">播放设置</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">程序启动时自动播放</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.useMatchLocalFileOnNcm"
              @change="
                (e) => {
                  config = { key: 'useMatchLocalFileOnNcm', value: e.target.checked }
                }
              "
            />
          </div>

          <div class="cell">
            <span class="tip">保留播放记录</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.useMatchLocalFileOnNcm"
              @change="
                (e) => {
                  config = { key: 'useMatchLocalFileOnNcm', value: e.target.checked }
                }
              "
            />
          </div>

          <div class="cell">
            <span class="tip">播放时允许联网匹配本地音乐的信息</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.useMatchLocalFileOnNcm"
              @change="
                (e) => {
                  config = { key: 'useMatchLocalFileOnNcm', value: e.target.checked }
                }
              "
            />
          </div>
        </div>
        <h1 class="title">音频设置</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">音频质量</span>
            <select name="" id="" :value="config.audioQuaility">
              <option value="stadard">标准（128kbps）</option>
              <option value="higher">较高（192kbps）</option>
              <option value="exhigh">极高（320kbps）</option>
              <option value="lossless">无损</option>
              <option value="hires">Hi-Res</option>
            </select>
          </div>
          <div class="cell">
            <span class="tip">输出设备</span>
            <select
              name=""
              id=""
              style="width: fit-content"
              @change="(e) => handleAudioOutputDevice(e.target.value)"
            >
              <option v-for="d in audioOutputDevices" :value="d.deviceId">{{ d.label }}</option>
            </select>
          </div>
          <div class="cell">
            <span class="tip">使用音频淡入淡出</span>
            <input type="checkbox" name="" id="" class="el-switch" />
          </div>
          <div class="cell">
            <span class="tip">记录上一次播放进度</span>
            <input type="checkbox" name="" id="" class="el-switch" />
          </div>
          <div class="cell">
            <span class="tip">平衡不同音频的音量</span>
            <input type="checkbox" name="" id="" class="el-switch" />
          </div>
          <div class="cell">
            <span class="tip">程序启动时自动播放</span>
            <input type="checkbox" name="" id="" class="el-switch" />
          </div>
        </div>

        <h1 class="title">音效设置</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">使用图形均衡器</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.useEQ"
              @change="
                (e) => {
                  config = { key: 'useEQ', value: e.target.checked }
                }
              "
            />
          </div>
          <button class="set-btn" @click="store.commit('showEqualizer',true)">
            打开图形均衡器窗口
          </button>
        </div>

        <h1 class="title">歌词设置</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">允许本地缓存歌词（本地音乐）</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.useCacheLocalMusicLyric"
              @change="
                (e) => {
                  config = { key: 'useCacheLocalMusicLyric', value: e.target.checked }
                }
              "
            />
          </div>

          <div class="cell">
            <span class="tip">允许读取本地缓存歌词（本地音乐）</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.useLocalCacheLyric"
              @change="
                (e) => {
                  config = { key: 'useLocalCacheLyric', value: e.target.checked }
                }
              "
            />
          </div>
        </div>
      </div>
      <!--存储-->
      <div class="store area" v-if="viewpage === 'store'">
        <h1 class="title">缓存设置</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">允许缓存</span>
            <Switch :value="config.allowCache" @change="(val) => cfg('allowCache', val)"></Switch>
          </div>
          <div class="cell">
            <span class="tip"
              >缓存目录：{{
                config.cacheConfig.path || path.join(appInfo.sessionData, 'fileCache')
              }}</span
            >
            <button class="set-btn">更改目录</button>
          </div>
          <div class="cell" style="justify-content: left; gap: 1rem">
            <span class="tip">缓存最大占用</span>
            <VueSlider
              width="30rem"
              :max="20480"
              :min="500"
              :interval="10"
              v-model="config.cacheConfig.maxsize"
            ></VueSlider>
            <span class="tip">520MB / {{ config.cacheConfig.maxsize }}MB</span>
            <button class="set-btn">清除缓存</button>
          </div>
        </div>

        <h1 class="title">下载设置</h1>
        <div class="group">
          <div class="cell">
            <span class="tip"
              >下载目录：{{
                config.downloadPath || path.join(appInfo.musicPath, 'nekoplayer_Download')
              }}</span
            >
            <button class="set-btn">更改目录</button>
          </div>
          <div class="cell">
            <span class="tip">下载音质</span>
            <select name="" id="" :value="config.downloadQuality">
              <option value="stadard">标准（128kbps）</option>
              <option value="higher">较高（192kbps）</option>
              <option value="exhigh">极高（320kbps）</option>
              <option value="lossless">无损</option>
              <option value="hires">Hi-Res</option>
            </select>
          </div>
          <div class="cell">
            <span class="tip">歌曲命名格式</span>
            <select name="" id="" :value="config.downloadNamingMethod">
              <option value="s">仅歌名</option>
              <option value="s-ar">歌名-艺术家</option>
              <option value="s-al">歌名-专辑名</option>
            </select>
          </div>
          <div class="cell">
            <span class="tip">下载进程数</span>
            <select name="" id="" :value="config.downloadProcessCount">
              <option value="1">1个</option>
              <option value="2">2个</option>
              <option value="3">3个</option>
            </select>
          </div>
        </div>

        <h1 class="title">应用日志</h1>
        <div class="group">
          <div class="cell">
            <div class="tip">日志目录：{{ appInfo.logs }}</div>
            <button class="set-btn" @click="openPath(appInfo.logs)">打开日志文件夹</button>
          </div>
        </div>
      </div>
      <!--快捷键-->
      <div class="shortcut area" v-if="viewpage === 'shortcut'">
        <h1 class="title">快捷键设置</h1>
        <div class="group">
          <div class="shotcuts">
            <div class="sc head">
              <span class="tip">功能</span>
              <span class="tip">快捷键</span>
              <span class="tip">全局快捷键</span>
            </div>
            <div class="sc" v-for="(key, value, index) in config.shortcut">
              <span class="tip">{{ key.name }}</span>
              <input
                type="text"
                class="stcin"
                :value="upperCaseArray(key.app)"
                :data-key="value"
                @focus="
                  (e) => {
                    handleShortcutChange(e, 'app')
                  }
                "
                @keydown.stop
              />
              <input
                type="text"
                name=""
                id=""
                class="stcin"
                :value="upperCaseArray(key.global)"
                :data-key="value"
                @keydown.stop
                @focus="
                  (e) => {
                    handleShortcutChange(e, 'global')
                  }
                "
              />
            </div>
          </div>

          <div class="cell">
            <button
              class="set-btn"
              @click="config = { key: 'shortcut', value: config.shortcutDefault }"
            >
              恢复默认
            </button>
          </div>
        </div>
        <div class="group">
          <div class="cell">
            <span class="tip">启用全局快捷键</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.useGlobalShortcut"
              @change="
                (e) => {
                  config = { key: 'useGlobalShortcut', value: e.target.checked }
                }
              "
            />
          </div>
          <div class="cell">
            <span class="tip">允许SMTC</span>
            <input
              type="checkbox"
              name=""
              id=""
              class="el-switch"
              :checked="config.allowSMTC"
              @change="
                (e) => {
                  config = { key: 'allowSMTC', value: e.target.checked }
                }
              "
            />
          </div>
        </div>
      </div>
      <!--扩展-->
      <div class="extend area" v-if="viewpage === 'extend'">
        <h1 class="title">音乐桌面</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">使用音乐桌面</span>
            <button class="set-btn" @click="useWaveDesktop">打开</button>
          </div>
          <div class="cell">
            <span class="tip">音乐桌面背景模式</span>
            <select
              name=""
              id=""
              :value="config.wallpaper.wallpaperBackgroundMode"
              @change="
                (e) => (wallpaper = { key: 'wallpaperBackgroundMode', value: e.target.value })
              "
            >
              <option value="fog">色彩迷雾</option>
              <option value="image">歌曲封面</option>
              <option value="transparent">透明</option>
            </select>
          </div>
          <div class="cell">
            <span class="tip">显示时间</span>
            <select
              name=""
              id=""
              :value="config.wallpaper.showTime"
              @change="(e) => (wallpaper = { key: 'showTime', value: e.target.value })"
            >
              <option value="none">不显示</option>
              <option value="HH:MM">HH:MM</option>
              <option value="HH:MM:SS">HH:MM:SS</option>
            </select>
          </div>
          <div class="cell">
            <span class="tip">显示日期</span>
            <select
              name=""
              id=""
              :value="config.wallpaper.showDate"
              @change="(e) => (wallpaper = { key: 'showDate', value: e.target.value })"
            >
              <option value="none">不显示</option>
              <option value="YY.MM.DD">YY.MM.DD</option>
              <option value="Day|MM.DD">Day | MM.DD</option>
              <option value="MM.DD">MM.DD</option>
            </select>
          </div>
          <span class="warn">*注意：这个功能尚处于测试阶段，可能会造成较高性能占用或其他问题</span>
        </div>
      </div>
      <!--工具-->
      <div class="tool area" v-if="viewpage === 'tool'">
        <h1 class="title">千万别点</h1>
        <div class="group">
          <div class="cell">
            <span class="tip">千万别点（真的）</span>
            <button class="set-btn" @click="heyWhatsWrong()">千万别点</button>
          </div>
        </div>

        <h1 class="title">下载器</h1>
        <div class="group downloader">
          <div class="cell">
            <span class="tip">下载地址</span>
            <input type="text" class="input-text" v-model="taskUrl" />
            <button class="set-btn" @click="(e)=>{taskUrl = '';taskFilename = ''}">清空</button>
          </div>
          <div class="cell">
            <span class="tip">保存到</span>
            <input type="text" class="input-text" v-model="config.toolDownloaderSavePath" />
            <button class="set-btn" @click="setSavePath">选择地址</button>
          </div>
          <div class="cell">
            <span class="tip">文件名</span>
            <input type="text" class="input-text" v-model="taskFilename" />
          </div>
          <div class="cell">
            <button class="set-btn" @click="startDownload">开始下载</button>
            <button class="set-btn" @click="openPath(config.toolDownloaderSavePath)">打开目标文件夹</button>
            <button class="set-btn" @click="tasks = {}">清空日志</button>
          </div>
          <div class="download-logs">
            <div class="task" v-for="(key, value) in tasks">
              <span class="task-name">下载任务  {{ key?.name }}</span>
              <div class="process">
                <div class="process-bar">
                  <div class="process-track" :style="{ width: `${key?.process}%` }"></div>
                </div>
                <span class="process">{{ key?.process < 100 ? key?.process + '%' : '已完成'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js" setup>
import { store } from '@/store'
import { ref, computed } from 'vue'
import { setTheme } from '@/lib/theme'
import { getLocalFonts, queryOutputAudioDevice, heyWhatsWrong } from '.'
import { onBeforeMount } from 'vue'
import VueSlider from 'vue-slider-component'
import { Icon } from '@iconify/vue'
import temp from '@/store/temp'
import { ShortcutHandler } from '@/utils/shortcutHandler'
import Switch from '@/components/Switch.vue'
import { openPath, resetApp } from '@/main'
import { taskUrl, taskFilename, setSavePath, startDownload, tasks } from './tool_filedownloader'
import { onBeforeRouteLeave } from 'vue-router'
import { logout } from '@/api/auth'
import { resize } from '@/utils/imageProcess'
const path = require('path')
const viewpage = ref('common')
const pages = [
  { name: '常规', id: 'common' },
  { name: '外观', id: 'appearance' },
  { name: '播放', id: 'play' },
  { name: '存储', id: 'store' },
  { name: '快捷键', id: 'shortcut' },
  { name: '扩展', id: 'extend' },
  { name: '工具', id: 'tool' },
]
const theme = computed({
  get: () => store.state.theme,
  set: ({ key, value }) => {
    store.commit('updateTheme', { key: key, value: value })
  }
})
const config = computed({
  get: () => store.state.config,
  set: ({ key, value }) => {
    store.commit('config', { key: key, value: value })
  }
})
const wallpaper = computed({
  get: () => store.state.config.wallpaper,
  set: ({ key, value }) => store.commit('updateWallpaper', { key, value })
})
const appInfo = computed(() => {
  return store.state.appInfo
})
const profile = computed(()=>store.state.profile)
const isLogin = computed(()=>store.state.isLogin)
function cfg(id, value) {
  config = { key: id, value: value }
}

const fonts = ref([])
const audioOutputDevices = ref([])
const shortcutHandler = new ShortcutHandler(300)
const themeColorGroup = [
  { name: 'default:follow', title: '跟随系统', color: ' gray' },
  { name: 'default:dark', title: '深色', color: 'rgb(35,37,39)' },
  { name: 'default:light', title: '浅色', color: '#ffffff' }
]
onBeforeMount(() => {
  getLocalFonts().then((f) => {
    fonts.value = f
  })
  queryOutputAudioDevice().then((audioDevice) => {
    audioOutputDevices.value = audioDevice
  })
})
onBeforeRouteLeave(() => {
  //localStorage.setItem('neko_config',JSON.stringify(config.value))
  console.log('save')
})
async function useImage() {
  const paths = await window.api.fsopen({
    title: '选择图片',
    filters: [{ name: '背景图片', extensions: ['png', 'jpg', 'gif'] }],
    properties: ['openFile']
  })
  if (paths) {
    setTheme({ key: 'backgroundImage', value: paths[0] })
  }
}

async function handleAudioOutputDevice(id) {
  console.log(id)
  await temp.audio.setSinkId(id)
}

function upperCaseArray(arr) {
  const res = []
  arr.forEach((word) => {
    res.push(word.charAt(0).toUpperCase() + word.slice(1))
  })
  return res.join('+')
}
function handleShortcutChange(e, type) {
  const el = e.target
  const id = e.target.dataset.key
  shortcutHandler.listen(
    el,
    (keys) => {
      store.commit('updateShortcut', { key: id, type: type, value: keys })
    },
    true
  )
  el.addEventListener('blur', blur)
  function blur() {
    shortcutHandler.unlisten()
    el.removeEventListener('blur', blur)
  }
}

function useWaveDesktop() {
  window.electron.ipcRenderer.send('wavedesktop:create')
}
</script>
<style scoped>
.page {
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
.nav {
  width: 15rem;
  height: calc(100% - 6rem);
  border-right: 2px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0rem;
}
.nav .item {
  width: 80%;
  font-weight: 500;
  font-size: 1.15rem;
  padding: 0.5rem 0.8rem;
  border-radius: var(--br-1);
}
.nav .hl {
  background-color: var(--ui);
  color: var(--strong);
  pointer-events: none;
}
.nav .item:hover {
  background: var(--hover);
}
.view {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  align-items: center;
}
.view .area {
  width: 100%;
  height: fit-content;
  display: inherit;
  align-items: inherit;
  flex-direction: inherit;
  gap: 1.1rem;
}
.view .area > *:last-child {
  margin-bottom: 4.5rem;
}
.group {
  width: calc(95%);
  height: fit-content;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  background-color: var(--component-diff);
  border-radius: var(--br-2);
  box-shadow: var(--shadow);
  backdrop-filter: blur(5px);
}
.title {
  font-size: 1.2rem;
  margin: 0 auto 0 2.5%;
  font-weight: 600;
}
.subtitle {
  font-size: 1.1rem;
}
.tip {
  font-size: 1rem;
  color: var(--text-o-1);
}
.warn {
  font-size: 0.9rem;
  color: orange;
}
.set-btn {
  width: fit-content;
  height: fit-content;
  padding: 0.3rem 0.8rem;
  display: flex;
  align-items: center;
  border: none;
  background: var(--ui-light);
  font-size: 1rem;
  border-radius: var(--br-1);
  color: var(--text-o-1);
}
.cell {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.cell select {
  color: var(--text-o-1);
  font-size: 1rem;
  padding: 0.3rem 0.7rem 0.3rem 0.3rem;
  background: var(--ui-light);
  width: 10rem;
  border: none;
  outline: none;
  border-radius: var(--br-1);
}
.cell select option {
  width: 8rem;
}
.cell .input-text {
  color: var(--text-o-1);
  font-size: 1rem;
  padding: 0.3rem 0.7rem 0.3rem 0.7rem;
  background: var(--ui-light);
  width: 5rem;
  border: none;
  outline: none;
  border-radius: var(--br-1);
}
.cell .input-text:focus {
  outline: 1.5px solid var(--strong);
}
.cell-col {
  .tip {
    margin-left: 0;
    margin-right: auto;
  }
  flex-direction: column;
  gap: 0.5rem;
  align-items: start;
}
.themes {
  display: flex;
  flex-direction: row;
  gap: 3rem;
}
.themes .used {
  .theme-color {
    border: 1.5px solid var(--strong);
  }
  pointer-events: hover;
}
.theme-shell {
  width: fit-content;
  height: fit-content;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-o-1);
  border-radius: var(--br-1);
  gap: 0.3rem;
}
.theme-shell:hover {
  background-color: var(--hover);
  .theme-color {
    box-shadow: var(--shadow-flow);
  }
}
.theme-shell .theme-color {
  width: 7rem;
  height: 5rem;
  border-radius: var(--br-1);
  position: relative;
  box-shadow: var(--shadow);
}
.theme-color .icon {
  width: 1.7em;
  height: 1.7em;
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
}
.theme-shell .follow {
  background: linear-gradient(35deg, rgb(26, 26, 35), rgb(26, 26, 35), 50%, rgb(245, 245, 245) 50%);
  color: white;
}
.theme-shell .dark {
  background: rgb(26, 26, 35);
  color: rgb(185, 190, 255);
}
.theme-shell .light {
  background: rgb(255, 255, 255);
  color: rgb(251, 108, 134);
}

.background-image {
  display: flex;
  flex-direction: row;
  gap: 3rem;
}
.background-image .edit-img {
  width: 17rem;
  height: 14rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.background-image .edit-img .image-ctn {
  overflow: hidden;
  width: 100%;
  height: 80%;
  background-color: var(--root);
  border-radius: var(--br-2);
}
.background-image .edit-img .image-ctn img {
  width: 100%;
  height: 100%;
}
.background-image .img-parmas {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  justify-content: center;
}
.shotcuts {
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}
.shotcuts .sc {
  display: flex;
  flex-direction: row;
  gap: 3rem;
  align-items: center;
}
.shotcuts .head {
  .tip:nth-child(2) {
    width: calc(9rem + 1.6rem);
  }
  .tip:nth-child(3) {
    width: calc(9rem + 1.6rem);
  }
}
.shotcuts .tip {
  display: block;
  width: 5rem;
}
.shotcuts .stcin {
  width: 9rem;
  height: fit-content;
  color: var(--text-o-1);
  background: var(--ui-light);
  border: none;
  border-radius: var(--br-1);
  padding: 0.5rem 0.8rem;
  outline: none;
  font-size: 1rem;
}
.shotcuts .stcin:focus {
  outline: 1.5px solid var(--strong);
}

.downloader .cell {
  justify-content: left;
  gap: 1.2rem;
}
.downloader .cell input {
  min-width: 30rem;
  width: fit-content;
}
.downloader .cell .tip {
  width: 5rem;
}
.downloader .download-logs {
  display: flex;
  flex-direction: column;
}
.downloader .download-logs .task {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.downloader .download-logs .task  .process{
  width: fit-content;
  display: flex;
  flex-direction: row;
  gap: 0.9rem;
  align-items: center;
}
.downloader .download-logs .task .process-bar {
  width: 38rem;
  height: 5px;
  border-radius: 10px;
  background: var(--ui-light);
  overflow: hidden;
  position: relative;
}
.downloader .download-logs .task .process-bar .process-track{
  height: 100%;
  background: var(--strong);
  position: absolute;
  left: 0;
  top: 0;
}

.account{
  height: fit-content;
  width:95%;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  background: var(--component-diff);
  box-shadow: var(--shadow);
  border-radius: var(--br-2);
  padding: 1.5rem;
  margin-top: 2rem;
  ;
}
.account .avatar{
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
}
.account .user-info{
  margin-left: 1.5rem;
}
.account .user-info .user-name{
  font-size: 1.3rem;
  color: var(--text-o-2);
}
.account .user-info .sign{
  color: var(--text-o-4);
  font-size: 0.9rem;
}
.account .native-o-button{
  width: 5rem;
  background: var(--strong);
  color: #fff;
  font-size: 1rem;
  margin-left: auto;
  margin-right: 0;
}
</style>
