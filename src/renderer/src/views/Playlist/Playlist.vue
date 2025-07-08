<template>
  <div class="playlist page">
    <HeadInfo :cover="detail?.coverImgUrl" :name="detail?.name" :subtitle="detail?.detailPageTitle ? `${detail?.detailPageTitle} · ${detail?.updateFrequency}` : ''
      " @subtitleclick="null" :creator="detail?.creator ? detail?.creator?.nickname : null" :oncreatorclick="() => {
        if (detail?.creator) {
          router.push({ name: 'User', params: { id: detail?.creator?.userId } })
        }
      }" :info="`最后更新于${getDate(detail?.trackUpdateTime)} · ${detail?.trackCount}首歌`" :desc="detail?.description"
      @descClick="null" 
      @playall="handlePlayAll"
      @addlist="handleAddToList" 
      @browser="() => {
        const url = `https://music.163.com/#/playlist?id=${pid}`
        browserOpen(url)
      }" v-if="detail?.name"></HeadInfo>

    <!-- <div class="info"><span>共{{ detail?.trackCount }}首音乐</span><span>约可播放{{ fullTime }}分钟</span>
    </div> -->
    <div class="tracks">
      <!--  -->
      <div class="chunk" v-for="chunk in chunks" :style="{ height: chunk?.height + 'rem' }" :data-index="chunk?.index"
        :ref="el => chunk.el = el">
        <Song v-for="(song, index) in chunk?.data" :source="{ type: 'playlist', id: pid }" :trackDetial="{
          name: song.name,
          cover: song.al.picUrl,
          artist: song.ar,
          album: song.al,
          id: song.id,
          duration: song.dt,
          tns: song.tns || null,
          alia: song.alia,
          mv: song.mv
        }" :index="chunk?.start + index" @play="playTracks"
          v-if="chunk?.data?.length && chunk.chunkLoadMode === 'force'">
        </Song>
      </div>
    </div>
  </div>
</template>
<script setup>
"use strict"
import { getPlaylistDetial } from '../../api/playlist'
import Song from '@/components/Song.vue'
import { getDate } from '@/utils/timers'
import HeadInfo from '@/components/HeadInfo.vue'
import { player } from '@/main'
import { ref, onMounted, nextTick, onBeforeUnmount, onUnmounted } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { getSongDetial } from '@/api/song'
import { cachePlaylistIds, getPlaylistIds } from '@/views/playlist/cache'
let detail = ref({})
let pid = ref(0)
let chunks = ref([])
let singleSongComponetHeight = 4
let loading = ref(false)
let playlistLoaderOb
let loadTimeout
async function loadChunk(ids) {
  try {
    const data = await getSongDetial(ids.join(","))
    return data?.songs || []
  } catch (error) {
    return false
  }
}
async function getCache(id) {
  let trackIds, cachedDetail
  await Promise.resolve().then(async () => {
    const cache = await getPlaylistIds(id)
    trackIds = cache?.trackIds || null
    cachedDetail = cache?.detail || {}
  })
  if (cachedDetail && Object.keys(cachedDetail).length) {
    detail.value = { ...cachedDetail }
    await nextTick()
  }
  if (!trackIds) {
    const data = await getPlaylistDetial(id)
    detail.value = { ...data?.playlist, trackIds: null, tracks: null }
    trackIds = data?.playlist?.trackIds?.map(i => i.id)
    await cachePlaylistIds(id, trackIds, detail.value)
  }
  return trackIds
}
async function playlistLoader(id, batchSize = 30, callback) {
  let trackIds = await getCache(id)
  //接下来 分配ids
  let chunkIndex = 0
  for (let i = 0; i < trackIds.length; i += batchSize) {
    chunks.value.push({
      index: chunkIndex,
      data: [],
      ids: trackIds.slice(i, i + batchSize),
      chunkLoadMode: "unload",
      isload: false,
      height: singleSongComponetHeight * trackIds.slice(i, i + batchSize).length,
      start: i
    })
    chunkIndex++
  }
  trackIds = null
  await nextTick()
  playlistLoaderOb = new IntersectionObserver((entries) => {
    for (let entry of entries) {
      if (entry.isIntersecting && !loading.value) {
        loadTimeout && clearTimeout(loadTimeout)
        loadTimeout = setTimeout(async () => {
          const currentIndex = parseInt(entry.target.dataset.index);
          const totalChunks = chunks.value.length;
          // 先重置所有chunk的状态为'unload'
          chunks.value.forEach(chunk => {
            chunk.chunkLoadMode = 'unload';
          });
          for (let i = -2; i <= 2; i++) {
            const targetIndex = currentIndex + i;
            if (targetIndex >= 0 && targetIndex < totalChunks) {
              if (Math.abs(i) <= 1) { // 邻近的1个前一个、当前、后一个
                chunks.value[targetIndex].chunkLoadMode = 'force';
              } else { // 邻近的2个
                chunks.value[targetIndex].chunkLoadMode = 'weak';
              }
            }
          }
          //获取需要请求加载的区块
          let chunkNeedToLoad = chunks.value.filter(chunk => (chunk.chunkLoadMode === 'force' || chunk.chunkLoadMode === 'weak') && !chunk.isload)
          loading.value = true
          chunkNeedToLoad.map(i => new Promise((resolve, reject) => {
            if (i.isload) { resolve() }
            let ids = i.ids
            loadChunk(ids).then(songs => {
              i.data = songs
              i.isload = true
              resolve()
            })
          }))

          await Promise.all(chunkNeedToLoad).then(() => {
            loading.value = false
            chunkNeedToLoad.length = 0
          })

        }, 50);
      }
    }
  });
  await nextTick()
  for (let chunk of chunks.value) {
    playlistLoaderOb.observe(chunk?.el)
  }
}

onMounted(async () => {
  const id = useRoute().params?.id
  if (!id) return
  pid.value = id
  requestIdleCallback(() => {
    playlistLoader(id, 30)
    webFrame?.clearCache()
  })
})
onUnmounted(()=>{
  clearTimeout(loadTimeout)
  playlistLoaderOb?.disconnect()
  playlistLoaderOb = null
  for(let c of chunks.value){
    let el = c?.el
    for(let s of el.children){
      s = null
    }
    el = null
  }
   chunks.value.length = 0
   chunks.value = []
  detail.value = {}
  detail = null
  webFrame?.clearCache()
})
function playTracks(id) {
  player.playPlaylist(id, null, { type: 'playlist', id: pid.value })
}
function handlePlayAll() {
  this.player.playPlaylist(null, null, { type: 'playlist', id: pid.value }, true)
}
function handleAddToList() {
  this.player.insertPlaylistCandy(pid.value, { type: 'playlist', id: pid.value})
}
</script>
<style scoped>
@media screen and (min-width:1301px) {
  .cards {
    grid-template-columns: repeat(6, 1fr) !important;
  }
}

.tracks {
  width: 95%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  scroll-snap-type: proximity;
  margin-top: 1.2rem;
  margin-bottom: 5rem;
}

.info {
  width: 93%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-o-3);

  button {
    margin-left: auto;
    margin-right: 0;
  }
}

.cards {
  width: 93%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  gap: 20px;
  margin-top: 1.2rem;
  margin-bottom: 5rem;
  overflow-x: hidden;
}
</style>
