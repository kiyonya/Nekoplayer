<template>
  <div class="music-player">
    <div class="top-control">
      <button @click.stop="store.commit('showPlayer', false)">
        <Icon icon="mingcute:down-line" class="icon2" />
      </button>
    </div>

    <div class="background">
      <img :src="resize(musicInfo.cover, 1500)" alt="" class="image-background" v-if="backgroundMode === 'image'" />
      <div class="dynamic-background" v-show="backgroundMode === 'dynamic'">
        <img :src="resize(musicInfo.cover, 500)" alt="" class="color-background" />
        <canvas ref="dynamic" width="500" height="500" class="dynamic-cvs" style="opacity: 0;"></canvas>
      </div>
      <div class="mcp-background" v-if="backgroundMode === 'color'" ref="colorBackground"></div>
    </div>

    <div class="left">
      <div class="music-info">
        <div class="content">
          <h2 class="name text-limit">{{ musicInfo.name }}</h2>
          <ArtistNameGroup :array="musicInfo.artist" class="artist" @router-leave="store.commit('showPlayer', false)">
          </ArtistNameGroup>
        </div>
        <div class="like">
          <button>
            <Icon icon="weui:like-filled" class="icon2" />
            <Icon icon="weui:like-outlined" class="icon2" v-if="false" />
          </button>
          <button>
            <Icon icon="mi:add" class="icon2" />
          </button>
        </div>
      </div>


      <div class="cover" :class="{ 'cover-scale': coverTransition }" v-if="playerCoverDisplayType === 'cover'">
        <img :src="resize(musicInfo.cover, 800)" alt="" class="main-cover" crossorigin="anonymous"
          v-if="!enableDynamicCover" />
        <img :src="resize(musicInfo.cover, 400)" alt="" class="blur-cover" crossorigin="anonymous" />
        <video :src="dynamicCover.videoPlayUrl" loop muted autoplay class="dynamic-cover"
          v-if="enableDynamicCover"></video>
      </div>



      <div class="dynamic-vinly" v-if="playerCoverDisplayType === 'record' || playerCoverDisplayType === 'wave'">
        <canvas class="dynamic-wave-cvs" ref="dynamicWave"></canvas>
        <div class="cd" :key="musicInfo.id" :class="{ 'cd-in': playerCoverDisplayType === 'record' }">
          <div class="vinyl spin"
            :style="{ animationPlayState: audioState.state === 'pause' ? 'paused' : 'running', width: playerCoverDisplayType === 'record' ? '85%' : '70%' }">
            <img :src="musicInfo?.cover" alt="">
          </div>
        </div>
      </div>








      <div class="functions">
        <button>
          <Icon icon="hugeicons:share-04" class="icon1" />
        </button>
        <button @click="store.commit('showEqualizer', true)">
          <Icon icon="fluent:device-eq-20-filled" class="icon1" />
        </button>
        <button>
          <Icon icon="tdesign:ellipsis" class="icon1" />
        </button>
        <button class="volume-button" @click="player.toggleMute()">
          <Icon icon="material-symbols:volume-up-rounded" class="icon1" />
        </button>
        <VueSlider :tooltip="'none'" class="volume-slider" width="30%" height="4px"
          :process-style="{ background: '#fff' }" :rail-style="{ background: '#ffffff60' }"
          :dot-style="{ display: 'none' }" :max="1" :min="0" :interval="0.01" v-model="volume">

        </VueSlider>
      </div>



      <div class="audio-progress">
        <div class="progress">
          <VueSlider :interval="0.01" :height="4" :min="0" :max="1" v-model="progress" :tooltip="'none'" class="slider"
            :process-style="{ background: '#fff' }" :rail-style="{ background: '#ffffff60' }" :useKeyboard="true"
            :dot-style="{ display: 'none' }"></VueSlider>
        </div>

        <div class="audio-time">
          <span class="time">{{ s2mmss(audioState.ct) }}</span>
          <span class="time">{{ s2mmss(audioState.dt) }}</span>
        </div>
      </div>

      <div class="control">
        <div class="audio-control">
          <button @click.stop="player.switchPlaymode()">
            <Icon icon="tabler:repeat" class="icon1" v-show="playmode == 'list'" />
            <Icon icon="tabler:repeat-once" class="icon1" v-show="playmode == 'loop'" />
            <Icon icon="fe:random" class="icon1" v-show="playmode == 'random'" />
          </button>

          <button @click.stop="player.previous()">
            <Icon icon="fluent:previous-20-filled" class="icon2" />
          </button>

          <button @click.stop="player.playOrPause()">
            <Icon icon="fluent:play-12-filled" class="icon3" v-if="audioState.state === 'pause'" />
            <Icon icon="fluent:pause-12-filled" class="icon3" v-if="audioState.state !== 'pause'" />
          </button>

          <button @click.stop="player.next()">
            <Icon icon="fluent:next-20-filled" class="icon2" />
          </button>

          <!--            <Icon icon="mdi:volume-medium" class="icon1" />
            <Icon icon="mdi:volume-source" class="icon1"  />-->
          <button @click.stop="togglePlaylisyBar()">
            <Icon icon="heroicons:list-bullet-16-solid" class="icon1" />
          </button>
        </div>
      </div>

      <!-- <canvas class="waver" ref="waver"></canvas> -->
    </div>

    <div class="right">
      <div class="listentogether-info" v-if="isListentogether && listentogetherRoomDetial">
        <span class="tip">当前正在一起听</span>
        <div class="room-user">
          <div class="user" v-for="user in listentogetherRoomDetial.roomUsers">
            <img :src="user.avatarUrl" alt="" :title="user.nickname">
          </div>
          <div class="wait-friend"
            v-if="listentogetherRoomDetial?.roomUsers?.length <= 1 && listentogetherRoomDetial?.roomType === 'FRIEND'"
            @click="showListentogetherInvite = true">
            <Icon icon="material-symbols:add" class="icon1" />
          </div>
        </div>
      </div>
      <div class="lyric" ref="lyricContainer" :style="musicPlayerLyricGrow ? '--glow: #ffffff77;' : ''"
        v-show="musicInfo?.type !== 'voice'">
        <span style="margin-top: 50%;"></span>
        <div class="lyric-cell" v-for="lrc in lyric" :class="{ blur: musicPlayerLyricBlur }"
          @click="jumpLyricTime(lrc)">
          <div class="normal" v-if="!lrc?.gap && !lrc.subLyric">
            <p v-if="lrc?.text" class="lrc">{{ lrc?.text }}</p>
            <p v-if="lrc.tlyric" class="tns">{{ lrc?.tlyric }}</p>
            <p v-if="lrc.romalrc" class="roma">{{ lrc?.romalrc }}</p>
          </div>
          <div class="sub" v-if="lrc.subLyric">
            <p v-if="lrc?.text" class="lrc">{{ lrc?.text }}</p>
            <p v-if="lrc.tlyric" class="tns">{{ lrc?.tlyric }}</p>
            <p v-if="lrc.romalrc" class="roma">{{ lrc?.romalrc }}</p>
          </div>
          <div v-if="lrc.gap" class="gap">
            <span class="ball"></span>
            <span class="ball"></span>
            <span class="ball"></span>
          </div>
        </div>
      </div>

      <div class="program-detail" v-if="musicInfo?.type === 'voice'">
        <div class="radio">
          <img :src="programDetail?.radio?.picUrl + '?param=200y200'" alt="">
          <div class="radio-detail">
            <h2 class="name">{{ programDetail?.radio?.name }}</h2>
            <div class="tags">
              <span class="tag">{{ programDetail?.radio?.category }}</span>
              <span class="tag">{{ programDetail?.radio?.secondCategory }}</span>
            </div>
          </div>
        </div>

        <div class="desc">
          <div class="ti">声音简介</div>
          <p>{{ programDetail?.description }}</p>
        </div>

      </div>
    </div>

    <!--交融滤镜-->
    <svg style="display: none">
      <defs>
        <filter id="mix-sharp">
          <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="
            1.5 0   0   0   0
            0   1.5 0   0   0
            0   0   1.5 0   0
            0   0   0   25  -12"></feColorMatrix>
        </filter>
      </defs>
    </svg>

    <!--右键菜单-->
    <ContextMenu :menu="[
      { label: audioState.state !== 'play' ? '播放' : '暂停', act: 'play', icon: audioState.state !== 'play' ? 'material-symbols-light:pause' : 'ion:play' },
      { label: '上一首', act: 'previous', icon: 'fluent:previous-20-filled' },
      { label: '下一首', act: 'next', icon: 'fluent:next-20-filled' },
      { label: '均衡器', act: 'equalizer', icon: 'material-symbols:equalizer-rounded' },
      'hr',
      { label: '喜欢', act: 'like', icon: 'ri:hearts-fill' },
      { label: '收藏', act: 'collect', icon: 'fluent:collections-20-filled' },
      { label: '分享', act: 'share', icon: 'majesticons:share' },
      { label: '详情', act: 'detail', icon: 'majesticons:share' },
      { label: '浏览器打开', act: 'browser', icon: 'mdi:web' },
    ]" @select="(e) => handleContextMenu(e)">
    </ContextMenu>

    <ModalWindow v-if="showModalWindow" @close="showModalWindow = false">
      <h1>歌曲信息</h1>
      <span>名称：{{ musicInfo.name }}</span>
      <RouterLink v-if="!musicInfo.local || musicInfo.ncmmatch"
        :to="{ name: 'Album', params: { id: musicInfo.album.id } }">专辑：{{
          musicInfo.album.name + (musicInfo.album.tns ? ` (${musicInfo.album.tns[0]})` : '')
        }}</RouterLink>
      <span v-if="!musicInfo.local">id：{{ musicInfo.id }}</span>
      <span v-if="musicInfo.local && !musicInfo.ncmmatch">专辑：{{ musicInfo.album || '未知' }}</span>
      <span>歌手：<ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup></span>
      <span>时长：{{ s2mmss(audioState.duration) }}</span>
      <span v-if="musicInfo.local">地址：{{ musicInfo.id }}</span>
      <span v-if="musicInfo.local">类型：本地<span v-if="musicInfo.ncmmatch">(已匹配网易云)</span></span>
      <span v-if="musicInfo.local">比特率：{{ musicInfo.format.bitrate / 1000 }}kbps</span>
      <span v-if="musicInfo.local">采样率：{{ musicInfo.format.sampleRate }}Hz</span>
      <span v-if="musicInfo.local">编码：{{ musicInfo.format.codec }}</span>
      <span v-if="musicInfo.local">容器：{{ musicInfo.format.container }}</span>
      <span v-if="musicInfo.local">码率控制：{{ musicInfo.format.codecProfile }}</span>
    </ModalWindow>


    <ModalWindow v-if="showListentogetherInvite" @close="showListentogetherInvite = false">
      <h1>邀请好友一起听</h1>
      <div class="other-method">
        <button class="act" @click="copyInviteLink">
          <Icon icon="bx:link" class="icon2" />

        </button>
      </div>
    </ModalWindow>
  </div>
