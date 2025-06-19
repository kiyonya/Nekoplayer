<template>
  <div class="wallpaper">
    <div class="background" :style="{ background: `rgb(${colorGroup.mainColor})` }" v-show="config.wallpaperBackgroundMode !== 'transparent'">
      <img
        :src="musicInfo.cover"
        alt=""
        class="bg-img"
        crossorigin="anonymous"
        v-show="config.wallpaperBackgroundMode === 'image'"
        @load="setColor"
      />
      <canvas
        ref="canvas"
        width="500"
        height="500"
        v-show="config.wallpaperBackgroundMode === 'fog'"
      ></canvas>
    </div>

    <div class="musicinfo">
      <img :src="resize(musicInfo.cover, 500)" alt="" class="cover" />
      <div class="ctx">
        <h1 class="title text-limit">{{ musicInfo.name }}</h1>
        <span class="text-limit subtitle"
          >{{ musicInfo.artist[0]?.name }} · {{ musicInfo.album?.name }}</span
        >
        <svg viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" fill="#FFF" class="audio-logo">
          <g transform="matrix(1 0 0 -1 0 80)">
            <rect width="10" height="20" rx="3">
              <animate
                attributeName="height"
                begin="0s"
                dur="4.3s"
                values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="15" width="10" height="80" rx="3">
              <animate
                attributeName="height"
                begin="0s"
                dur="2s"
                values="80;55;33;5;75;23;73;33;12;14;60;80"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="30" width="10" height="50" rx="3">
              <animate
                attributeName="height"
                begin="0s"
                dur="1.4s"
                values="50;34;78;23;56;23;34;76;80;54;21;50"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="45" width="10" height="30" rx="3">
              <animate
                attributeName="height"
                begin="0s"
                dur="2s"
                values="30;45;13;80;56;72;45;76;34;23;67;30"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        </svg>
      </div>
    </div>

    <div class="clock">
      <h2 class="time HH:MM" v-if="config.showTime === 'HH:MM'">{{ clock.hour }}:{{ clock.min }}</h2>
      <h2 class="time HH:MM:SS" v-if="config.showTime === 'HH:MM:SS'">{{ clock.hour }}:{{ clock.min }}:{{ clock.sec }}</h2>
      <span class="date YY.MM.DD" v-if="config.showDate === 'YY.MM.DD'">{{ clock.year }}.{{ clock.month }}.{{ clock.date }}</span>
      <span class="date Day|MM.DD" v-if="config.showDate === 'Day|MM.DD'">{{ clock.day }} | {{ clock.month }}.{{ clock.date }}</span>
      <span class="date MM.DD" v-if="config.showDate === 'MM.DD'">{{ clock.month }}.{{ clock.date }}</span>
    </div>

    <svg style="display: none">
      <defs>
        <filter id="mix">
          <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="blur"></feGaussianBlur>
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -10"
          ></feColorMatrix>
        </filter>
      </defs>
    </svg>
  </div>
</template>
<script setup>
import { onUnmounted } from 'vue'
import { ref, watch } from 'vue'
import { onMounted } from 'vue'
import { getColor } from '@/components/musicplayer/color'
import { onBeforeMount } from 'vue'
import { resize } from '@/utils/imageProcess'
import { initBackground, destoryBackground } from './wallpaper_background_renderer'
import { webChannel } from '@/lib/webChannel'
import { computed } from 'vue'
import { store } from '@/store'
const musicInfo = ref({})
const canvas = ref(null)
const colorGroup = ref([])
const config = ref({})
const channel = new webChannel('wallpaper')
const time = ref('')
const localDate = ref('')
const clock = ref({
  year: '',
  month: '',
  date: '',
  day: '',
  hour: '',
  min: '',
  sec: ''
})
onBeforeMount(() => {
  config.value = store.state.config.wallpaper
  channel.listen()
  channel.send('wallpaper:queryMusicInfo')
  channel.on('audio:musicInfo', (data) => {
    musicInfo.value = data
  })
  channel.on('wallpaper:configchange', (data) => {
    config.value = data
  })
})
onMounted(() => {
  initBackground(canvas.value, colorGroup, config)
  initClock()
})
onUnmounted(() => {
  destoryBackground()
  channel.unlisten()
})
async function setColor(e) {
  colorGroup.value = await getColor(e.target)
  console.log(colorGroup.value)
}

function initClock() {
  const map = {
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
    7: 'Sun'
  }
  function _computed() {
    const date = new Date()
    let y = date.getFullYear().toString()
    let h = date.getHours().toString().padStart(2, '0')
    let m = date.getMinutes().toString().padStart(2, '0')
    let d = date.getDate().toString().padStart(2, '0')
    let month = (date.getMonth() + 1).toString().padStart(2, '0')
    let w = map[date.getDay()] + '.'
    let s = date.getSeconds().toString().padStart(2, '0')
    clock.value = {
      year: y,
      month: month,
      date: d,
      day: w,
      hour: h,
      min: m,
      sec: s
    }
  }
  setInterval(() => {
    _computed()
  }, 1000)
  _computed()
}
</script>
<style scoped>
.wallpaper {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.background {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  background: #000;
  transform: scale(1.4);
}
.background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  z-index: 1;
  filter: blur(2px) saturate(1) contrast(1.1) brightness(1.1);
  opacity: 0.5;
  mask: linear-gradient(45deg, transparent 38%, #fff);
}
.background canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  filter: url(#mix) blur(120px) saturate(3) brightness(0.8);
  background: #000;
}
.musicinfo {
  position: absolute;
  right: 5rem;
  top: 5rem;
  z-index: 3;
  display: flex;
  flex-direction: row-reverse;
  gap: 1.2rem;
}
.musicinfo .cover {
  width: 12rem;
  height: 12rem;
  border-radius: 8px;
}
.musicinfo .ctx {
  height: fit-content;
  display: flex;
  flex-direction: column;
  color: #fff;
  align-items: end;
  height: 100%;
  font-family: 'misans';
}
.musicinfo .ctx .title {
  max-width: 30rem;
}
.musicinfo .ctx .subtitle {
  max-width: 30rem;
}
.musicinfo .audio-vis {
  position: absolute;
  z-index: 10;
}
.audio-logo {
  width: 2rem;
  height: 1.5rem;
  margin-top: 0.4rem;
}
.clock {
  width: fit-content;
  height: fit-content;
  position: absolute;
  color: #fff;
  right: 5rem;
  top: calc(5rem + 12rem + 0.5rem);
  text-align: center;
}
.clock .time {
  font-size: 2.5rem;
  letter-spacing: 1px;
}
.clock .date {
  font-size: 1.1rem;
  letter-spacing: 2px;
  font-weight: 600;
  opacity: 0.8;
  margin-top: -50px;
}
</style>
