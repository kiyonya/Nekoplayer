<template>
  <div class="playlist-obj" @click.stop>
    <h2 class="ti">正在播放</h2>
    <div class="shell">
      <div class="song" style="background: var(--app-theme-strong-background); color: #fff">
        <div class="cover-shell">
          <img :src="resize(musicInfo.cover)" alt="" class="cover" :key="musicInfo.cover" />
        </div>
        <div class="info">
          <h3 class="text-limit">{{ musicInfo.name }}</h3>
          <ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup>
        </div>
      </div>
    </div>
    <div class="motd">
      <h2 class="ti">即将播放</h2>
      <button class="btn" title="清除列表" @click.stop="clearList">
        <Icon icon="material-symbols:delete" width="1.4rem" />
      </button>
    </div>
    
    <div 
      class="tracks" 
      ref="tracksContainer"
      :style="{ height: `${containerHeight}px` }"
      @scroll.passive="handleScroll"
    >
      <!-- 占位元素，撑起完整列表高度 -->
      <div :style="{ height: `${totalHeight}px` }">
        <!-- 可视区域渲染 -->
        <div 
          v-for="item in visibleItems" 
          :key="item.id"
          :style="{ transform: `translateY(${item.offset}px)` }"
        >
          <PlaylistBarSong :song="item.data" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { resize } from '@/utils/imageProcess'
import { store } from '@/store'
import { player } from '@/main'
import { getList } from '@/lib/player/getlist'
import PlaylistBarSong from './PlaylistBarSong.vue'
import ArtistNameGroup from './ArtistNameGroup.vue'
import { Icon } from '@iconify/vue'
// 数据状态
const musicInfo = computed(() => store.state.musicInfo)
const nowPlayingSource = computed(() => store.state.nowPlayingSource)
const playlistData = ref([])

// 虚拟列表参数
const itemHeight = 60 // 每项高度（需与实际DOM高度一致）
const containerHeight = 400 // 容器可视高度
const buffer = 5 // 缓冲项数
const tracksContainer = ref(null)
const scrollTop = ref(0)

// 计算虚拟列表范围
const visibleItems = computed(() => {
  const startIdx = Math.max(0, Math.floor(scrollTop.value / itemHeight) - buffer)
  const endIdx = Math.min(
    playlistData.value.length,
    Math.ceil((scrollTop.value + containerHeight) / itemHeight) + buffer
  )
  return playlistData.value
    .slice(startIdx, endIdx)
    .map((item, idx) => ({
      data: item,
      offset: (startIdx + idx) * itemHeight,
      id: item.id || idx
    }))
})
const totalHeight = computed(() => playlistData.value.length * itemHeight)
async function loadList() {
  try {
    let cur = player.getCursor()
    playlistData.value = await getList(player.list.slice(Math.max(0,cur),Math.max(0,cur) + 50))
  } catch (err) {
  }
}
function handleScroll() {
  if (tracksContainer.value) {
    scrollTop.value = tracksContainer.value.scrollTop
  }
}
watchEffect(() => {
  if (nowPlayingSource.value) loadList()
})
function handleWarp() {
  store.commit('showPlaylistBar', false)
}

onMounted(() => {
  window.addEventListener('click', handleWarp)
  Promise.resolve().then(()=>{
    
    loadList()
  })
})

onUnmounted(() => {
  window.removeEventListener('click', handleWarp)
  playlistData.value = null
})

function clearList(){
  player.clearPlaylist()
  playlistData.value = []
  visibleItems.value = []
  loadList()
  
}
</script>
<style scoped>
/* 确保每项绝对定位 */
.tracks > div > div {
  position: absolute;
  width: 100%;
  height: 60px; /* 与itemHeight一致 */
}
.playlist-obj {
  width: 25rem;
  height: 80%;
  position: fixed;
  right: 0;
  bottom: calc(10% - 0.7rem);
  z-index: 99999;
  background: var(--component);
  border-radius: var(--br-2) 0 0 var(--br-2);
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
.shell {
  width: 90%;
  height: fit-content;
  overflow: hidden;
}

.tracks {
  width:90%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  flex-direction: column;

  position: relative;
}

.song {
  width: calc(100% - 1rem);
  height: fit-content;
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  padding: 0.5rem;
  border-radius: 0.2rem;
  transition: .1s;
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
  border-radius: 0.3rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

.motd{
  width: 90%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .btn{
    box-sizing: border-box;
    width: fit-content;
    height: fit-content;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    padding: 0.3rem;
    border-radius: var(--br-1);

    color: var(--text-o-2);
  }
  .btn:hover{
    background: var(--hover);
  }
}
</style>