</template>
<script setup>
import { store } from '@/store'
import { computed, onMounted, watch } from 'vue'
import { resize } from '@/utils/imageProcess'
import ArtistNameGroup from '../ArtistNameGroup.vue'
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import VueSlider from 'vue-slider-component'
import { Icon } from '@iconify/vue'
import { s2mmss } from '@/utils/libs'
import { ref } from 'vue'
import ModalWindow from '../windows/ModalWindow.vue'
import { player } from '@/main'
import { computedHighlight } from '@/api/lyric'
import { getColor } from '@/components/musicplayer/color'
import { AudioWaveDrawer, DynamicBackground } from './main'
import { AudioWaveEffect } from "./audio_wave"
import { LyricScroller } from './lyric_scroller'
import { onUnmounted } from 'vue'
import { nextTick } from 'vue'
import { getProgramDetail } from '@/api/program'
const showModalWindow = ref(false)
const showListentogetherInvite = ref(false)
const rightDisplayType = ref('lyric')
const playerCoverDisplayType = computed(() => {
  return store.state.config.playerCoverDisplayType
})
let programDetail = ref({})
const progress = computed({
  get: () => { return store.state.audioState.ct / store.state.audioState.dt || 0 },
  set: (val) => {
    const time = val * store.state.audioState.dt
    player.seek(time)
  }
})
const showPlayer = computed(()=>{
  return store.state.showPlayer
})
const volume = computed({
  get: () => { return store.state.audioState.volume },
  set: (val) => {
    player.setVolume(val)
  }
})
const musicInfo = computed({
  get: () => store.state.musicInfo
})
const playmode = computed({
  get: () => store.state.playerState.mode
})
const audioState = computed({
  get: () => store.state.audioState
})
const showPlaylistBar = computed(() => {
  return store.state.showPlaylistBar
})
const backgroundMode = computed(() => {
  return store.state.config.musicPlayerBackgroundMode
})
const musicPlayerLyricBlur = computed(() => {
  return store.state.config.musicPlayerLyricBlur
})
const musicPlayerLyricGrow = computed(() => {
  return store.state.config.musicPlayerLyricGlow
})
const dynamicCover = computed(() => {
  return store.state.nowPlayingDynamicCover
})
const enableDynamicCover = computed(() => {
  if (store.state.config.enableDynamicCover && dynamicCover.value?.videoPlayUrl) {
    return true
  }
  else {
    return false
  }
})
const lyric = computed(() => {
  return store.state.lyric
})
const listentogetherRoomDetial = computed(() => {
  return store.state.listentogetherRoomDetial
})
const isListentogether = computed(() => {
  return store.state.inListentogetherRoom
})
const backgroundImageResolution = computed(() => {
  return store.state.config.musicPlayerBackgroundImageResolution
})
let lyricContainer = ref(null)
let dynamic = ref(null)
let dynamicWave = ref(null)
let coverTransition = ref(false)
let colorBackground = ref(null)
let mainCover = document.createElement('img')
mainCover.crossOrigin = "Anonymous"
// 动画帧ID存储
let animationFrameIds = {
  waveDraw: null,
  mainProcess: null
}
const cleanupFunctions = []
let unwatch = null
let lyricScroller, dynamicBackground,dynamicWaveDrawer = null
onMounted(async () => {
  await nextTick()
  try {
    const mainProcess = () => {
      lyricScroller = new LyricScroller(lyricContainer.value, {
        highlightClassName: 'highlight'
      })
      if (backgroundMode.value === "dynamic") {
        dynamicBackground = new DynamicBackground(dynamic.value)

      }
      if (playerCoverDisplayType.value === 'wave') {
        dynamicWaveDrawer = new AudioWaveEffect(dynamicWave.value)
      }
      const handleCoverLoad = async () => {

        getColor(mainCover).then(color => {
          dynamicWaveDrawer?.setFillColor(color.matchColor)
          if (dynamicWave?.value && playerCoverDisplayType.value === 'wave') {
            dynamicWave?.value?.setAttribute("style", `--main:rgba(${color.mainColor},1)`)
          }
          if (backgroundMode.value === 'color' && colorBackground.value) {
            colorBackground.value.setAttribute("style", `--main:rgb(${color.mainColor})`)
          }
          if (backgroundMode.value === "dynamic" && dynamicBackground) {
            dynamicBackground.setColors(color.mainColor)
          }
        })
      }
      const scrollLyric = (va = true) => {
        const time = player.audioManager.currentTime
        const { index, highlightSentence } = computedHighlight(lyric.value, time)
        if (highlightSentence.gap) {
          lyricScroller.countGap({
            index: index + 1,
            time,
            delay: highlightSentence?.delay,
            next: highlightSentence?.next
          })
        }
        lyricScroller.scroll(index + 1 ,va)
      }
      const dynamicWaveDraw = () => {
        if (playerCoverDisplayType.value !== 'wave') return
        animationFrameIds.waveDraw = requestAnimationFrame(() => {
          dynamicWaveDraw()
          if (audioState.value.state === "pause" || !showPlayer.value) return
          dynamicWaveDrawer.draw(player.audioManager.frequencyAnalyser.getByteFrequencyData())
        })
      }
      mainCover.addEventListener('load', handleCoverLoad)
      player.audioManager.on('timeupdate', scrollLyric)
      cleanupFunctions.push(
        () => mainCover.removeEventListener('load', handleCoverLoad),
        () => player.audioManager.off('timeupdate', scrollLyric),
        () => {
          if (animationFrameIds.waveDraw) {
            cancelAnimationFrame(animationFrameIds.waveDraw)
          }
        },
        () => lyricScroller?.destroy(),
        () => dynamicBackground?.unmount(),
        () => {
          if (animationFrameIds.mainProcess) {
            cancelAnimationFrame(animationFrameIds.mainProcess)
          }
        }
      )
      // scrollLyric()
      setTimeout(() => {
        dynamicBackground?.start()
      }, 200);
      dynamicWaveDraw()
      unwatch = watch(musicInfo, () => {
        mainCover.src = musicInfo.value.cover?.startsWith("https") ? musicInfo.value.cover + "?param=50y50&type=webp" : musicInfo.value.cover
        lyricScroller.reset()
        coverTransition.value = true
        setTimeout(() => {
          coverTransition.value = false
        }, 200)
        if (musicInfo.value?.type === "voice") {
          loadVoiceDetail(musicInfo.value.id)
        } else {
          programDetail.value = {}
        }
      }, { immediate: true })

      let showplayerWatcher = watch(showPlayer,(n,o)=>{
        if(showPlayer.value){
          dynamicBackground.candraw = true
          scrollLyric(false)
        }
        else{
          dynamicBackground.candraw = false
        }
      })
    }
    nextTick(() => {
      mainProcess()
    })

  } catch (error) {
    throw new Error("音乐播放器初始化失败: " + error.message)
  }
})

