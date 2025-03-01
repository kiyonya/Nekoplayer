<template>
  <div class="music-card" @click="player()">
    <ModalWindow v-if="showPropWindow" @close="showPropWindow = false">
      <h1>音频属性</h1>
      <div class="confirm-song">
        <img :src="img" alt="" class="cover" />
        <div class="info">
          <h2>{{ name }}</h2>
          <span>{{ artist?.join(' / ') }}</span>
        </div>
      </div>
      <div class="tips">
        <span>标题：{{ name }}</span>
        <span>专辑：{{ album }}</span>
        <span>艺术家：{{ artist?.join(' / ') }}</span>
        <span>目录：{{ path }}</span>
        <span>比特率：{{ Math.floor(br / 1000) }}kbps</span>
        <span>格式：{{ ext.substr(1) }}</span>
      </div>
    </ModalWindow>
    <ModalWindow v-if="confirmDelete" @close="confirmDelete = false">
      <h1>真的要删除吗Σヽ(ﾟД ﾟ; )ﾉ</h1>
      <div class="confirm-song">
        <img :src="img" alt="" class="cover" />
        <div class="info">
          <h2>{{ name }}</h2>
          <span>{{ artist?.join(' / ') }}</span>
        </div>
      </div>
      <span class="warn">这首歌将会消失很久，真的很久</span>
      <div class="row self-bottom to-right">
        <button class="warn-button" @click="$emit('deleteFile',path);confirmDelete=false">我知道我在做什么</button>
        <button class="n-button" @click="confirmDelete = false">取消</button>
      </div>
    </ModalWindow>
    <div class="default-cover" v-if="!img">
      <Icon icon="solar:music-note-broken" class="icon" />
    </div>
    <div class="cover" v-if="img">
      <img alt="" class="main lazyload" ref="img0" crossorigin="anonymous" :src="img" />
      <img alt="" class="blur lazyload" ref="img1" crossorigin="anonymous" :src="img" />
    </div>
    <div class="music-info">
      <span class="web-cover"  title="这张封面是联网获取的" v-if="webCover" ><Icon icon="ooui:network" class="icon" /></span>
      <div class="ctx">
        <span class="tip">{{ Math.floor(br / 1000) }}k</span>
        <span class="tip ext">{{ ext.substring(1).toUpperCase() }}</span>
      </div>
    </div>
    <div class="music-name">{{ name }}</div>

    <ContextMenu :menu="this.menu" @select="handleSelect"></ContextMenu>
  </div>
</template>
<script lang="js">
import { Icon } from '@iconify/vue'
import { displayFiles, localCoverCache, saveCoverCache } from '@/audioplay/localMusic'
import { play } from '@/audioplay/player'
import ContextMenu from './ContextMenu/ContextMenu.vue'
import ModalWindow from './windows/ModalWindow.vue'
import { openPath } from '@/main'
export default {
  data() {
    return {
      menu: [
        { label: '播放', act: 'play' },
        { label: '添加下一首' },
        'hr',
        { label: '属性', act: 'prop' },
        { label: '打开文件位置', act: 'opendir' },
        { label: '默认播放', act: 'defaultOpen' },
        "hr",
        { label: '从磁盘中删除', act: 'delete' }
      ],
      showPropWindow: false,
      confirmDelete: false,
      processedMusicInfo:null,
      webCover:localCoverCache.value[this.path],
      img:this.cover || localCoverCache.value[this.path]
      
    }
  },
  props: ['cover', 'name', 'artist', 'dir', 'path', 'br', 'ext', 'album', 'sampleRate'],
  methods: {
    player() {
      play(
        {
          id: this.path,
          action: 'playlocal',
          source: 'local',
          sourceId: this.dir + '@' + Date.now(),
          data: displayFiles.value,
          callback: (info)=>{
            if(!this.img && info?.cover){
              localCoverCache.value[this.path] = info?.cover
              this.img = info?.cover
              saveCoverCache()
            }
          }
        },
        true,
        true
      )
    },
    handleSelect(label) {
      let act = label.act
      if (act == 'play') {
        this.player()
      } else if (act == 'prop') {
        this.showPropWindow = true
      } else if (act == 'opendir') {
        openPath(this.dir)
      } else if (act == 'defaultOpen') {
        openPath(this.path)
      } else if (act == 'delete') {
        this.confirmDelete = true
      }
      else if(act == "hideInDir"){
        this.$emit("hideInDir",this.path)
      }
    },
    readCacheCover(){
      let cache = localCoverCache.value[this.path] 
      if(cache){
        console.log("联网封面")
        this.webCover = false
        return cache
      }
    }
  },
  components: {
    Icon,
    ContextMenu,
    ModalWindow
  },
}
</script>
<style scoped>
.music-card {
  width: 100%;
  height: fit-content;
  max-height: 10rem;
  aspect-ratio: 4 / 3;
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  flex-shrink: 0;
}
.music-card .cover {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 1px 1px 5px #00000010;
  filter: brightness(0.95);
  transition: 0.2s;
  position: relative;
  display: flex;
  justify-content: center;
}
.cover img {
  width: 100%;
  aspect-ratio: 1/1;
  position: absolute;
  border-radius: 5%;
}

.cover .blur {
  width: 95% !important;
  filter: blur(10px);
  z-index: -1;
  bottom: -0.2rem;
  opacity: 0.3;
}
.default-cover {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 1px 1px 8px #00000038;
  filter: brightness(0.95);
  transition: 0.2s;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  border: 2px solid #ffffff;
}
.default-cover .icon {
  width: 5rem;
  height: 5rem;
  color: black;
}
.music-name {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  opacity: var(--text-opacity-2);
  opacity: var(--text-opacity-1);
}
.music-info {
  width: 100%;
  aspect-ratio: 1/1;
  top: 0;
  z-index: 6;
  position: absolute;
  display: flex;
  align-items: end;
  justify-content: center;
}
.ctx {
  width: 90%;
  margin-bottom: 0.6rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.tip {
  color: #000;
  background: #ffffffe8;
  box-shadow: 0 0 3px #0000005d;
  border: 1px solid #fff;
  padding: 0 0.5rem;
  width: fit-content;
  height: fit-content;
  border-radius: 0.5rem;
  font-weight: 600;
}
.music-card:hover .blur {
  bottom: -0.6rem;
  opacity: 0.4;
  transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.music-card:hover .main {
  transform: scale(1.01);
  transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.confirm-song {
  width: calc(100% - 1rem);
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: var(--hover);
  padding: 0.5rem;
  border-radius: var(--br-1);
}
.confirm-song .cover {
  width: 4rem;
  height: 4rem;
  border-radius: var(--br-1);
}
.confirm-song .info {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1rem;
}
.confirm-song .info h2 {
  opacity: var(--text-opacity-1);
}
.tips{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.web-cover{
  display: block;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  color: #fff;
  z-index: 99;
}
.web-cover .icon{
  width: 1.3em;
  height: 1.3em;
}
</style>
