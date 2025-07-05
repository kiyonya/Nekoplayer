<template>
  <div class="page" :key="id + view">
    <div class="title">
      <h1>{{ artistName }}的{{ viewMap[view] }}</h1>
    </div>
    <div class="view songs" v-if="view === 'songs'">
      <Song
        v-for="(song, index) in songs"
        :source="{ type: 'artist', id: id }"
        :trackDetial="{
          name: song.name,
          cover: song.al.picUrl,
          artist: song.ar,
          album: song.al,
          id: song.id,
          duration: song.dt,
          tns: song.tns || null,
          alia: song.alia,
          mv: song.mv
        }"
        :index="index"
        @play="playSongs"
        @menu="trackMenuSelected"
      ></Song>
    </div>
    <div class="view" v-if="view === 'albums'">
      <div class="albums">
        <AlbumCard
          v-for="al in albums"
          :name="al.name"
          :size="al.size"
          :cover="al.picUrl"
          :id="al.id"
          :hideInfo="true"
          :date="al?.publishTime"
          @playall="
            (id) => {
              player.playAlbum(null, null, { type: 'album', id: id }, true)
            }
          
          "
          @menu="albumCardMenuSelected"
        >
        </AlbumCard>
      </div>
      <div class="loadmore" ref="loadmore">{{ hasMore ? '加载中' : '已经到底了喵~' }}</div>
    </div>
    <div class="view" v-if="view === 'mvs'">
      <div class="mvs">
        <MvCard
          v-for="mv in mvs"
          :cover="mv?.imgurl16v9"
          :name="mv?.name"
          :duration="mv?.duration"
          :id="mv?.id"
        ></MvCard>
      </div>
      <div class="loadmore" ref="loadmore">{{ hasMore ? '加载中' : '已经到底了喵~' }}</div>
    </div>
  </div>
</template>
<script setup>
import { getArtistAlbums, getArtistDetial, getArtistSongs, getMvs } from '@/api/artist'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Song from '@/components/Song.vue'
import AlbumCard from '@/components/AlbumCard.vue'
import MvCard from '@/components/MvCard.vue'
import { onMounted } from 'vue'
import { nextTick } from 'vue'
import { player, toolkit } from '@/main'
import router from '@/router'
import { showMessageNotification } from '@/components/notification/use_notification'
const view = ref('')
const id = ref(0)
const artistName = ref('')
const songs = ref([])
const albums = ref([])
const mvs = ref([])
const hasMore = ref(true)
const loadmore = ref(null)
const page = ref(1)
let loading = false
const viewMap = {
  songs: '热门单曲',
  albums: '专辑',
  mvs: '音乐视频'
}
function loadSongs(id) {
  if (view.value === 'songs') {
    getArtistSongs(id).then((data) => {
      songs.value = data
    })
  }
}
function load() {
  if (loading || !hasMore.value) {
    return
  }
  if (view.value === 'songs') {
    getArtistSongs(id.value).then((data) => {
      songs.value = data
    })
  } else if (view.value === 'albums') {
    loadAlbums(id.value)
  } else if (view.value === 'mvs') {
    loadMvs(id.value)
  }
}
function loadAlbums(id) {
  getArtistAlbums(id, page.value, 20).then((data) => {
    albums.value.push(...data?.hotAlbums)
    hasMore.value = data?.more || false
    data?.more && page.value++
    loading = false
  })
}
function loadMvs(id) {
  getMvs(id, page.value, 20).then((data) => {
    console.log(data)
    mvs.value.push(...data?.mvs)
    hasMore.value = data?.hasMore || false
    data?.hasMore && page.value++
    loading = false
  })
}
onMounted(() => {
  const router = useRoute()
  view.value = router.query.view
  id.value = router.query.id
  if (router.query.name) {
    artistName.value = router.query.name
  } else {
    getArtistDetial(id.value).then((data) => {
      artistName.value = data?.data?.artist?.name
    })
  }
  let observer = new IntersectionObserver((entries) => {
    entries.forEach((item) => {
      if (item.isIntersecting) {
        load()
      }
    })
  })
  if (view.value === 'songs') {
    loadSongs(id.value)
  }
  nextTick(() => {
    if (loadmore.value && view.value !== 'songs') {
      observer.observe(loadmore.value)
    }
  })
})
function playSongs(trackId) {
  let source = { type: 'artist', id: id.value }
  player.playArtist(trackId, player.automap(songs.value, source), source)
}
function albumCardMenuSelected({ name, id } = _, item) {
  const act = item?.act
  const actions = {
    open: () => {
      router.push({ name: "Album", params: { id: id } })
    },
    playall:()=>{
      player.playAlbum(null, null, { type: 'album', id: id}, true)
    },
    browser: () => {
      const url = `https://music.163.com/#/album?id=${id}`
      window.electron.ipcRenderer.send('app:openWebView', url)
    },
    copylink: () => {
      const url = `https://music.163.com/#/album?id=${id}`
      window.navigator.clipboard.writeText(url)
      showMessageNotification("已复制")
    },
  }
  if (actions[act]) {
    actions[act]()
  }
}
function trackMenuSelected(track,item) {
  let _id = track?.id
  let name = track?.name
  const act = item?.act
  let source = { type: 'artist', id: id.value }
  const actions = {
    play: () => {
      playSongs(_id)
    },
    addnext: () => {
      player.addTrackToNext(_id, source)
    },
    browser: () => {
      const url = `https://music.163.com/#/song?id=${_id}`
      window.electron.ipcRenderer.send('app:openWebView', url)
    },
    copylink: () => {
      const url = `https://music.163.com/#/song?id=${_id}`
      window.navigator.clipboard.writeText(url)
      showMessageNotification("已复制")
    },
    downloadlyric: () => {
      toolkit.downloadLyric(_id,name)
    },
    downloadNloLyric: () => {
      toolkit.downloadNloLyric(_id,name)
    }
  }
  if (actions[act]) {
    actions[act]()
  }
}
</script>
<style scoped>
@media screen and (min-width: 1301px) {
  .albums {
    grid-template-columns: repeat(6, 1fr) !important;
  }
}

.view {
  width: 95%;
  margin-bottom: 5rem;
}

.songs {
  display: flex;
  flex-direction: column;
}

.title {
  width: 95%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
  margin-top: 2rem;

  img {
    width: 3rem;
    height: 3rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }

  h2 {
    font-size: 3rem;
    font-weight: bold;
    color: inherit;
  }
}

.albums {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.mvs {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.loadmore {
  width: 95%;
  text-align: center;
  margin-top: 1rem;
  color: var(--text-o-4);
}
</style>