onUnmounted(() => {
  lyricScroller = null
  dynamicBackground = null
  dynamicWaveDrawer = null
  unwatch && unwatch()
  cleanupFunctions.forEach(cleanup => cleanup?.())
  cleanupFunctions.length = 0
  lyricContainer = null
  dynamic = null
  dynamicWave = null
  coverTransition = null
  colorBackground = null
  mainCover?.remove()
  window.webFrame.clearCache()
})
function loadVoiceDetail(programId) {
  getProgramDetail(programId).then(data => {
    programDetail.value = data?.program
  })
}


function handleContextMenu(e) {
  const act = e.act
  const actions = {
    play: () => {
      player.playOrPause()
    },
    previous: () => {
      player.previous()
    },
    next: () => {
      player.next()
    },
    equalizer: () => {
      store.commit("showEqualizer", true)
    },
    browser: () => {
      const url = `https://music.163.com/#/song?id=${musicInfo.value?.id}`
      window.electron.ipcRenderer.send('app:openWebView', url)
    },
  }
  if (actions[act]) {
    actions[act]()
  }
}
function togglePlaylisyBar() {
  if (showPlaylistBar.value) {
    store.commit('showPlaylistBar', false)
  } else {
    store.commit('showPlaylistBar', true)
  }
}
function useDesktopLyric() {
  window.electron.ipcRenderer.send('useDesktopLyric')
}
function copyInviteLink() {
  const roomId = listentogetherRoomDetial.value.roomId
  const creatorId = listentogetherRoomDetial.value.creatorId
  const songId = musicInfo.value.id

  const link = `邀请你一起听《${musicInfo.value.name}》,加入链接：https://st.music.163.com/listen-together/share/?songId=${songId}&roomId=${roomId}&inviterId=${creatorId}`
  window.navigator.clipboard.writeText(link)
}

