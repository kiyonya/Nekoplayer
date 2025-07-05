<template>
  <div class="page">
    <h2 class="pt">有关<span style="color: var(--strong);">{{ keyword }}</span>的{{ typeMap[renderType]?.name }}</h2>
    <div class="block tracks" v-if="renderData.type === 'song'">
      <Song v-for="(song, index) in renderData?.data" :source="{ type: 'search_song', id: null }" :trackDetial="{
        name: song.name,
        cover: song.al.picUrl,
        artist: song.ar,
        album: song.al,
        id: song.id,
        duration: song.dt,
        tns: song.tns || null,
        alia: song.alia,
        mv: song.mv
      }" :index="index" @play="playTracks" v-if="renderData?.data?.length">
      </Song>
    </div>
    <div class="block album g-shell-6" v-if="renderData.type === 'album'">
      <AlbumCard v-for="album in renderData.data" :name="album?.name" :cover="album?.picUrl" :id="album?.id"
        :size="album?.size" :date="album?.publishTime" @playall="(id) => {
          player.playAlbum(null, null, { type: 'album', id: album?.id }, true)
        }">
      </AlbumCard>
    </div>
    <div class="block playlist g-shell-6" v-if="renderData.type === 'playlist'">
      <PlaylistCard v-for="pl in renderData.data" 
      :name="pl?.name" 
      :cover="pl?.coverImgUrl" 
      :id="pl?.id"
      @playall="(id) => player.playPlaylist(null, null, { type: 'playlist', id: pl?.id }, true)">
      </PlaylistCard>
    </div>
    <div class="block g-shell-6 artist" v-if="renderData.type === 'artist'">
      <ArtistCard v-for="artist in renderData.data" 
      :name="artist?.name" 
      :id="artist?.id"
      :cover="artist?.picUrl">
    </ArtistCard>
    </div>
    <div class="block v  g-shell-5" v-if="renderData.type === 'mv'">
       <MvCard v-for="mv in renderData.data"
       :name="mv?.name" 
       :cover="mv?.cover" 
       :id="mv?.id"
      :playCount="mv?.playCount" 
      :allowPreview="false" 
      :duration="mv?.duration"></MvCard>
    </div>
    <div class="loadmore" ref="loadMore">正在加载喵</div>
  </div>
</template>
<script setup>
import { search } from '@/api/search';
import { getSongDetial } from '@/api/song';
import AlbumCard from '@/components/AlbumCard.vue';
import ArtistCard from '@/components/ArtistCard.vue';
import MvCard from '@/components/MvCard.vue';
import PlaylistCard from '@/components/PlaylistCard.vue';
import Song from '@/components/Song.vue';
import { player } from '@/main';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const loadMore = ref(null)
let renderType = ref("")
let keyword = ref("")
let typeMap = {
  song: { name: "单曲", typeId: 1 },
  playlist: { name: "歌单", typeId: 1000 },
  album: { name: "专辑", typeId: 10 },
  mv: { name: "视频", typeId: 1000 },
  artist: { name: "艺人", typeId: 100 },
  user: { name: "用户", typeId: 1002 },
}
let hasMore = true
let renderData = ref({
  type: "",
  data: []
})
let page = 1
let loading = false
function searchSong(key) {
  loading = true
  search(1, key, 30, page++).then(data => {
    hasMore = data?.result?.hasMore
    let ids = data?.result?.songs?.map(i => i.id)
    getSongDetial(ids).then(data => {
      renderData.value.data.push(...data?.songs)
      loading = false
    })
  })
}
function searchAlbum(key) {
  loading = true
  search(10, key, 30, page++).then(data => {
    let count = data?.result?.albumCount
    if (renderData.value.data.length < count) {
      hasMore = true
    }
    else {
      hasMore = false
    }
    renderData.value.data.push(...data?.result?.albums)
    loading = false
  })
}
function searchPlaylist(key) {
  loading = true
  search(1000, key, 30, page++).then(data => {
    hasMore = data?.result?.hasMore
    renderData.value.data.push(...data?.result?.playlists)
    loading = false
  })
}
function searchArtist(key){
  loading = true
  search(100, key, 30, page++).then(data => {
    console.log(data)
    hasMore = data?.result?.hasMore
    renderData.value.data.push(...data?.result?.artists)
    loading = false
  })
}
function searchVideo(key){
   loading = true
  search(1004, key, 30, page++).then(data => {
    console.log(data)
    hasMore = data?.result?.hasMore
    renderData.value.data.push(...data?.result?.mvs)
    loading = false
  })
}
function load(type, key) {
  switch (type) {
    case "song":
      renderData.value.type = "song"
      searchSong(key)
      break
    case "album":
      renderData.value.type = "album"
      searchAlbum(key)
      break
    case "playlist":
      renderData.value.type = "playlist"
      searchPlaylist(key)
      break
    case "artist":
      renderData.value.type = "artist"
      searchArtist(key)
      break
    case "mv":
      renderData.value.type = "mv"
      searchVideo(key)
      break
  }
}

onMounted(() => {
  const { type, key } = useRoute().params
  renderType.value = type
  keyword.value = key

  let ob = new IntersectionObserver((entries) => {
    entries.forEach(enter => {
      if (enter.isIntersecting && hasMore && !loading) {
        load(type, key)
      }
      else if (!hasMore) {
        loadMore.value && ob.unobserve(loadMore.value)
        ob.disconnect()
        ob = null
        loadMore.value?.remove()
      }
    })
  })

  if (loadMore.value) {
    ob.observe(loadMore.value)
  }

})

function playTracks(id) {
  let source = { type: 'search_song', id: null }
  player.playNewList(id, renderData.value.data.map(o => ({
    id: o.id,
    source
  })), source)
}
</script>
<style scoped>
.page {
  padding-top: 2rem;
  gap: 1.5rem;
}

.block {
  width: 93%;
  margin-bottom: 8rem;
}

.tracks {
  display: flex;
  flex-direction: column;

}

.loadmore {
  height: 5rem;
  width: 93%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>