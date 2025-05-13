<template>
  <div class="page">
    <ImportPlaylist @close="showImporter = false" v-if="showImporter"></ImportPlaylist>
    <div class="head">
      <div
        class="favorite"
        @click.stop="
          this.$router.push({ name: 'Playlist', params: { id: playlistCreate[0]?.id } })
        "
      >
        <img :src="playlistCreate[0]?.coverImgUrl" alt="" class="cover"/>
        <div class="favorite-content">
          <h1>我喜欢的音乐</h1>
          <span>{{  playlistCreate[0]?.trackCount }}首红心</span>
        </div>
        <button class="play-button">
          <Icon icon="famicons:play" class="icon" />
        </button>
      </div>

      <div class="recent">
        <h3>最近常听</h3>
        <div class="songs">
          <Song_Small
            v-for="songInfo in recent?.slice(0,(deviceScreenSize < 1 ? 3 : 6))"
            :name="songInfo?.song?.name"
            :cover="songInfo?.song?.al?.picUrl"
            :artist="songInfo?.song?.ar"
            :id="songInfo?.song?.id"
            @play="(id)=>{player.playInsertTracks(id,[{id:id,source:{type:'insert',id:id}}],{type:'insert',id:id})}"
          ></Song_Small>
        </div>
      </div>
    </div>

    <div class="selector" ref="totop">
      <select
        name=""
        id=""
        class="select"
        @click="
          ($event) => {
            if ($event.target !== view) {
              view = $event.target.value
            }
          }
        "
        :class="{ hl: view.split('_')[0] === 'playlist' }"
      >
        <option value="playlist_all" selected>全部歌单</option>
        <option value="playlist_create">我创建的歌单</option>
        <option value="playlist_collect">我收藏的歌单</option>
      </select>
      <button @click="view = 'album_all'" :class="{ hl: view === 'album_all' }">专辑</button>
      <button @click="view = 'mv_all'" :class="{ hl: view === 'mv_all' }">视频</button>
      <button @click="view = 'pod_all'" :class="{ hl: view === 'pod_all' }">播客</button>
      <button @click="view = 'recent_all'" :class="{ hl: view === 'recent_all' }">最近</button>
    </div>

    <div class="viewer">
      <div class="playlist_all grid g-shell-6" v-if="view === 'playlist_all'">
        <PlaylistCard
          v-for="pl in [...playlistCreate?.slice(1), ...playlistCollect]"
          :name="pl.name"
          :cover="pl.coverImgUrl"
          :id="pl.id"
          @playall="player.playPlaylist(null,null,{type:'playlist',id:pl.id},true)"
        >
        </PlaylistCard>
      </div>
      <div class="playlist_collect grid g-shell-6" v-if="view === 'playlist_collect'">
        <PlaylistCard
          v-for="pl in playlistCollect"
          :name="pl.name"
          :cover="pl.coverImgUrl"
          :id="pl.id"
          @playall="player.playPlaylist(null,null,{type:'playlist',id:pl.id},true)"
        >
        </PlaylistCard>
      </div>
      <div class="playlist_create grid g-shell-6" v-if="view === 'playlist_create'">
        <PlaylistCard
          v-for="pl in playlistCreate?.slice(1)"
          :name="pl.name"
          :cover="pl.coverImgUrl"
          :id="pl.id"
           @playall="player.playPlaylist(null,null,{type:'playlist',id:pl.id},true)"
        >
        </PlaylistCard>
      </div>
      <div class="album_all grid g-shell-6" v-if="view === 'album_all'">
        <AlbumCard
          v-for="al in albums?.data"
          :name="al.name"
          :size="al.size"
          :cover="al.picUrl"
          :id="al.id"
          :hideInfo="true"
          @playall="player.playPlaylist(null,null,{type:'playlist',id:al.id},true)"
        ></AlbumCard>
      </div>
      <div class="mv_all grid g-shell-5" v-if="view === 'mv_all'">
        <MvCard
          v-for="mv in mvs?.data"
          :cover="mv.coverUrl"
          :name="mv.title"
          :duration="mv.durationms"
          :id="mv.vid"
        ></MvCard>
      </div>
      <div class="recent-play-list" v-if="view === 'recent_all'">
        <Song 
        v-for="(song,index) in recentAll"
        :trackDetial="{
            name: song.data.name,
            cover: song.data.al.picUrl,
            artist: song.data.ar,
            album: song.data.al,
            id: song.data.id,
            duration: song.data.dt,
            tns: song.data.tns || null,
            alia: song.data.alia,
            mv: song.data.mv
        }"
        :index="index"
        :source="{type:'recent',id:''}"
        @play="playRecent">
        </Song>
      </div>
    </div>
  </div>