function jumpLyricTime(lyric) {
  player.seek(lyric.timestamp)
}
</script>
<style scoped>
@media screen and (min-width: 1600px) {
  .left {
    width: 30rem !important;
    gap: 1.5rem !important;
  }

  .music-player {
    --edge-gap: 13% !important;
  }

}

.music-player {
  --edge-gap: 10%;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9900;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.top-control {
  width: fit-content;
  height: fit-content;
  position: absolute;
  right: 3rem;
  top: 3.5rem;
  z-index: 3;

  .icon2 {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@keyframes background-fade {
  from {
    opacity: 0;
  }
}

.background {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  overflow: hidden;
  background: #1d1d1d;
}

.background .image-background {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  filter: blur(20px) brightness(0.4) saturate(1.2);
  transform: scale(1.1);
}



.left {
  width: 24rem;
  height: fit-content;
  position: relative;
  margin-left: var(--edge-gap);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* animation:  left-enter .6s ease; */
  gap: 15px;
  transition: .3s ease-in-out;
}

.left .music-info {
  display: flex;
  flex-direction: row;
}

.left .music-info .content {
  display: flex;
  flex-direction: column;
  color: #fff;
}

.left .music-info .content .name {
  font-size: 1.8rem;
  max-width: 20rem;
}

.left .music-info .content .artist {
  font-size: 0.9rem;
  opacity: 0.7;
}

.left .music-info .like {
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  height: fit-content;
  width: fit-content;
  margin: auto 0.5rem auto auto;
}

.left .music-info .like .icon2 {
  width: 1.5rem;
  height: 1.5rem;
}

.left .cover {
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: .2s;
}

.left .cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--br-3);
  position: absolute;
  z-index: 1;
  box-shadow: 2px 2px 15px #00000018;
  transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.left .cover .blur-cover {
  z-index: 0;
  width: 100%;
  filter: brightness(0.8) blur(20px) brightness(1.2);
  transform: scale(1.1);
  opacity: 0.3;
}

.left .cover:hover {

  .main-cover,
  .dynamic-cover {
    transform: scale(1.02);
  }
}

.left .cover .dynamic-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 0.7rem;
  transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.left .control {
  display: flex;
  height: fit-content;
  flex-direction: column;
}

.left .control .audio-control {
  width: 90%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 1.9rem;
  align-items: center;
  margin-left: auto;
  margin-right: auto;

}

.left .audio-progress {
  display: flex;
  flex-direction: column;
  height: fit-content;
  color: #fff;
  position: relative;
  z-index: 2;
  gap: 0.5rem;
}

.left .audio-progress .time {
  opacity: 0.7;
  font-size: 0.9rem;
}

.left .audio-progress .audio-time {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.left .progress {
  width: 100%;
  height: 6px;
  position: relative;
  margin-bottom: 0.7rem;
}

.left .functions {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1rem;
}

.left .functions button .icon1 {
  opacity: 1;
}

.left .functions .volume-button {
  margin-left: auto;
  margin-right: 0;
}

.left .functions .volume-slider {
  width: 30%;
  height: 4px;
}

@keyframes lyric-enter {
  from {
    opacity: 0;
    filter: blur(5px);
  }
}

.right {
  flex: 1;
  height: 90%;
  margin: auto var(--edge-gap) auto var(--edge-gap);
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

@keyframes listentogether-enter {
  from {
    transform: translateY(-15px);
    opacity: 0;
  }
}

.right .listentogether-info {
  height: 4rem;
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 2rem;
  animation: listentogether-enter 0.3s ease-in-out;
}

.right .listentogether-info .tip {
  color: var(--text-o-2);
  color: white;
  font-size: 0.9rem;
}

.right .listentogether-info .room-user {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.right .listentogether-info .room-user .user,
.wait-friend {
  width: 3rem;
  height: 3rem;
  aspect-ratio: 1/1;
  position: relative;
}

.right .listentogether-info .room-user .user img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.right .listentogether-info .room-user .wait-friend {
  background-color: #242424ca;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right .lyric {
  width: auto;
  height: 94%;
  color: #fff;
  display: flex;
  flex-direction: column;
  mask: linear-gradient(transparent 0%, #000 20%, #000 70%, transparent);
  overflow: visible;

}

.right .lyric .lyric-cell {
  margin-left: 5px;
  width: 80%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  transition: 0.5s ease-in-out;

  .normal {
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .lrc {
    font-size: 28px;
    transition: 0.15s cubic-bezier(.54, -0.2, 0, .9);
    transform-origin: left;
    position: relative;
    display: block;
    opacity: 0.3;
    font-weight: 600;
  }

  .tns {
    opacity: 0.5;
    font-size: 18px;

    transition: 0.2s ease-in-out;
  }

  .roma {
    opacity: 0.5;
    font-size: 15px;
    font-weight: 600;
    transition: 0.2s ease-in-out;
  }

  .gap {
    width: fit-content;
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 1.2rem 0;
    opacity: 0;
    transform: scale(0.5);
    transform-origin: center center;
    transition: .2s cubic-bezier(.51, 0, 0, .98);
  }

  .ball {
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transition: .3s;
    opacity: 0;
  }

  .sub {
    display: flex;
    flex-direction: column;
    gap: 5px;
    opacity: 0.5;
    padding: 1.1rem 0;
    transition: .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    transform: translateY(-20px);
    text-align: right;
  }

  .sub .lrc {
    transition: inherit;
    transform-origin: left;
    position: relative;
    display: block;
    opacity: 0.3;
    font-weight: 600;
    font-size: 25px;

  }
}

.right .lyric .lyric-cell:hover * {
  opacity: 1 !important;
}

.right .lyric .lyric-cell:hover {
  filter: none !important;
  /* padding-left: 0.9rem;
  border-left: 4px solid rgba(255, 255, 255, 0.488);
  box-sizing: border-box; */
  transition: .3s;
}

.blur {
  filter: blur(2px);
}



.lyric-cell:last-child {
  margin-bottom: 50%;
}

.highlight {
  filter: none !important;

  .lrc {
    overflow: visible;
    font-size: 36px !important;
    opacity: 1 !important;
  }

  .tns {
    opacity: 0.6 !important;
  }

  .roma {
    opacity: 0.6 !important;
  }

  .passed {
    opacity: 1 !important;
    transition: .2s;
    transform: translateY(-50px);
    background: -webkit-linear-gradient(90deg, #ffffff, #ffffff) no-repeat rgb(255, 255, 255);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .passing {
    opacity: 1 !important;
    transition: .5s;
    background: -webkit-linear-gradient(90deg, #ffffff, #ffffff) no-repeat rgba(255, 255, 255, 0.5);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transform: translateY(-10px);
  }

  .normal-word {
    opacity: 1 !important;
  }

  .gap {
    opacity: 1 !important;
    transform: scale(1) !important;
  }

  .ball:nth-child(1) {
    opacity: var(--count-a) !important;
    transform: translateY(calc(-8px * calc(1 - var(--count-a)))) !important;
  }

  .ball:nth-child(2) {
    opacity: var(--count-b) !important;
    transform: translateY(calc(-8px * calc(1 - var(--count-b)))) !important;
  }

  .ball:nth-child(3) {
    opacity: var(--count-c) !important;
    transform: translateY(calc(-8px * calc(1 - var(--count-c)))) !important;
  }

  .sub {
    opacity: 1 !important;
    transform: translateY(0px) !important;
  }
}

.right .lyric::-webkit-scrollbar {
  display: none;
}

.right .lyric-setting {
  width: 100%;
  height: 4%;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

  color: #fff;
}

.right .lyric-setting .lyric-mode {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.7;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.3rem;
  border: 1px solid #ffffffa6;
}

@keyframes dynamic-enter {
  from {

    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.dynamic-background {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5;
  transform: scale(1.1);
  animation: dynamic-enter 1s;
}

.dynamic-background .color-background {
  width: 100%;
  height: inherit;
  object-fit: cover;
  position: absolute;
  opacity: 0.5;
  filter: blur(80px) saturate(1.2) contrast(1.1) brightness(1.1);
  z-index: -1;
}

.mcp-background {
  width: 100%;
  height: inherit;
  object-fit: cover;
  position: absolute;
  opacity: 0.5;
  z-index: -1;
  background: var(--main, transparent);
}

.dynamic-cvs {
  width: 100%;
  height: 100%;
  filter: saturate(2) brightness(0.6) contrast(1.2) url(#mix) blur(80px);
  position: absolute;
  transform: scale(1.5);
  z-index: 2;
  opacity: 1;
  /**blur(500px) saturate(1.2) */
  transition: 1s;
}

button {
  width: fit-content;
  height: fit-content;
  aspect-ratio: 1/1;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.2rem;

  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: 0.2s;

  color: #ffffff;
}

button:hover {
  background: #ffffff1e;
}

.icon1 {
  width: 1.5em;
  height: 1.5em;
  color: #fff;
  opacity: 0.7;
}

.icon2 {
  width: 2em;
  height: 2em;
  color: #fff;
}

.icon3 {
  width: 4em;
  height: 4em;
  color: #fff;
}

.change-disc {
  transform: scale(0.9);
}

.slider .vue-slider-mark-step {
  background-color: #fff !important;
}

.waver {
  width: 100%;
  height: 50px;
}

.other-method .act {
  width: fit-content;
  height: fit-content;
  padding: 0.4rem;
}

.cover-scale {
  transform: scale(1.1);
}


@keyframes cd-in {
  from {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.cd-in {
  animation: cd-in 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.spin {
  animation: spin 25s linear infinite;
}

.dynamic-vinly {
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.dynamic-wave-cvs {
  width: 100%;
  aspect-ratio: 1/1;
  position: absolute;
  filter: brightness(1.1) saturate(1.5) contrast(1.5) drop-shadow(0 0 20px rgba(255, 255, 255, 0.229))
    /* 
        drop-shadow(0 0 20px color-mix(in srgb,var(--main) 50%,white)) */
}

.cd {
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  opacity: 1;



  .vinyl {
    width: 70%;
    aspect-ratio: 1/1;
    background: radial-gradient(circle at center,
        transparent 0%,
        transparent 65%,
        rgba(255, 255, 255, 0.05) 65.5%,
        transparent 66%,
        transparent 100%),
      repeating-radial-gradient(circle at center,
        #111 0%,
        #111 1px,
        #222 1px,
        #222 2px);
    background-size: 100% 100%, 100% 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);



    img {
      width: 60%;
      aspect-ratio: 1/1;
      border-radius: 50%;
      outline: 1px solid rgba(255, 255, 255, 0.5);
      object-fit: cover;
    }
  }

}

.toolkit {
  height: 3rem;
  width: 3rem;
  position: absolute;
  right: 2rem;
  background: transparent;
  backdrop-filter: blur(5px);
  border-radius: 3rem;
  transition: .5s;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .center {
    font-size: 2rem;
  }
}

.showtookit {
  height: 50% !important;
  border-radius: 3rem;

  background-color: #ffffff44;
}


.program-detail {
  margin-top: auto;
  margin-bottom: auto;
  height: 80%;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
  gap: 1rem;
  overflow-y: auto;

  .radio {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.151);
    border-radius: var(--br-2);
    gap: 1rem;
    align-items: center;

    img {
      width: 5rem;
      height: 5rem;
      aspect-ratio: 1/1;
      border-radius: var(--br-2);
    }

    .radio-detail {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      height: fit-content;
      justify-content: center;
    }

    h2 {
      font-size: 1.2rem;
    }

    .tags {
      display: flex;
      flex-direction: row;
      gap: 1rem;

      .tag {
        font-size: 0.9rem;
        box-sizing: border-box;
        padding: 0.2rem 0.6rem;
        background: rgba(255, 255, 255, 0.15);
        border-radius: var(--br-1);
      }

      .tag:hover {
        background: rgba(255, 255, 255, 0.25)
      }
    }
  }

  .desc {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.151);
    border-radius: var(--br-2);
    gap: 0.5rem;

    .ti {
      font-size: 1.5rem;
      font-weight: bold;
    }

    p {
      color: var(--text-o-2);
    }
  }
}
</style>
