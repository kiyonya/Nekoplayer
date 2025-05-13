<template>
  <div class="playlist page" ref="playlist" :key="$route.params.id">
    <HeadInfo :cover="detial?.coverImgUrl" :name="detial?.name" :subtitle="detial?.detailPageTitle ? `${detial?.detailPageTitle} · ${detial?.updateFrequency}` : ''
      " @subtitleclick="null" :creator="detial?.creator ? detial?.creator?.nickname : null" :oncreatorclick="() => {
        if (detial?.creator) {
          router.push({ name: 'User', params: { id: detial?.creator?.userId } })
        }
      }" 
      :info="`最后更新于${getDate(detial?.trackUpdateTime)} · ${detial?.trackCount}首歌`" :desc="detial?.description"
      @descClick="null" @playall="player.playPlaylist(null, null, { type: 'playlist', id: pid }, true)"
      @addlist="player.insertPlaylistCandy(pid, { type: 'playlist', id: pid })" @browser="() => {
        const url = `https://music.163.com/#/playlist?id=${pid}`
        browserOpen(url)
      }"></HeadInfo>

    <div class="info"><span>共{{ detial?.trackCount }}首音乐</span><span>约可播放{{ fullTime }}分钟</span>

      <button class="native-o-button" title="列表" v-if="trackDisplayMode === 'card'" @click="trackDisplayMode = 'track'">
        <Icon icon="fa6-solid:list" style="width: 1.5em;height:1.5em;" />
      </button>
      <button class="native-o-button" title="卡片" v-if="trackDisplayMode === 'track'" @click="trackDisplayMode = 'card'">
        <Icon icon="il:grid" style="width: 1.5em;height:1.5em;" />
      </button>
    </div>
    <div class="tracks" v-if="trackDisplayMode === 'track'">
      <Song v-for="(song, index) in tracks" :source="{ type: 'playlist', id: pid }" :trackDetial="{
        name: song.name,
        cover: song.al.picUrl,
        artist: song.ar,
        album: song.al,
        id: song.id,
        duration: song.dt,
        tns: song.tns || null,
        alia: song.alia,
        mv: song.mv
      }" :index="index" @play="playTracks" @browser-open="browserOpen"></Song>
    </div>
    <div class="cards" v-if="trackDisplayMode === 'card'">
      <MusicCardNormal v-for="(song, index) in tracks" :source="{ type: 'playlist', id: pid }" :trackDetial="{
        name: song.name,
        cover: song.al.picUrl,
        artist: song.ar,
        album: song.al,
        id: song.id,
        duration: song.dt,
        tns: song.tns || null,
        alia: song.alia,
        mv: song.mv
      }" :index="index" @play="playTracks"></MusicCardNormal>
    </div>
  </div>
</template>
<script setup>
import { getPlaylistTracks, getPlaylistDetial } from '../../api/playlist'
import MusicCardNormal from '@/components/MusicCardNormal.vue'
import Song from '@/components/Song.vue'
import { formatDuration, getDate } from '@/utils/timers'
import HeadInfo from '@/components/HeadInfo.vue'
import { player } from '@/main'
import { nextTick, onBeforeMount } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import router from '@/router'
const tracks = ref([])
const detial = ref({})
const pid = ref(0)
const fullTime = ref(0)
const trackDisplayMode = ref('track')
onBeforeMount(() => {
  let id = useRoute().params?.id
  if (!id) {
    return
  }
  pid.value = id
  getPlaylistDetial(id, true).then((data) => {
    detial.value = data?.playlist
    const trackIds = data?.playlist?.trackIds

    getPlaylistTracks(id, trackIds, false).then(trackdata => {
      tracks.value.push(...trackdata.slice(0, 5))
      setTimeout(() => {
        tracks.value = trackdata
        let time = 0
        for (let song of trackdata) {
          time += song?.dt || 0
        }
        fullTime.value = Math.round(time / 1000 / 60)
      }, 50);
    })
  })
})
function playTracks(id) {
  player.playPlaylist(id, null, { type: 'playlist', id: pid.value })
}
function browserOpen(url) {
  window.electron.ipcRenderer.send('app:openWebView', url)
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
