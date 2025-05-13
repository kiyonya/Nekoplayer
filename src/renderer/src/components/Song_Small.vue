<template>
  <div
    class="re-song"
    @click="play"
    :class="this.$store.state.musicInfo.id == this.id ? 'onplay' : ''"
  >
    <img :src="this.cover + '?param=75y75'" alt="" class="music-cover" />
    <div class="song-info">
      <p class="song-name">{{ this.name }}</p>
      <ArtistNameGroup :array="this.artist" style="max-width: 12rem" class="artist"></ArtistNameGroup>
    </div>

    <ContextMenu :menu="[
      {label:'播放',act:'play',icon:'ion:play'},
      {label:'添加到下一首',act:'addnext',icon:'material-symbols-light:add-notes'},
      'hr',
      {label:'喜欢',act:'like',icon:'ri:hearts-fill'},
      {label:'收藏',act:'collect',icon:'fluent:collections-20-filled'},
      {label:'复制链接',act:'copylink',icon:'tabler:link'},
      {label:'复制ID',act:'copyid',icon:'tabler:number'},
      {label:'浏览器打开',act:'browser',icon:'mdi:web'},
      ]" @select="contextMenuSelected">
      </ContextMenu>
  </div>
</template>
<script>
import ArtistNameGroup from './ArtistNameGroup.vue'
import ContextMenu from './ContextMenu/ContextMenu.vue';
export default {
  components: {
    ArtistNameGroup,ContextMenu
  },
  data() {
    return {}
  },
  emits:['play'],
  methods: {
    play() {
     this.$emit("play",this.id)
    },
    contextMenuSelected(item){
      const act = item?.act
      const actions = {
        play:()=>{
          this.play()
        },
        browser:()=>{
          const url = `https://music.163.com/#/song?id=${this.id}`
          window.electron.ipcRenderer.send('app:openWebView',url)
        },
        copylink:()=>{
          const url = `https://music.163.com/#/song?id=${this.id}`
          window.navigator.clipboard.writeText(url)
          showMessageNotification("已复制")
        },
        copyid:()=>{
          window.navigator.clipboard.writeText(this.id)
          showMessageNotification("已复制")
        }
      }
      if(actions[act]){
        actions[act]()
      }
    },
  },
  props: ['cover', 'name', 'artist', 'id']
}
</script>
<style scoped>
.re-song {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 5px;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  scroll-snap-align: start;
}
.onplay{
  outline: 5px solid var(--strong-light) !important;
}
.re-song:hover {
  box-shadow: 1px 1px 10px #00000013;
  background-color: var(--hover);
  outline: 5px solid var(--hover);
}

.re-song .music-cover {
  height: 3rem;
  aspect-ratio: 1/1;
  object-fit: cover;
  margin-right: 0.5rem;
  border-radius: 5px;
}

.re-song .song-info {
  display: flex;
  flex-direction: column;
}

.re-song .song-name {
  font-size: 1.05rem;
  font-weight: 600;
  opacity: var(--text-opacity-1);
  width: 11.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.re-song .song-artist {
  width: 11.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  opacity: var(--text-opacity-2);
  letter-spacing: -0.03rem;
}

.re-song .play-btn {
  width: 1.65rem;
  height: 1.65rem;
  margin: auto 4% auto auto;
  opacity: var(--color-comp-opacity);
  fill: var(--color-comp);
}
.artist{
  font-size: 0.9rem;
  color: var(--text-o-4);
}
</style>
