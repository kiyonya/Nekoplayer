<template>
  <div class="song-shell" @dblclick="play" ref="song"
    :class="this.$store.state.musicInfo.id == trackDetial.id ? 'onplay' : ''">
    <span class="serial">{{ (index + 1).toString().padStart(2, '0') }}</span>
    <div class="cover-shell">
      <img src="@/assets/images/play-solid.svg" alt="" class="play-btn" @click="play" />
      <img :data-src="resize(trackDetial.cover, 100, true)" class="lazyload cover" ref="cover" />
    </div>

    <div class="info">
      <span class="title text-limit">{{ trackDetial.name }}
        <span class="trans-name" v-if="alianame">({{ alianame }})
        </span>
      </span>
      <ArtistNameGroup :array="trackDetial.artist"></ArtistNameGroup>
    </div>

    <RouterLink class=" album" :to="{ name: 'Album', params: { id: trackDetial.album.id } }" v-if="trackDetial.album">{{
      trackDetial.album.name }}</RouterLink>

    <div class="right">
      <Icon icon="fluent:video-clip-16-regular" class="icon" v-if="trackDetial?.mv" />
      <Icon icon="weui:like-outlined" class="icon" v-if="!this.$store.state.likeList.has(trackDetial?.id)" />
      <Icon icon="weui:like-filled" class="icon" v-if="this.$store.state.likeList.has(trackDetial?.id)" />
      <span class="duration">{{ mmss(trackDetial?.duration) }}</span>
    </div>

    <ContextMenu :menu="menu" @select="(act) => { $emit('menu', trackDetial, act), menuHandler(trackDetial, act) }">
    </ContextMenu>
  </div>
</template>
<script>
import { mmss } from '@/utils/timers'
import { formatBytes, ob } from '@/utils/libs'
import { getDate } from '@/utils/timers'
import ArtistNameGroup from './ArtistNameGroup.vue'
import { observer } from '@/lib/lazyload'
import { resize } from '@/utils/imageProcess'
import { Icon } from '@iconify/vue'
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue'
import { player, toolkit } from '@/main'
import { showMessageNotification } from './notification/use_notification'
export default {
  computed: {
    alianame() {
      if (this.trackDetial.alia && this.trackDetial.alia?.length > 0) {
        return this.trackDetial.alia[0]
      }
      else if (this.trackDetial.tns && this.trackDetial.tns?.length > 0) {
        return this.trackDetial.tns[0]
      }
      else {
        return undefined
      }
    }
  },
  components: {
    ContextMenu,
    ArtistNameGroup,
    Icon,
    ContextMenu
  },
  data() {
    return {
      el: undefined,
      text: '',
      checked: false,
    }
  },
  props: {
    trackDetial: {
      type: Object,
    },
    source: {
      type: Object,
    },
    index: {
      type: Number
    },
    menu: {
      type: Array,
      default: [{ label: '播放', act: 'play', icon: 'ion:play' },
      { label: '添加到下一首', act: 'addnext', icon: 'material-symbols-light:add-notes' },
        'hr',
      { label: '收藏', act: 'collect', icon: 'fluent:collections-20-filled' },
      { label: '复制链接', act: 'copylink', icon: 'tabler:link' },
        'hr',
      { label: '下载歌词', act: 'downloadlyric', icon: 'material-symbols:download' },
      { label: '下载nlo歌词', act: 'downloadNloLyric', icon: 'material-symbols:download' },]
    },
    defaultMenuHandler: {
      type: Boolean,
      default: true
    }
  },
  emits: ["play", 'browserOpen', 'addNext', 'menu'],
  methods: {
    mmss,
    formatBytes,
    getDate,
    toMv(id) {
      this.$router.push({
        name: 'MV',
        params: {
          id: id
        }
      })
    },
    play() {
      this.$emit('play', this.trackDetial.id)
    },
    resize,
    menuHandler(track, item) {
      if(!this.defaultMenuHandler){return}
      let id = track?.id
      let name = track?.name
      const act = item?.act
      const actions = {
        play: () => {
          this.play()
        },
        addnext: () => {
          player.addTrackToNext(id, this.source)
        },
        browser: () => {
          const url = `https://music.163.com/#/song?id=${id}`
          window.electron.ipcRenderer.send('app:openWebView', url)
        },
        copylink: () => {
          const url = `https://music.163.com/#/song?id=${id}`
          window.navigator.clipboard.writeText(url)
          showMessageNotification("已复制")
        },
        downloadlyric: () => {
          toolkit.downloadLyric(id, name)
        },
        downloadNloLyric: () => {
          toolkit.downloadNloLyric(id, name)
        }
      }
      if (actions[act]) {
        actions[act]()
      }
    }
  },

  mounted() {
    observer(this.$refs.song)
  }
}
</script>
<style scoped>
@keyframes song-in {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
}

