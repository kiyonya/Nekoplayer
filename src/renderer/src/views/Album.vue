<template>
  <div class="album page">
    <HeadInfo class="head" :cover="info.picUrl" :name="info.name" :subtitle="info.artist ? info.artist.name : null"
      @subtitleclick="
        () => {
          $router.push({ name: 'Artist', params: { id: info.artist.id } })
        }
      " :maininfo="`最后更新于${getDate(info.publishTime)} · ${info.size}首歌`" :info="`©${info.company || null}`"
      :desc="info.description" @descClick="showDesc = true"
      @playall="player.playAlbum(null, null, { type: 'album', id: id }, true)"
      @addlist="player.insertAlbumCandy(pid, { type: 'album', id: id })"></HeadInfo>

    <div class="tracks">
      <div class="section" v-for="(value, key, index) in tracks">
        <span class="disc" :class="index >= 1 ? 'margin' : ''"><span>Disc {{ key }}</span></span>
        <Song_NoCover v-for="(song, index) in value" :trackDetial="{
          name: song.name,
          cover: song.al.picUrl,
          artist: song.ar,
          album: song.al,
          id: song.id,
          duration: song.dt,
          tns: song.tns || null,
          alia: song.alia,
          mv: song.mv
        }" :source="{
            type: 'album',
            id:id,
          }" :index="index" @play="playTrack"></Song_NoCover>
      </div>
    </div>

    <ModalWindow :mask="false" @close="showDesc = false" v-if="showDesc">
      <div class="album-desc">
        <div class="info">
          <img :src="info.picUrl" alt="">
          <div class="detail">
            <h2>{{ info.name }}</h2>
            <ArtistNameGroup :array="info.artists"></ArtistNameGroup>
          </div>
        </div>
        <div class="content">
          <p v-html="info.description.replace(/\n/gi, '<br>')"></p>
        </div>

      </div>
    </ModalWindow>

  </div>
</template>
<script setup>
import * as req_album from '../api/album'
import Song_NoCover from '@/components/Song_NoCover.vue'
import { getDate } from '@/utils/timers'
import { ref,onMounted,onUnmounted } from 'vue'
import ArtistNameGroup from '@/components/ArtistNameGroup.vue'
import HeadInfo from '@/components/HeadInfo.vue'
import { player } from '@/main'
import ModalWindow from '@/components/windows/ModalWindow.vue'

const props = defineProps(['id'])
const info = ref({})
const tracks = ref({})
const showDesc = ref(false)
const loadAlbum = async (alid) => {
  try {
    const al = await req_album.getAlbum(alid)
    info.value = al.album
    const res = {}
    al.songs.forEach((song) => {
      const cd = song.cd
      if (!res[cd]) {
        res[cd] = []
      }
      res[cd].push(song)
    })
    tracks.value = res
  } catch (error) {
    console.error('Failed to load album:', error)
  }
}
const playTrack = (id) => {
  player.playAlbum(id, null, { type: 'album', id: props.id })
}
onMounted(() => {
  Promise.resolve().then(loadAlbum(props.id))
})
onUnmounted(()=>{
  info.value = null
  tracks.value = null
  window.webFrame.clearCache()
})
</script>
<style scoped>
.head {
  margin-top: 2rem;
}

.disc {
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
  padding-bottom: 0.2rem;
}

.margin {
  margin-top: 1cqw;
}

.disc span {
  margin-left: 1cqw;
  font-size: 1cqw;
  font-weight: 600;
  opacity: var(--text-opacity-3);
}

.tracks {
  width: 95%;
  display: flex;
  flex-direction: column;
  scroll-snap-type: proximity;
  margin-bottom: 5rem;
}

.album-top {
  position: relative;
  margin-top: 3rem;
  margin-bottom: 1.8rem;
  width: 93%;
  height: 18rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.cover {
  height: 100%;
  aspect-ratio: 1/1;
  position: relative;
  display: flex;
  justify-content: center;
}

.cover .main {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 5%;
}

.cover .blur {
  width: 95%;
  aspect-ratio: 1/1;
  position: absolute;
  border-radius: 5%;
  z-index: -1;
  filter: blur(15px);
  bottom: -0.8rem;
  opacity: 0.4;
}



.desc {
  width: 50vw;
  height: fit-content;
  display: -webkit-inline-box;
  margin: auto auto auto 0px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  text-overflow: ellipsis;
  opacity: var(--text-opacity-4);
  font-size: 0.9rem;
}

.desc:hover {
  text-decoration: underline;
}

.btns {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin: auto auto 0px 0px;
  width: 100%;
}

.btns button {
  height: fit-content;
  width: fit-content;
  border: none;
  background: var(--app-theme-component);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 5px;
  color: var(--text-color);
  font-size: 0.9rem;

  gap: 0.2rem;
  box-shadow: 1px 2px 5px #00000015;
}

.btns button:first-child {
  padding: 0.4rem 1rem;
  background: var(--app-theme-strong-background);
  font-weight: 600;
}

.btns button:last-child {
  margin: auto 0px auto auto;
}

.btns button .icon {
  height: 2.2cqh;
  aspect-ratio: 1/1;
}

.artist-name {
  color: var(--app-theme-strong);
  font-weight: 600;
  font-size: 1.5rem;
  margin-top: 0.3rem;
}

.album-desc{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;

  .content{

    width: 30rem;
    height: 18rem;
    overflow-y: auto;
    color: var(--text-o-1);
  }

  .info{
    display: flex;
    flex-direction: row;
    color: var(--text);
    gap: 0.5rem;
    align-items: center;

    img{
      width: 4rem;
      height: 4rem;
      object-fit: cover;
      border-radius: var(--br-1);
    }

    .detail{
      color: inherit;
      display: flex;
      flex-direction: column;
      flex: 1;
      height: fit-content;

      h2{
        color: var(--text);
        font-size: 1.2rem;
        font-weight: 600;
        max-width: 25rem;
      }
    }
  }
}
</style>
