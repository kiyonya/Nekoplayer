<template>
  <div class="page">
    <div class="head area">
      <div class="avatar-shell" style="opacity: 0;">
        <img :src="resize(artistDetial?.artist?.avatar, 500)" alt="" class="main-avatar"
          @load="($event) => { $event.target.parentElement.style.opacity = '1' }" />
        <img :src="resize(artistDetial?.artist?.avatar, 500)" alt="" class="blur-avatar" />
      </div>
      <div class="artist-detial">
        <h1 class="name">{{ artistDetial?.artist?.name }}</h1>
        <span class="count">
          <span>{{ artistDetial?.artist?.musicSize }}单曲</span>
          <span>{{ artistDetial?.artist?.albumSize }}专辑</span>
          <span>{{ artistDetial?.artist?.mvSize }}音乐视频</span>
        </span>
        <p class="desc" @click="showDesc = true">{{ artistDetial?.artist?.briefDesc }}</p>
      </div>
    </div>
    <div class="songs area">
      <div class="latest-album">
        <h2 class="subtitle">最新专辑</h2>
        <AlbumCard :name="lastestAlbum?.name" :size="lastestAlbum?.size" :cover="lastestAlbum?.picUrl"
          :id="lastestAlbum?.id" :date="lastestAlbum?.publishTime" :hideInfo="true"
          @playall="player.playAlbum(null, null, { type: 'album', id: lastestAlbum?.id }, true)"
           style="width: 12rem;"></AlbumCard>
      </div>
      <div class="hot-songs" v-if="hotSongs.length > 0">
        <div class="subtitle"><span>热门歌曲</span>
          <button class="linkout"
            @click="$router.push({ name: 'ArtistWorks', query: { id: artistId, view: 'songs', name: artistDetial?.artist?.name } })">查看全部</button>
        </div>
        <div class="songs-grid">
          <Song_Small v-for="song in hotSongs?.slice(0, dss < 1 ? 12 : 16)" :name="song?.name" :cover="song?.al?.picUrl"
            :artist="song?.ar" :id="song?.id" :key="song?.id" @play="playHotSongs
            "></Song_Small>
        </div>
      </div>
    </div>
    <div class="area" v-if="albums.length > 0">
      <h1 class="title">专辑
        <button class="linkout"
          @click="$router.push({ name: 'ArtistWorks', query: { id: artistId, view: 'albums', name: artistDetial?.artist?.name } })">查看全部</button>
      </h1>
      <div class="albums-grid">
        <AlbumCard v-for="al in albums?.slice(1, dss < 1 ? 11 : 13)" :name="al.name" :size="al.size" :cover="al.picUrl"
          :id="al.id" :date="al.publishTime" :hideInfo="true" :key="al?.id" @playall="player.playAlbum(null, null, { type: 'album', id: al?.id }, true)
            "></AlbumCard>
      </div>
    </div>
    <div class="area" v-if="mvs.length > 0">
      <h1 class="title">MV
        <button class="linkout"
          @click="$router.push({ name: 'ArtistWorks', query: { id: artistId, view: 'mvs', name: artistDetial?.artist?.name } })">查看全部</button>
      </h1>
      <div class="mvs">
        <MvCard v-for="mv in mvs?.slice(0, dss < 1 ? 8 : 10)" :cover="mv?.imgurl16v9" :name="mv?.name"
          :duration="mv?.duration" :id="mv?.id"></MvCard>
      </div>
    </div>
    <ModalWindow v-if="showDesc" @close="showDesc = false" :title="artistDetial?.artist?.name">
      <div class="introduction">
        <p class="bref">{{ artistDetial?.artist?.briefDesc }}</p>
        <div class="intro" v-for="intro in fullDesc">
          <h2>{{ intro.ti }}</h2>
          <p v-html="intro.txt?.replaceAll('。', '。<br>').replaceAll('\n', '<br>')"></p>
        </div>

      </div>
    </ModalWindow>
  </div>
