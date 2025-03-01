<template>
  <ModalWindow>
    <div class="importer">
      <div class="win-control">
        <Icon icon="material-symbols:close-rounded" class="icon" @click.top="emits('close')" />
      </div>
      <h2>外部歌单</h2>
      <div class="input-playlist">
        <select name="" id="" class="platform">
          <option value="QQ">QQ音乐</option>
        </select>
        <input type="text" class="input-box" v-model="qqPlaylistId" />
        <button @click="requestQQPlaylist">匹配歌单</button>
      </div>
      <div class="tip">
        正在匹配<b class="text-limit strong">{{ currentMatching }}</b
        ><span class="progress-tip">{{ processed }} / {{ total }}</span>
      </div>
      <div class="progress">
        <div class="bar" :style="`width:${((processed / total) * 100).toFixed(0)}%`"></div>
      </div>
      <span class="tip"
        >成功匹配 <b>{{ matchResult?.matchedCount || 0 }}</b
        >未匹配<b>{{ matchResult?.dismatchedCount || 0 }}</b></span
      >
      <div class="viewer">
        <div
          class="song text-limit"
          v-for="song in matchResult?.matchResult || []"
          :class="song.match ? 'matched' : 'dismatched'"
        >
          <span>{{ song.match ? '√' : '×' }}</span
          ><span class="name">{{ song.QQ.name }}</span
          ><span>-</span><span class="artist">{{ song.QQ.singer[0].name }}</span>
        </div>
      </div>
      <h2>将歌单处理为</h2>
      <span>新建的网易云歌单</span>
      <span>本地联网歌单</span>
      <span @click="selectDir">导出.json文件</span>
    </div>

    <NewPlaylist></NewPlaylist>

  </ModalWindow>
</template>
<script setup>
import ModalWindow from './windows/ModalWindow.vue'
import NewPlaylist from './windows/NewPlaylist.vue'
import { currentMatching, searchNcmApi, total, processed } from '@/plugins/playlist-importer'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
let qqPlaylistId = ref(undefined)
let matchResult = ref(null)
async function requestQQPlaylist() {
  if (!qqPlaylistId.value) {
    return
  }
  matchResult.value = null
  const QQdata = await window.api.getQQPlaylist(qqPlaylistId.value)
  matchResult.value = await searchNcmApi(QQdata)
}
async function selectDir() {
  const path = await window.api.openDir()
  console.log(path)
}
const emits = defineEmits(['close'])
</script>
<style scoped>
.importer {
  padding: 1.5rem;
  width: calc(30% - 3rem);
  min-width: 30rem;
  height: calc(80% - 3rem);
  top: calc(10%);
  position: fixed;
  z-index: 999;
  background-color: var(--app-theme-component);
  border-radius: 0.9rem;
  box-shadow: 0 0 12px #0000003b;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input-playlist {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.input-box {
  width: calc(56% - 2rem);
  height: 2rem;
  font-size: 1.2rem;
  padding: 0 1rem;
  outline: none;
  border: none;
  background-color: var(--hover);
  border-radius: 0.2rem;
  font-weight: 600;
}
.platform {
  width: 20%;
  height: 100%;
  outline: none;
  border: 2px solid var(--app-theme-strong-background);
  border-radius: 0.2rem;
  background: var(--hover);
  font-weight: 600;
  font-size: 1rem;
}
.input-playlist button {
  display: block;
  width: 20%;
  background-color: var(--app-theme-strong-background);
  border: none;
  border-radius: 0.2rem;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
}
.tip {
  width: 100%;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
}
.strong {
  flex: 1;
}
.progress {
  width: 100%;
  height: 4px;
  position: relative;
  background: var(--hover);
  overflow: hidden;
  border-radius: 5px;
  margin: -0.3rem;
}
.progress .bar {
  height: 100%;
  position: absolute;
  left: 0;
  background: var(--app-theme-strong-background);
}
.progress-tip {
  margin: auto 0 0 auto;
  color: var(--app-theme-strong-background);
  font-size: 0.9rem;
  width: fit-content;
}
.viewer {
  width: auto;
  height: 13rem;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--hover);
  padding: 0.9rem;
  border-radius: 0.4rem;
}
.song {
  width: 100%;
  max-width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  align-items: center;
  font-weight: 600;
}
.song .name {
  font-size: 1.1rem;
}
.song .artist {
  font-size: 1rem;
}
.matched {
  color: rgb(13, 152, 54);
}
.dismatched {
  color: #ff4f4f;
}
.win-control {
  width: 100%;
  height: fit-content;
  position: relative;
}
.win-control .icon {
  width: 1.8rem;
  height: 1.8rem;
  position: absolute;
  right: 0;
  transition: 0.2s;
}
.win-control .icon:active {
  transform: scale(0.8);
}
</style>
