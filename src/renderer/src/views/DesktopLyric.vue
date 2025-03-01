<template>
  <div
    class="layer"
    v-show="monuted"
    :style="positionLock || !userDrag ? `-webkit-app-region: no-drag` : ''"
    :class="userDrag ? 'background' : ''"
  >
    <div class="lyric-offset">{{ lyricOffsetValue }}</div>

    <div class="lyric" :style="`--color:${colorTheme[Object.keys(colorTheme)[colorIndex]].text}`">
      <h1 class="lrc" :key="currentLyric.lrc">{{ currentLyric.lrc }}</h1>
      <p class="tns" :key="currentLyric.tlyric">{{ currentLyric.tlyric }}</p>
    </div>

    <div
      class="control"
      v-if="userControl"
      :style="`--icon:${colorTheme[Object.keys(colorTheme)[colorIndex]].icon}`"
    >
      <button @click="lock()">
        <Icon icon="material-symbols:lock-open-right-rounded" class="icon2" v-if="!positionLock" />
        <Icon icon="material-symbols:lock" class="icon2" v-if="positionLock" />
      </button>
      <button @click="changeColor()"><Icon icon="mdi:palette" class="icon2" /></button>
      <button @click="sender('b5')">
        <Icon icon="mingcute:rewind-backward-5-line" class="icon2" />
      </button>
      <button @click="sender('previous')">
        <Icon icon="tdesign:backward-filled" class="icon2" />
      </button>
      <button @click="sender('play&pause')">
        <Icon icon="material-symbols:play-arrow-rounded" class="icon3" v-if="!audioStatus" /><Icon
          icon="material-symbols:pause"
          class="icon3"
          v-if="audioStatus"
        />
      </button>
      <button @click="sender('next')"><Icon icon="tdesign:forward-filled" class="icon2" /></button>
      <button @click="sender('f5')">
        <Icon icon="mingcute:rewind-forward-5-line" class="icon2" />
      </button>
      <button @click="fixed()"><Icon icon="tabler:pinned" class="icon2" /></button>
      <button @click.stop="close()">
        <Icon icon="material-symbols:close-rounded" class="icon2" />
      </button>
    </div>

    <div class="unlock" v-if="showUnlock">
      <button @click="lock()">
        <Icon icon="material-symbols:lock-open-right-rounded" class="icon2" v-if="positionLock" />
      </button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
const currentLyric = ref('')
const audioStatus = ref(false)
const monuted = ref(false)
const lyricOffsetValue = ref()
const positionLock = ref(false)
const userDrag = ref(false)
const userControl = ref(false)
const showUnlock = ref(false)
const colorTheme = {
  default: {
    text: 'linear-gradient(to right, rgb(255, 255, 255), rgb(255, 255, 255))',
    icon: '#fff'
  },
  green: { text: 'linear-gradient(to right, rgb(0, 255, 0), rgb(249, 255, 252))', icon: '#b5ffb7' },
  mystery: {
    text: 'linear-gradient(to right, rgb(25, 129, 226), rgb(237, 35, 220))',
    icon: '#acc2ff'
  },
  pink: {
    text: 'linear-gradient(to right, rgb(234, 102, 168), rgb(236, 163, 203))',
    icon: '#ffacd1'
  },
  sweet: { text: 'linear-gradient(235deg, #FF7BA8 5%,#FBFF4E 52%,#F7BB97 83%)', icon: '#FBFF4E' },
  ocean: {
    text: 'linear-gradient(360deg, rgba(72,62,245,1) 0%, rgba(23,166,235,1) 68%, rgba(0,212,255,1) 100%)',
    icon: '#00d4ff'
  }
}
let localColorName = localStorage.getItem('@desktoplyric_color') || 'default'
let colorIndex = ref(Object.keys(colorTheme).indexOf(localColorName))
function changeColor() {
  let keys = Object.keys(colorTheme)
  let max = keys.length
  if (colorIndex.value + 1 < max) {
    colorIndex.value += 1
  } else {
    colorIndex.value = 0
  }
  localStorage.setItem('@desktoplyric_color', [Object.keys(colorTheme)[colorIndex.value]])
}
let distory
const channel = new BroadcastChannel('desktoplyric')
onMounted(() => {
  channel.postMessage('mounted')
  monuted.value = true

  channel.onmessage = (e) => {
    handler(JSON.parse(e.data))
  }

  window.addEventListener('mouseover', handleUserDrag, true)
})