</template>
<script setup>
import { getArtistDetial, getMvs, getArtistAlbums, getDesc } from '@/api/artist'
import { resize } from '@/utils/imageProcess'
import { onBeforeUnmount, onDeactivated, ref } from 'vue'
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArtistBriefAndSongs } from '@/api/artist'
import { getSongDetial } from '@/api/song'
import Song_Small from '@/components/Song_Small.vue'
import AlbumCard from '@/components/AlbumCard.vue'
import MvCard from '@/components/MvCard.vue'
import ModalWindow from '@/components/windows/ModalWindow.vue'
import { computed } from 'vue'
import { store } from '@/store'
import { player } from '@/main'
let artistId = ref(0)
let artistDetial = ref({})
let lastestAlbum = ref({})
let albums = ref([])
let mvs = ref([])
let hotSongs = ref([])
let dss = computed(() => {
  return store.state.deviceScreenSize
})
const showDesc = ref(false)
const fullDesc = ref([])
function load(id) {
  getArtistDetial(id).then((data) => {
    artistDetial.value = data?.data
  })
  getArtistBriefAndSongs(id).then((data) => {
    const ids = data?.hotSongs?.map((i) => i.id)
    getSongDetial(ids).then((data) => {
      hotSongs.value = data?.songs
    })
  })
  getArtistAlbums(id, 1, 21).then((data) => {
    const al = data?.hotAlbums
    lastestAlbum.value = al[0]
    albums.value = al
  })
  getMvs(id, 1, 20).then((data) => {
    mvs.value = data?.mvs
  })

  getDesc(id).then(desc => {
    fullDesc.value = desc.introduction || []
  })
}
onBeforeMount(() => {
  let id = useRoute().params.id
  if (id) {
    artistId.value = id
    Promise.resolve().then(load(id))
  }
})
onBeforeUnmount(()=>{
artistId = null
artistDetial = null
lastestAlbum = null
albums = null
mvs = null
hotSongs.value.length = 0
hotSongs = null
webFrame?.clearCache()
})
function playHotSongs(id) {
  player.playArtist(id, null, { type: 'artist', id: artistId.value })
}
</script>
<style scoped>
@media screen and (min-width: 1301px) {
  .songs-grid {
    grid-template-columns: repeat(4, 1fr) !important;
  }

  .albums-grid {
    grid-template-columns: repeat(6, 1fr) !important;
  }

  .mvs {
    grid-template-columns: repeat(5, 1fr) !important;
  }
}

.page {
  gap: 2rem;
  overflow-x: hidden;
}

.title {
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head {
  width: 90%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  position: relative;
  margin-top: 2.3rem;
  gap: 2rem;
}

.avatar-shell {
  width: 12rem;
  aspect-ratio: 1/1;
  position: relative;
  display: flex;
  justify-content: center;
  transition: .2s;
  will-change: opacity;

  img {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    position: absolute;
  }

  .blur-avatar {
    z-index: 1;
    width: 95%;
    bottom: -0.5rem;
    filter: blur(20px) saturate(1.1);
    opacity: 0.2;
    transition: 0.3s;
  }

  .main-avatar {
    z-index: 2;
  }
}

.avatar-shell:hover,
.avatar-shell:focus {
  .blur-avatar {
    bottom: -1rem;
    opacity: 0.4;
  }
}

.artist-detial {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;

  .name {
    font-size: 3.2rem;
  }

  .count {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-o-4);
    display: flex;
    gap: 0.6rem;
  }

  .desc {
    width: 100%;
    font-size: 0.9rem;
    color: var(--text-o-3);
    text-overflow: ellipsis;
    display: -webkit-box;
    margin-top: 1rem;
    -webkit-line-clamp: 4;
    overflow: hidden;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .desc:hover {
    text-decoration: underline;
  }
}

.songs {
  width: 90%;
  height: 18rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;

  .subtitle {
    display: flex;
    flex-direction: row;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-o-1);
    align-items: center;
  }

  .latest-album {
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .hot-songs {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .songs-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 10px 10px;
    }
  }
}

.area {
  width: 90%;
}

.area:last-child {
  margin-bottom: 5rem;
}

.albums-grid {
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.mvs {
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.linkout {
  width: fit-content;
  height: fit-content;
  border: none;
  background: none;
  outline: none;
  border-radius: var(--br-1);
  padding: 0.3rem 0.5rem;
  color: var(--text-o-3);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: auto;
  margin-right: 0;
}

.linkout:hover {
  background: var(--hover);
}

.introduction {
  width: 37rem;
  max-height: 35rem;
  overflow-y: auto;
  color: var(--text-o-1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  line-height: 1.5em;


  .intro {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    h2 {
      width: 100%;
      border-bottom: 1.5px solid var(--border);
      padding-bottom: 0.8rem;
    }

    p {
      color: var(--text-o-2);
    }
  }

}
</style>
