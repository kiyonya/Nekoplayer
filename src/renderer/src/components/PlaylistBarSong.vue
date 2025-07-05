<template>
  <div
    class="song"
    :key="this.song?.id"
    :class="this.$store.state.musicInfo.id == song?.id ? 'highlight' : ''"
    ref="song"
    @dblclick.stop="play()"
  >
    <div class="cover-shell">
      <img :data-src="song?.al?.picUrl ? resize(song?.al?.picUrl,100) : song?.cover" alt="" class="cover lazyload" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" @click.stop="play()">
        <path
          fill="#fff"
          fill-rule="evenodd"
          d="M19.5 14.598c2-1.155 2-4.041 0-5.196l-9-5.196C8.5 3.05 6 4.494 6 6.804v10.392c0 2.31 2.5 3.753 4.5 2.598z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="info">
      <h3 class="text-limit">{{ song?.name }}</h3>
      <span>
        <span v-if="song?.voice" class="voice">声音</span>
        <ArtistNameGroup :array="song?.ar ? song?.ar : song?.artist" class="text-limit"></ArtistNameGroup>
      </span>
    </div>
    <Icon :icon="song?.local ? 'la:hdd-solid' : 'proicons:cloud'" style="position: absolute;right: 0.6rem; top: 0.5rem;" :title="song?.local ? '这首歌来自于本地磁盘' : '这首歌来自远程服务器'"/>
  </div>
</template>
<script>
import { observer } from '@/lib/lazyload'
import ArtistNameGroup from './ArtistNameGroup.vue'
import { resize } from '@/utils/imageProcess';
import { player } from '@/main';
import { Icon } from '@iconify/vue';
export default {
  components: {
    ArtistNameGroup,Icon
  },
  props: {
    song: {
      type: Object,
      default: null
    }
  },
  methods: {
    play() {
      console.log(this.song?.id)
      player.play(this.song?.id,{},false)
    },
    resize
  },
  mounted() {
    const song = this.$refs.song
    
    observer(song)
  }
}
</script>
<style scoped>
.song {
  width: calc(100% - 1rem);
  height: 30px;
  position: absolute;
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  padding: 0.5rem;
  border-radius: 0.2rem;
}
.song:hover {
  background: var(--hover);
  .cover-shell .cover {
    filter: brightness(0.6);
  }
  .cover-shell svg {
    opacity: 1;
  }
}
.song .cover {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  flex-shrink: 0;
}
.song .cover-shell {
  width: 3rem;
  height: 3rem;
  border-radius: 0.2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.song .cover-shell svg {
  width: 2em;
  position: absolute;
  z-index: 1;
  opacity: 0;
  transition: all 0.1s ease-in-out;
}
.song .cover-shell svg:active {
  transform: scale(0.9);
}
.song .info {
  display: block;
}
.song .info h3 {
  width: 15rem;
}
.song .info a {
  width: 15rem;
}
.highlight {
  background: var(--hover);
}
.voice{
  font-size: 0.8rem;
  color: var(--text-o-2);
  border: 1px solid var(--border);
  border-radius: var(--br-1);
  margin-right: 0.3rem;
  padding: 0 4px;
}
</style>