.color {
  background: var(--song-gap) !important;
}

.song-shell {
  width: 100%;
  height: 4rem;
  transition: 0.1s;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-o-2);
  border-radius: var(--br-1);
  position: relative;
  animation: song-in .4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.song-shell:hover {
  background: var(--hover);
}

.song-shell:hover,
.song-shell:focus {
  .play-btn {
    opacity: 1;
  }

  .cover {
    filter: brightness(0.6);
  }

  .right .icon {
    opacity: 1;
  }
}

.serial {
  font-size: 1rem;
  font-weight: 600;
  margin-left: 1.2rem;
  color: var(--text-o-2);
}

.cover-shell {
  height: 80%;
  aspect-ratio: 1/1;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.play-btn {
  position: absolute;
  width: 60%;
  aspect-ratio: 1/1;
  opacity: 0;
  z-index: 5;
  filter: invert(1);
}

.cover {
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 5px;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1cqw;
  height: 80%;
  position: relative;
}

.info .title {
  font-size: 1.1rem;
  font-weight: 600;
  max-width: 28cqw;
}

.info .artist {
  font-size: 0.9rem;
  max-width: 28cqw;
}

.album {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-o-4);
  display: block;
  position: absolute;
  left: 50%;
  width: 310px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
}

.right {
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

.right .icon {
  width: 1.5em;
  height: 1.5em;
  color: inherit;
}

.right .duration {
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
}










.act {
  position: absolute;
  width: fit-content;
  right: 3rem;
  display: flex;
  justify-content: right;
  gap: 2rem;
}

.act img {
  width: 1.5rem;
  opacity: 0.8;
}

.time {
  font-size: 15px;
  display: block;
  position: absolute;
  right: 1.2rem;
  opacity: 0.85;
}

.song-shell .popline {
  width: 120px;
  height: 3px;
  position: absolute;
  overflow: hidden;
  left: 75%;
  background-color: #ffffff46;
  border-radius: 5px;
}

.song-shell .terminal {
  width: fit-content;
  height: fit-content;
  position: absolute;
  overflow: hidden;
  left: 75%;
  color: var(--text);
  font-size: 14px;
  opacity: 0.7;
}

.song-shell .popline .popline-inner {
  width: inherit;
  height: 3px;
  position: absolute;
  left: 0;
  top: 0;
}

.song-shell .if {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: fit-content;
  justify-content: center;
  line-height: 18px;
  margin-left: 8px;
}

.song-shell .if .name {
  font-size: 16px;
  font-weight: 600;
  width: 340px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-shell .if .name .trans {
  opacity: 0.65;
  font-size: 16px;
  font-weight: 400;
  margin-left: 5px;
}

.song-shell .if .ar-main {
  font-size: 15px;
  transform: translateY(4px);
  cursor: pointer;
}

.song-shell .if .ar-main .ar-item {
  opacity: 0.75;
  transform: translateY(4px);
}

.song-shell .if .ar-main p {
  opacity: 0.75;
  transform: translateY(4px);
}

.song-shell .if .ar-main .ar-item:hover {
  opacity: 1;
  color: #67dff4;
}

.failed {
  opacity: 0.3 !important;
}

.failed:hover {
  color: inherit;
}

.trans-name {
  opacity: 0.8;
  margin-left: 0.5rem;
  font-weight: 400;
}

.selector {
  width: 1.2rem;
  height: 1.2rem;
  pointer-events: all;
  margin-left: 1rem;
}
</style>
