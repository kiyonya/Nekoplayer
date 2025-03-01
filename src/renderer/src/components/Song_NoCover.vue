<template>
  <div
    class="song-nc"
    @dblclick="play"
    :class="this.$store.state.musicInfo.id == trackDetial.id ? 'onplay' : ''"
  >
    <div class="serial">{{ (index + 1).toString().padStart(2, '0') }}</div>
    <button class="play-btn" @click="play">
      <Icon icon="fluent:play-16-filled" class="icon" />
    </button>
    <span class="name text-limit"
      >{{ trackDetial.name}}<span class="trans-name" v-if="trackDetial.tns?.length">({{ trackDetial.tns[0] }})</span></span
    >
    <div class="artist">
      <ArtistNameGroup :array="trackDetial.artist"></ArtistNameGroup>
    </div>
    <div class="right">
      <Icon icon="fluent:video-clip-16-regular" class="icon" v-if="trackDetial?.mv" @click="$router.push({name:'MV',params:{id:trackDetial?.mv}})"/>
      <span class="duration">{{ this.mmss(trackDetial.duration) }}</span>
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
import { mmss } from '@/utils/timers'
import ArtistNameGroup from './ArtistNameGroup.vue'
import { Icon } from '@iconify/vue'
import { player } from '@/main'
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue'
export default {
  components: {
    ArtistNameGroup,
    Icon,
    ContextMenu
  },
  props: {
    trackDetial: {
      type: Object,
      default: {
        cover: '',
        name: '音乐',
        artist: [],
        album: [],
        duration: 0,
        id: 0,
        tns: null,
        alia: null
      }
    },
    source: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  methods: {
    mmss,
    play(){
      this.$emit('play',this.trackDetial?.id)
    },
    contextMenuSelected(item){
      const act = item?.act
      const actions = {
        play:()=>{
          this.play()
        },
        addnext:()=>{
          player.addTrackToNext(this.trackDetial?.id,this.source)
        },
        browser:()=>{
          const url = `https://music.163.com/#/song?id=${this.trackDetial?.id}`
          window.electron.ipcRenderer.send('app:openWebView',url)
        },
        copylink:()=>{
          const url = `https://music.163.com/#/song?id=${this.trackDetial?.id}`
          window.navigator.clipboard.writeText(url)
          showMessageNotification("已复制")
        },
        copyid:()=>{
          window.navigator.clipboard.writeText(this.trackDetial?.id)
          showMessageNotification("已复制")
        }
      }
      if(actions[act]){
        actions[act]()
      }
    }
  },
  emits:['play']
}
</script>
<style scoped>
.song-nc {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-color);
  border-radius: 5px;
  position: relative;
}

.song-nc:hover {
  background-color: var(--hover);
  box-shadow: 1px 1px 10px #00000014;
}

.song-nc:hover {
  .serial {
    display: none;
  }

  .play-btn {
    display: flex;
  }
}

.serial {
  font-size: 0.9rem;
  width: 1.5rem;
  font-weight: 600;
  margin-left: 1.5rem;
  opacity: 0.7;
  color: var(--text);
  text-align: center;
}

.play-btn {
  width: 1.5rem;
  margin-left: 1.5rem;
  opacity: 0.7;
  display: none;
  color: inherit;
  background-color: transparent;
  border: none;

  align-items: center;
  justify-content: center;
}
.icon {
  width: 1.6rem;
  height: 1.6rem;
  color: inherit;
}
.name {
  font-size: 1rem;
  font-weight: 600;
  opacity: var(--text-o-2);
  max-width: 30vw;
  margin-left: 1.2cqw;
}

.artist-name-ref::before {
  content: '/';
  width: 0;
}

.artist {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-o-2);
  display: block;
  position: absolute;
  left: 45%;
  width: 310px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
}

.time {
  font-size: 1rem;
  display: block;
  position: absolute;
  right: 1rem;
  opacity: 0.85;
}

.act {
  position: absolute;
  width: fit-content;
  right: 2rem;
  display: flex;
  justify-content: right;
  gap: 2rem;
}

.act img {
  width: 1.5rem;
  opacity: 0.8;
}
.trans-name {
  opacity: 0.5;
  margin-left: 0.5rem;
}
.right{
  width: fit-content;
  display: flex;
  flex-direction: row;
  position: absolute;
  right: 3rem;
  align-items: center;
  justify-content: end;
  color: var(--text-o-2);
  gap: 0.6rem;
}
.right .icon{
  width: 1.5em;
  height: 1.5em;
  color: inherit;
}
.right .duration{
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
}
</style>