function handler(data) {
  if (data.key == 'lyric') {
    currentLyric.value = data.value
  } else if (data.key == 'audioStatus') {
    audioStatus.value = data.value
  } else if (data.key == 'offset') {
    lyricOffsetValue.value = data.value + 's'
    displayOffset()
  }
}

function sender(data) {
  channel.postMessage(data)
}

let timer = null
function displayOffset() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    lyricOffsetValue.value = undefined
  }, 2000)
}

onUnmounted(() => {
  monuted.value = false
  distory && distory()
  window.removeEventListener('mouseover', handleUserDrag, true)
})

function close() {
  window.electron.ipcRenderer.send('useDesktopLyric')
}
function fixed() {
  window.electron.ipcRenderer.send('desktoplyric:winfix')
}
function lock() {
  showUnlock.value = false
  positionLock.value = !positionLock.value
}

let _dragTimer = null
let unlockTimer = null
function handleUserDrag() {
  clearTimeout(_dragTimer)
  _dragTimer = null
  if (!positionLock.value) {
    userDrag.value = true
    userControl.value = true
  } else {
    clearTimeout(unlockTimer)
    if (!userDrag.value) {
      showUnlock.value = true
    }
    unlockTimer = setTimeout(() => {
      showUnlock.value = false
    }, 1000)
  }
  _dragTimer = setTimeout(() => {
    userDrag.value = false
    userControl.value = false
  }, 2000)
}
</script>
<style scoped>
.layer {
  width: 90%;
  height: 100vh;
  position: fixed;
  left: 5%;
  top: 0;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  transition: 0.5s;
  border-radius: 0.4rem;
}
.background {
  background: #00000058;
}
.lyric {
  width: 100%;
  height: 70%;
  overflow: hidden;
  position: absolute;
  top: 5%;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  gap: 0.5rem;
}
@keyframes flash {
  from {
    transform: translateY(30px);
    opacity: 0;
    filter: blur(5px);
  }
}
.lyric .lrc {
  background-image: var(--color, linear-gradient(to right, rgb(255, 255, 255), rgb(255, 255, 255)));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.5rem;
  font-weight: 900;
  animation: flash 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.lyric .tns {
  background-image: var(--color, linear-gradient(to right, rgb(255, 255, 255), rgb(255, 255, 255)));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1rem;
  font-weight: 900;
  animation: flash 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.lyric-offset {
  position: absolute;
  left: 2rem;
  top: 1rem;
  color: #fff;
}
.control {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 9;
  -webkit-app-region: no-drag;
  -webkit-user-select: none;
  position: absolute;
  bottom: 5%;
  justify-content: center;
  gap: 0.5rem;
}
.unlock {
  position: absolute;
  bottom: 5%;
  opacity: 0.7;
}
button {
  width: fit-content;
  height: fit-content;
  aspect-ratio: 1/1;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.1rem;

  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: 0.2s;

  color: #ffffff;
}
button:hover {
  background: #ffffff17;
}
.icon1 {
  width: 1.5em;
  height: 1.5em;
  color: var(--icon, #ffffff);
  opacity: 0.7;
}
.icon2 {
  width: 2em;
  height: 2em;
  color: var(--icon, #ffffff);
}
.icon3 {
  width: 2.5em;
  height: 2.5em;
  color: var(--icon, #ffffff);
}
</style>
