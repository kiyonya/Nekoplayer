<template>
  <div class="playlist-obj" @click.stop>
    <h2 class="ti">正在播放</h2>
    <div class="shell">
      <div class="song" style="background: var(--app-theme-strong-background); color: #fff">
        <div class="cover-shell">
          <img :src="resize(musicInfo.cover)" alt="" class="cover" :key="musicInfo.cover"/>
        </div>
        <div class="info">
          <h3 class="text-limit">{{ musicInfo.name }}</h3>
          <ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup>
        </div>
      </div>
    </div>
    <h2 class="ti">播放列表</h2>
    <div class="tracks" ref="tracks">
      <PlaylistBarSong  v-for="song in (display || [])" :song="song"></PlaylistBarSong>
    </div>
  </div>
</template>
<script setup>
import PlaylistBarSong from './PlaylistBarSong.vue'
import ArtistNameGroup from './ArtistNameGroup.vue'
import { watch } from 'vue'
import { resize } from '@/utils/imageProcess'
import { player } from '@/main'
import { onBeforeMount } from 'vue'
import { computed } from 'vue'
import { store } from '@/store'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
const nowPlayingSource = computed(()=>{
  return store.state.nowPlayingSource
})
const musicInfo = computed(()=>{
  return store.state.musicInfo
})
const display = ref([])
onBeforeMount(()=>{
  watch(nowPlayingSource,()=>{
    loadList()
    console.log("go")
  },{immediate:true})
})
onMounted(()=>{
  window.addEventListener('click',handleWarp)
})
onUnmounted(()=>{
  window.removeEventListener('click',handleWarp)
})
async function loadList() {
  const list = await player.queryPlaylist()
  display.value = list
}
function handleWarp(){
  store.commit('showPlaylistBar',false)
}


</script>
<style scoped>
.playlist-obj {
  width: 27%;
  height: 80%;
  position: fixed;
  right: 0;
  bottom: calc(10% - 0.7rem);
  z-index: 99999;
  background: var(--component);
  border-radius: 1rem 0 0 1rem;
  box-shadow: -0.3rem 0.3rem 0.5rem #2525251d;
  transition: 0.2s;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.7rem 0;
  gap: 1rem;
}
.playlist-obj .ti {
  width: 90%;
}
.ti:first-child {
  margin-top: 1rem;
}
.shell {
  width: 90%;
  height: fit-content;
  overflow: hidden;
}
.tracks {
  width: 90%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.song {
  width: calc(100% - 1rem);
  height: fit-content;
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  padding: 0.5rem;
  border-radius: 0.7rem;
}
.song:hover {
  background: var(--hover);
  .cover-shell .cover {
    filter: brightness(0.6);
  }
  .cover-shell svg {
    opacity: 1;
  }
}
.song .cover {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  flex-shrink: 0;
}
.song .cover-shell {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.song .cover-shell svg {
  width: 2em;
  position: absolute;
  z-index: 1;
  opacity: 0;
  transition: all 0.1s ease-in-out;
}
.song .cover-shell svg:active {
  transform: scale(0.9);
}
.song .info {
  display: block;
}
.song .info h3 {
  width: 15rem;
}
.song .info a {
  width: 15rem;
}
.highlight {
  background: var(--hover);
}
</style>
