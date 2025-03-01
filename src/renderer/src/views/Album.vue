<template>
  <div class="album page">
    <HeadInfo
      class="head"
      :cover="info.picUrl"
      :name="info.name"
      :subtitle="info.artist ? info.artist.name : null"
      @subtitleclick="
        () => {
          this.$router.push({ name: 'Artist', params: { id: info.artist.id } })
        }
      "
      :maininfo="`最后更新于${getDate(info.publishTime)} · ${info.size}首歌`"
      :info="`©${info.company || null}`"
      :desc="info.description"
      @descClick="showDesc = true"
      @playall="player.playAlbum(null,null,{type:'album',id:id},true)"
      @addlist="player.insertAlbumCandy(pid,{type:'album',id:id})"
    ></HeadInfo>

    <div class="tracks">
      <div class="section" v-for="(value, key, index) in tracks">
        <span class="disc" :class="index >= 1 ? 'margin' : ''"
          ><span>Disc {{ key }}</span></span
        >
        <Song_NoCover
          v-for="(song, index) in value"
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
          :source="{
            type: 'album',
            id: this.id,
          }"
          :index="index"
          @play="playTrack"
        ></Song_NoCover>
      </div>
    </div>

    <Window_Description
      v-if="showDesc"
      @close="showDesc = false"
      :title="info.name"
      :ctx="[{ ti: '专辑描述', txt: info.description }]"
      :subname="info.artist.name"
    ></Window_Description>
  </div>
</template>
<script>
import * as req_album from '../api/album'
import Song_NoCover from '@/components/Song_NoCover.vue'
import { getDate } from '@/utils/timers'
import Window_Description from '@/components/Window_Description.vue'
import { ref } from 'vue'
import ArtistNameGroup from '@/components/ArtistNameGroup.vue'
import HeadInfo from '@/components/HeadInfo.vue'
import { player } from '@/main'

export default {
  name: 'Album',
  components: { Song_NoCover, Window_Description, ArtistNameGroup, HeadInfo },
  data() {
    return {
      info: ref({}),
      tracks: ref({}),
      showDesc: false,
      player
    }
  },
  methods: {
    async loadAlbum(alid) {
      const al = await req_album.getAlbum(alid)
      this.info = al.album
      const res = {}
      al.songs.forEach((song) => {
        const cd = song.cd
        if (!res[cd]) {
          res[cd] = new Array()
        }
        res[cd].push(song)
      })
      this.tracks = res
      console.log(res)
    },
    getDate,
    playTrack(id){
      player.playAlbum(id,null,{type:'album',id:this.id})
    }
  },
  created() {
    this.loadAlbum(this.id)
  },
  props: ['id']
}
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

.album-detial {
  position: relative;
  width: 50%;
  height: 100%;
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  flex: 1;
}

.album-detial .name {
  font-size: 2.3rem;
}

.album-detial .info {
  font-size: 1.3rem;
  opacity: var(--text-opacity-1);
  margin-top: 1.8rem;
}
.album-detial .company {
  font-size: 1rem;
  opacity: var(--text-opacity-4);
}

.album-detial .tags {
  display: flex;
  flex-direction: row;
  gap: 0.9rem;
  font-size: 0.8rem;
}

.album-detial .tags span {
  background: var(--app-theme-component);
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
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
</style>
