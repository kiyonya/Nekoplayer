<template>
  <div class="playlist page" ref="playlist" :key="$route.params.id">
    <HeadInfo :cover="detail?.coverImgUrl" :name="detail?.name" :subtitle="detail?.detailPageTitle ? `${detail?.detailPageTitle} · ${detail?.updateFrequency}` : ''
      " @subtitleclick="null" :creator="detail?.creator ? detail?.creator?.nickname : null" :oncreatorclick="() => {
        if (detail?.creator) {
          router.push({ name: 'User', params: { id: detail?.creator?.userId } })
        }
      }" :info="`最后更新于${getDate(detail?.trackUpdateTime)} · ${detail?.trackCount}首歌`" :desc="detail?.description"
      @descClick="null" @playall="player.playPlaylist(null, null, { type: 'playlist', id: pid }, true)"
      @addlist="player.insertPlaylistCandy(pid, { type: 'playlist', id: pid })" @browser="() => {
        const url = `https://music.163.com/#/playlist?id=${pid}`
        browserOpen(url)
      }"></HeadInfo>

    <!-- <div class="info"><span>共{{ detail?.trackCount }}首音乐</span><span>约可播放{{ fullTime }}分钟</span>
    </div> -->
    <div class="tracks" ref="tracks">
      <!--  -->
      <div class="chunk" v-for="chunk in chunks" :style="{ height: chunk?.height + 'rem' }" data-chunk="ok"
        :data-index="chunk?.index">
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
        }" :index="chunk?.start + index" @play="playTracks" v-if="chunk?.data?.length">
        </Song>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getPlaylistDetial } from '../../api/playlist'
import Song from '@/components/Song.vue'
import { getDate } from '@/utils/timers'
import HeadInfo from '@/components/HeadInfo.vue'
import { player, toolkit } from '@/main'
import { ref, onMounted, onUnmounted, nextTick, onDeactivated, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { getSongDetial } from '@/api/song'
import { cachePlaylistIds, getPlaylistIds } from '@/views/playlist/cache'
import { showMessageNotification } from '@/components/notification/use_notification'
let detail = ref({})
let pid = ref(0)
let isLoading = ref(false)
let isHydrating = ref(false)
let chunks = ref([])
let tracks = ref(null)
let batchSize = 30
let singleSongComponetHeight = 4
let WAIT_TIME = 50
async function loadChunk(chunkArray) {
  try {
    const data = await getSongDetial(chunkArray.join(","))
    return data?.songs || []
  } catch (error) {
    return false
  }
}
onMounted(async () => {
  const id = useRoute().params?.id
  if (!id) return
  pid.value = id
  isHydrating.value = true // 开始数据水合
  try {
    // 1. 非阻塞方式检查缓存
    let trackIds, cachedDetail
    await Promise.resolve().then(async () => {
      const cache = await getPlaylistIds(id)
      trackIds = cache?.trackIds || null

      cachedDetail = cache?.detail || {}
    })
    // 2. 立即显示缓存数据（如果有）
    if (cachedDetail && Object.keys(cachedDetail).length) {
      detail.value = { ...cachedDetail }
      await nextTick()
    }
    // 3. 如果没有缓存，获取完整数据
    if (!trackIds) {
      isLoading.value = true
      const data = await getPlaylistDetial(id)
      detail.value = { ...data?.playlist, trackIds: null, tracks: null }
      trackIds = data?.playlist?.trackIds?.map(i => i.id)
      await cachePlaylistIds(id, trackIds, detail.value)
    }
    const batches = []
    for (let i = 0; i < trackIds.length; i += batchSize) {
      batches.push(trackIds.slice(i, i + batchSize))
    }
    batches.forEach((i, index) => {
      chunks.value.push({
        index,
        height: i.length * singleSongComponetHeight,
        start: index * batchSize,
        tracks: []
      })
    })
    let loaderObserver
    let loadTimeout = null
    await nextTick(() => {
      if (tracks.value) {
        const chunksEl = tracks.value.querySelectorAll("div[data-chunk]")
        let pendingChunksIndex = []
        let loadedChunk = new Map()
        loaderObserver = new IntersectionObserver(async (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !isLoading.value && batches.length >= 1) {
              let chunk = entry.target
              let chunkIndex = Number(chunk.dataset?.index)
              pendingChunksIndex.push(chunkIndex)
              clearTimeout(loadTimeout)
              loadTimeout = setTimeout(() => {
                isLoading.value = true
                let needLoadingChunks = pendingChunksIndex.slice(-2)
                let pending = needLoadingChunks.map(id => new Promise((resolve, reject) => {
                  if (!batches[id] || loadedChunk.has(id)) { resolve() }
                  else {
                    loadChunk(batches[id]).then(songs => {
                      chunks.value[id].data = songs
                      loadedChunk.set(id, true)
                      loaderObserver.unobserve(chunk)
                      resolve()
                    })
                  }
                }))
                Promise.all(pending).then(() => {
                  pendingChunksIndex = []
                  needLoadingChunks.forEach(id => {
                    batches[id] = null
                  })
                  isLoading.value = false
                  if (batches.every(i => i === null)) {
                    clearTimeout(loadTimeout)
                    loadTimeout = null
                    loaderObserver.disconnect()
                    loaderObserver = null
                  }
                })
              }, WAIT_TIME);
            }
          }
        }, { threshold: 0.1, rootMargin: "40px" })
        for (let chunk of chunksEl) {
          loaderObserver.observe(chunk)
        }
      }
      else {
        throw new Error("no base dom")
      }
    })

  } catch (error) {
    console.error('加载播放列表失败:', error)
  } finally {
    isHydrating.value = false
    isLoading.value = false
  }
})
onUnmounted(() => {
  detail = null
  pid = null
  isLoading = null
  isHydrating = null
  chunks = null
  tracks = null
})
function playTracks(id) {
  player.playPlaylist(id, null, { type: 'playlist', id: pid.value })
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
