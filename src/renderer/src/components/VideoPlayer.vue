<template>
  <div class="video-player" ref="player">
    <button class="playstate" @click.stop="togglePlay()" v-if="videoInfo.playstate !== 'play'">
      <Icon
        icon="material-symbols:play-arrow-rounded"
        class="icon"
        v-if="videoInfo.playstate == 'pause' && !load"
      />
      <Icon icon="line-md:loading-twotone-loop" class="icon" v-if="load" />
    </button>
    <div class="video-ctn">
      <img :src="props.cover" alt="" v-if="beforePlay" class="cover" />
      <video
        class="vid"
        loop
        ref="video"
        :src="videoData?.url"
        autoplay
        @click.stop="togglePlay()"
      ></video>
    </div>
    <div class="video-control">
      <VueSlider
        style="width: 98%"
        :interval="0.01"
        :min="0"
        :max="1"
        v-model="progressValue"
        :lazy="true"
        @change="(value, index) => handleProgressChange(value)"
        :tooltip="'none'"
        class="slider"
        :process-style="{ background: '#fff' }"
        :rail-style="{ background: '#ffffff60' }"
        :dot-style="{ display: 'none' }"
      ></VueSlider>
      <div class="controls">
        <button class="button" @click.stop="togglePlay()">
          <Icon
            icon="line-md:play-filled"
            class="icon"
            v-if="videoInfo.playstate == 'pause' && !load"
          />
          <Icon
            icon="material-symbols:pause"
            class="icon"
            v-if="videoInfo.playstate == 'play' && !load"
          />
          <Icon icon="line-md:loading-twotone-loop" class="icon" v-if="load" />
        </button>

        <span class="time"
          >{{ s2mmss(videoInfo.currentTime) }}&nbsp;/&nbsp;{{ s2mmss(videoInfo.duration) }}</span
        >
        <button class="button" @click="toggleMute()">
          <Icon icon="icon-park-solid:volume-mute" class="icon-small" v-if="volumeValue == 0" />
          <Icon
            icon="icon-park-solid:volume-small"
            class="icon-small"
            v-if="volumeValue > 0 && volumeValue < 0.5"
          />
          <Icon icon="icon-park-solid:volume-notice" class="icon-small" v-if="volumeValue >= 0.5" />
        </button>
        <VueSlider
          :min="0"
          :max="1"
          :interval="0.1"
          style="width: 6rem; height: 3px"
          v-model="volumeValue"
          :lazy="true"
          @change="(value) => handleVolumeChange(value)"
          :process-style="{ background: '#fff' }"
          :rail-style="{ background: '#ffffff60' }"
          :dot-style="{ display: 'none' }"
          :tooltip="'hover'"
          :tooltip-formatter="(val) => val * 100 + '%'"
        ></VueSlider>

        <select
          name=""
          id=""
          @change="handleVideoResolutionChange($event.target.value)"
          class="el-select"
          :value="br"
        >
          <option :value="r.br" v-for="r in props.brs">{{ r.br }}P</option>
        </select>
        <button class="button" @click="fullScreen()">
          <Icon icon="qlementine-icons:fullscreen-16" class="icon-small" v-if="!isFullScreen" />
          <Icon icon="qlementine-icons:fullscreen-exit-16" class="icon-small" v-if="isFullScreen" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import VueSlider from 'vue-slider-component'