</template>
<script setup>
import PlaylistCard from '@/components/PlaylistCard.vue'
import AlbumCard from '@/components/AlbumCard.vue'
import MvCard from '@/components/MvCard.vue'
import ImportPlaylist from '@/components/windows/ImportPlaylist.vue'
import { Icon } from '@iconify/vue'
import Song_Small from '@/components/Song_Small.vue'
import {playlistCollect,playlistCreate,mvs,albums,recent,recentAll,load} from '.'
import { watch } from 'vue'
import Song from '@/components/Song.vue'
import { player } from '@/main'
import { computed,ref } from 'vue'
import { store } from '@/store'
const profile = computed(()=>{
  return store.state.profile
})
const deviceScreenSize = computed(() => {
  return store.state.deviceScreenSize
})
const showImporter = ref(false)
const view = ref("playlist_all")
watch(profile,()=>{
  if(profile.value?.userId){
    load(profile.value.userId).then(()=>{
    })
  }
},{immediate:true})
function playRecent(id){
  let source = {type:'recent',id:''}
  const listIds = recentAll.value.map(s=>{return {id:s?.data?.id,source}})
  player.playNewList(id,listIds,{type:'recent',id:''},source)
}
</script>
<style scoped>
@media screen and (min-width:1301px) {
  .recent .songs{
    grid-template-columns: repeat(2, 1fr) !important;
    grid-template-rows: repeat(3, 1fr) !important;
  }
}
.page {
  gap: 2rem;

}
.shell:first-child {
  margin-top: 2rem;
}
.shell:last-child {
  margin-bottom: 5rem;
}
.shell {
  display: flex;
  flex-direction: column;
  width: 90%;
  height: fit-content;
}
.shell .area {
  width: 100%;
  height: fit-content;
}

.selector {
  width: 90%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  color: var(--text-o-3);
  height: 2.5rem;
}
.selector .select {
  height: inherit;
  padding: 0.5rem 0.8rem;
  font-weight: 600;
  border: none;
  background: var(--ui);
  outline: none;
  font-size: 1.1rem;
  border-radius: var(--br-2);
  color: inherit;
}
.selector button {
  width: fit-content;
  height: inherit;
  color: inherit;
  padding: 0.5rem 0.8rem;
  font-weight: 600;
  border: none;
  font-size: 1.1rem;
  border-radius: var(--br-2);
  background: var(--ui);
}
.selector * {
  transition: 0.1s;
}
.selector *:hover {
  background: var(--ui-dark);
}

.head {
  width: 90%;
  height: 17rem;
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-top: 1rem;
}
.favorite {
  position: relative;
  width: 30rem;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  color: var(--text);
  box-shadow: var(--shadow-surround);
  border-radius: var(--br-3);
  overflow: hidden;
  background-color: var(--component-diff);
}

.favorite .cover {
  height: 12rem;
  width: 12rem;
  border-radius: var(--br-2);
  margin-left: 2rem;
}
.favorite .favorite-content {
  margin: 3rem auto auto 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: var(--text-o-2);
}
.favorite .play-button {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  flex-direction: row;
  background: var(--strong-light);
  border-radius: 50%;
  border: none;
  position: absolute;
  align-items: center;
  justify-content: center;
  right: 2rem;
  bottom: 2rem;
  color: #fff;
}
.favorite .play-button .icon {
  width: 2em;
  height: 2em;
}
.recent {
  flex: 1;
  box-shadow: var(--shadow-surround);
  border-radius: var(--br-3);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--component-diff);
}
.recent .songs {
  margin-top: 1rem;
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
}
.hl {
  background: var(--strong-light) !important;
  color: #fff !important;
}
.viewer {
  width: 90%;
}
.viewer .grid {
  width: 100%;
  
}
</style>
