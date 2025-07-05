<template>
  <div class="page search">
    <h2 class="pt"><span style="color: var(--strong);">{{ key }}</span>的搜索结果</h2>
    <div class="g2">
      <div class="area album" v-if="data?.result?.album" :key="key">
        <h2 class="ti">
          专辑
          <RouterLink class="more" :to="{ name: 'SearchDetail', params: { key: key,type:'album' } }" v-if="key">查看更多</RouterLink>
        </h2>
        <div class="grid3">
          <AlbumCard v-for="album in data?.result?.album?.albums?.slice(0, 3)" :name="album?.name"
            :cover="album?.picUrl" :id="album?.id" :size="album?.size" :date="album?.publishTime" @playall="(id) => {
              player.playAlbum(null, null, { type: 'album', id: album?.id }, true)
            }"></AlbumCard>
        </div>
      </div>
      <div class="area artist" v-if="data?.result?.artist" :key="key">
        <h2 class="ti">
          艺人

          <RouterLink class="more" :to="{ name: 'SearchDetail', params: { key: key,type:'artist' } }" v-if="key">查看更多</RouterLink>
        </h2>
        <div class="grid3">
          <ArtistCard v-for="artist in data?.result?.artist?.artists?.slice(0, 3)" :name="artist?.name" :id="artist?.id"
            :cover="artist?.picUrl"></ArtistCard>
        </div>
      </div>
    </div>
    <div class="g1" :key="key">
      <h2 class="ti">
        单曲
        <RouterLink class="more" :to="{ name: 'SearchDetail', params:{key:key,type:'song'} }" v-if="key">查看更多</RouterLink>
      </h2>
      <div class="g-shell-4">
          <Song_Small v-for="song in songs?.slice(0, (deviceScreenSize < 1 ? 12 : 16))" :cover="song?.al?.picUrl" :name="song?.name"
            :artist="song?.ar" :key="song?.id" :id="song.id" class="song" @play="playTracks"></Song_Small>
        </div>
    </div>

    <div class="g1" v-if="data?.result?.playList?.playLists">
      <h2 class="ti">
        歌单

        <RouterLink class="more" :to="{ name: 'SearchDetail',params: { key: key, type: 'playlist' } }" v-if="key">查看更多</RouterLink>
      </h2>
      <div class="g-shell-6">
        <PlaylistCard v-for="pl in data?.result?.playList?.playLists?.slice(0, (deviceScreenSize < 1 ? 5 : 6))" :name="pl?.name"
          :cover="pl?.coverImgUrl" :id="pl?.id"
          @playall="(id) => player.playPlaylist(null, null, { type: 'playlist', id: pl?.id }, true)">
        </PlaylistCard>
      </div>
    </div>

    <div class="g1" v-if="mvs">
      <h2 class="ti">
        视频
        <RouterLink class="more" :to="{ name: 'SearchDetail', params: { key: key, type: 'mv' } }" v-if="key">查看更多</RouterLink>
      </h2>
      <div class="g-shell-5">
        <MvCard v-for="mv in mvs.slice(0, (deviceScreenSize < 1 ? 4 : 5))" :name="mv?.name" :cover="mv?.cover" :id="mv?.id"
          :playCount="mv?.playCount" :allowPreview="false" :duration="mv?.duration"></MvCard>
      </div>
    </div>
    <div class="g1 " v-if="data?.result?.user">
      <h2 class="ti">用户</h2>
      <div class="users g-shell-6" style="width: 100%;">
<UserCard v-for="user in data?.result?.user?.users.slice(0, (deviceScreenSize < 1 ? 5 : 6))"
      :name="user?.nickname"
      :avatar="user?.avatarUrl"
      :id="user?.userId"
      :sign="user?.signature"
      ></UserCard>  
      </div>
      
    </div>
  </div>
</template>
<script setup>
import { search } from "@/api/search";
import ArtistCard from "@/components/ArtistCard.vue";
import PlaylistCard from "@/components/PlaylistCard.vue";
import AlbumCard from "@/components/AlbumCard.vue";
import Song_Small from "@/components/Song_Small.vue";
import MvCard from "@/components/MvCard.vue";
import UserCard from "@/components/UserCard.vue";
import { RouterLink, useRoute } from "vue-router";
import { player } from "@/main";
import { ref } from "vue";
import { getSongDetial } from "@/api/song";
import { onMounted } from "vue";
import { onActivated,computed } from "vue";
import { store } from "@/store";

const deviceScreenSize = computed(() => {
  return store.state.deviceScreenSize
})
const key = ref("")
const data = ref({})
const songs = ref([])
const mvs = ref([])
function load(key) {
  search(1018, key, 30, 1).then(composition => {
    data.value = composition
  })
  search(1, key, 16, 1).then(data => {
    let songIds = data?.result?.songs?.map(i => i.id)
    getSongDetial(songIds).then(tracks => {
      songs.value = tracks?.songs
    })
  })
  search(1004, key, 5, 1).then(data => {
    mvs.value = data?.result?.mvs
  })
}
onMounted(() => {
  let keyw = useRoute().params?.key
  console.log(keyw)
  key.value = keyw
  load(keyw)
})
onActivated(() => {
  let keyw = useRoute().params?.key
  if (keyw !== key.value) {
    key.value = keyw
    load(keyw)
  }
})
function playTracks(id) {
  let source = { type: 'search_recommend_songs_16', id: null }
  player.playNewList(id, songs.value.slice(0, 16).map(i => { return { id: i.id, source } }, source))
}
function toDetail(type,key){
  router
}
</script>
<style scoped>
.search {
  --page-width: 93%;
  width:100%;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ti {
  width: 100%;
  margin: 0 auto 1rem 0;
  display: flex;
  flex-direction: row;
  align-items: end;
  font-size: 1.7rem;
}

.ti .more {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  opacity: var(--text-opacity-4);
  margin: 0 0 0 auto;
}

.g2 {
  width: var(--page-width);
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.g2 .area {
  width: 45%;
  position: relative;
}

.grid3 {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.grid4 {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.4rem;
  flex-shrink: 0;
}

.shell {
  width: 100%;
  height: 17rem;
  position: relative;
}

.g1 {
  width: var(--page-width);
  position: relative;
  height: fit-content;
}

.g1:last-child {
  margin-bottom: 7rem;
}

.rows {
  height: 100%;
  width: 100%;
  margin-top: auto;
  margin-bottom: 0;
}
</style>
