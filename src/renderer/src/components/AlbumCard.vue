<template>
  <div class="album-card" @click="
    this.$router.push({
      name: 'Album',
      params: {
        id: this.id,
      },
    })
    ">
    <div class="cover-shell">
      <img :src="resize(cover, 300)" alt="" class="main" />
      <img :src="resize(cover, 300)" alt="" class="blur" />
      <button class="playall" @click.stop="playAll">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill-rule="evenodd"
            d="M19.5 14.598c2-1.155 2-4.041 0-5.196l-9-5.196C8.5 3.05 6 4.494 6 6.804v10.392c0 2.31 2.5 3.753 4.5 2.598z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <span class="date">{{ this.getDate(date) }}</span>
    <h3 class="name">{{ this.name }}</h3>


    <ContextMenu :menu="menu" @select="(act) => {$emit('menu', { name: name, id: id }, act);defauleMenuHandler(act)}" />


  </div>
</template>
<script>
import { resize } from "@/utils/imageProcess";
import { getDate } from "@/utils/timers";
import ContextMenu from "./ContextMenu/ContextMenu.vue";
import { player } from "@/main";
import { showMessageNotification } from "./notification/use_notification";
export default {
  components: {
    ContextMenu
  },
  emits: ['playall', 'menu',"defaultMenuHandler"],
  data() {
    return {};
  },
  methods: {
    resize,
    getDate,
    playAll() {
      this.$emit('playall', this.id)
    },
    defauleMenuHandler(item) {
      if(!this.defauleMenuHandler){return}
      const act = item?.act
      const actions = {
        open: () => {
          this.$router.push({ name: "Album", params: { id: this.id } })
        },
        playall: () => {
          player.playAlbum(null, null, { type: 'album', id: this.id }, true)
        },
        browser: () => {
          const url = `https://music.163.com/#/album?id=${this.id}`
          window.electron.ipcRenderer.send('app:openWebView', url)
        },
        copylink: () => {
          const url = `https://music.163.com/#/album?id=${this.id}`
          window.navigator.clipboard.writeText(url)
          showMessageNotification("已复制")
        },
      }
      if (actions[act]) {
        actions[act]()
      }
    }
  },
  props: {
    cover: {},
    name: {
    },
    size: {},
    date: {},
    id: {
    },
    hideInfo: {},
    menu: {
      type: Array,
      default: [
        { label: '打开', act: 'open', icon: 'majesticons:open' },
        { label: '播放', act: 'playall', icon: 'ion:play' },
        'hr',
        { label: '收藏', act: 'collect', icon: 'fluent:collections-20-filled' },
        { label: '复制链接', act: 'copylink', icon: 'tabler:link' },
        { label: '浏览器打开', act: 'browser', icon: 'mdi:web' },
      ]
    }
  }
};
</script>
<style scoped>
.album-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.cover-shell {
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

.cover-shell img {
  width: 100%;
  aspect-ratio: 1/1;
  position: absolute;
  border-radius: var(--br-1);
}

.cover-shell .blur {
  width: 95% !important;
  filter: blur(10px);
  z-index: -1;
  bottom: -0.2rem;
  opacity: 0.3;
}

.album-card:hover .blur {
  bottom: -1rem;
  opacity: 0.4;
  transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.album-card:hover .main {
  transform: scale(1.01);
  transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.name {
  font-size: 1.1rem;
  font-weight: 600;
}

.count {
  font-size: 0.8rem;
  margin-top: 0.2cqh;
  opacity: var(--text-o-3);
}

.playall {
  width: 2.8rem;
  height: 2.8rem;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  border: 0.666667px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border: none;
  opacity: 0;
  transition: 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playall svg {
  width: 2rem;
  fill: #fff;
}

.album-card:hover .playall {
  opacity: 1;
}

.date {
  font-size: 0.85rem;
  color: var(--text-o-4);
  position: relative;
  z-index: 5;
  margin-top: 0.2rem;
}
</style>