import * as req_mv from '../api/mv'
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { s2mmss } from '@/utils/libs'
const props = defineProps(['id', 'brs', 'cover'])
const emits = defineEmits(['changeResolution'])
const player = ref(null)
const isFullScreen = ref(false)
const br = ref(undefined)
const beforePlay = ref(true)
const load = ref(false)
const videoData = ref(null)
const progressValue = ref(0)
const volumeValue = ref(1)
const videoInfo = ref({
  duration: 0,
  currentTime: 0,
  playstate: 'pause'
})
const video = ref(null)
function togglePlay() {
  if (video.value?.paused) {
    video.value?.play()
  } else {
    video.value?.pause()
  }
}
async function getVideoData(id, r) {
  return (await req_mv.getMvUrl(id, r)).data
}
onMounted(async () => {
  console.log(props.brs)
  br.value = props.brs[props.brs.length - 1].br
  videoData.value = await getVideoData(props.id, br.value)
  const vid = video.value
  vid.addEventListener('canplay', onCanPlay)
  vid.addEventListener('play', onPlay)
  vid.addEventListener('pause', onPause)
  vid.addEventListener('timeupdate', onTimeUpdate)
  vid.addEventListener('volumechange', onVolumeChange)
})
onBeforeUnmount(() => {
  const vid = video.value
  vid.removeEventListener('canplay', onCanPlay)
  vid.removeEventListener('play', onPlay)
  vid.removeEventListener('pause', onPause)
  vid.removeEventListener('timeupdate', onTimeUpdate)
  vid.removeEventListener('volumechange', onVolumeChange)
})
function onTimeUpdate() {
  if (load.value) {
    return
  }
  videoInfo.value.currentTime = video.value?.currentTime || 0
  let i = (video.value?.currentTime / video.value?.duration).toFixed(3) || 0
  if (!Object.is(i, NaN)) {
    progressValue.value = i
  }
}
function onCanPlay() {
  videoInfo.value.duration = video.value.duration
}
function onPlay() {
  videoInfo.value.playstate = 'play'
  beforePlay.value = false
}
function onPause() {
  videoInfo.value.playstate = 'pause'
}
function onVolumeChange() {
  volumeValue.value = video.value.volume
}

function handleProgressChange(value) {
  console.log(value)
  video.value.currentTime = value * videoInfo.value.duration
}
function handleVolumeChange(value) {
  video.value.volume = value
}
let savedVolume
function toggleMute() {
  if (volumeValue.value > 0) {
    savedVolume = volumeValue.value
    video.value.volume = 0
  } else {
    video.value.volume = savedVolume
  }
}
async function handleVideoResolutionChange(r) {
  br.value = r
  let currentTime = video.value.currentTime
  let taskStartTime = Date.now()
  load.value = true
  video.value.pause()
  videoData.value = await getVideoData(props.id, r)
  let taskEndTime = Date.now()
  video.value.load()
  video.value.currentTime = currentTime + (taskStartTime - taskEndTime) / 1000
  setTimeout(() => {
    load.value = false
    video.value.play()
  }, 100)
}

function fullScreen() {
  if (player.value.requestFullscreen && !isFull()) {
    player.value.requestFullscreen()
    isFullScreen.value = true
  } else {
    document.exitFullscreen()
    isFullScreen.value = false
  }
  function isFull() {
    const e = document.fullscreenElement
    return e ? true : false
  }
}
</script>
<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  background-color: black;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-ctn {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}
.vid {
  height: 100%;
  width: 100%;
  object-fit: contain;
  margin: auto;
}
.video-control {
  width: 100%;
  height: 3rem;
  position: absolute;
  z-index: 5;
  left: 0;
  bottom: 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: rgba(0, 0, 0, 0.237);
  opacity: 0;
  transition: 2s cubic-bezier(0.19, 1, 0.22, 1);
}
.video-control:hover{
  opacity: 1;
}
.slider-process {
  color: #ffffff60;
}
.controls {
  width: 95%;
  height: fit-content;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: auto;
  color: #fff;
  gap: 1rem;
}
.button {
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 0.3rem;
}
.button:hover {
  background: #ffffff47;
}
.icon {
  width: 2rem;
  height: 2rem;
  color: #fff;
}
.icon-small {
  width: 1.3rem;
  height: 1.3rem;
  color: #fff;
}
.el-select {
  width: fit-content;
  min-width: auto;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0 auto auto;
}
.el-select option {
  color: black;
}
.playstate {
  width: 7rem;
  height: 7rem;
  position: absolute;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.199);
  backdrop-filter: blur(2px);
  border-radius: 50%;
}
.playstate .icon{
  width: 6rem;
  height: 6rem;
  color: #fff;
  opacity: 0.8;
}
</style>
