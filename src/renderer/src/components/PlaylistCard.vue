<template>
  <div class="playlist-card" :style="{ animationDelay: delay }" @click="jump" @keydown.enter="jump">
    <div class="cover">
      <img
        :data-src="this.cover + '?param=500y500'"
        alt=""
        class="main lazyload"
        v-lazy
        crossorigin="anonymous"
      />
      <img
        :data-src="this.cover + '?param=500y500'"
        alt=""
        class="blur lazyload"
        v-lazy
        crossorigin="anonymous"
      />

      <button
        class="playall" tabindex="0"
        @click.stop="playAll"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            d="M19.5 14.598c2-1.155 2-4.041 0-5.196l-9-5.196C8.5 3.05 6 4.494 6 6.804v10.392c0 2.31 2.5 3.753 4.5 2.598z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <h1 class="type"></h1>

    <div class="playlist-info">
      <p class="playlist-count">{{ this.count }}</p>
      <p class="playlist-name">{{ this.name }}</p>
    </div>

    <ContextMenu :menu="[
      {label:'打开',act:'open',icon:'majesticons:open'},
      {label:'播放',act:'playall',icon:'ion:play'},
      {label:'下一首播放',act:'addnext',icon:'material-symbols-light:add-notes'},
      'hr',
      {label:'收藏',act:'collect',icon:'fluent:collections-20-filled'},
      {label:'复制链接',act:'copylink',icon:'tabler:link'},
      {label:'浏览器打开',act:'browser',icon:'mdi:web'},
      ]" @select="contextMenuSelected">
      </ContextMenu>

  </div>
</template>
<script>
import { Icon } from '@iconify/vue';
import ContextMenu from './ContextMenu/ContextMenu.vue';
export default {
  components:{
    Icon,ContextMenu
  },
  data() {
    return {
      delay: Math.random() * 0.2 + "s",
    };
  },
  methods: {
    jump() {
      const type = this.type || "playlist";
      if (type === "playlist") {
        this.$router.push({
          name: "Playlist",
          params: {
            id: this.id,
          },
        });
      }
    },
    playAll(){
      this.$emit('playall',this.id)
    },
    contextMenuSelected(e){
      const act = e?.act
      const actions = {
        browser:()=>{
          const url = `https://music.163.com/#/playlist?id=${this.id}`
          window.electron.ipcRenderer.send('app:openWebView',url)},
        playall:()=>{
          this.$emit('playall',this.id)
        },
        open:()=>{
          this.jump()
        }
      }
      if(actions[act]){
        actions[act]()
      }
    }
  },
  props: ["name", "count", "cover", "type", "id", "sub"],
  emits:['playall']
};
</script>
<style scoped>
@keyframes playlist-card-in {
  from {
    transform: translateY(20px);
    opacity: 0;
    filter: blur(1px);
  }

  to {
    transform: translateY(0px);
    opacity: 1;
    filter: blur(0px);
  }
}

.playlist-card {
  opacity: 0;
  height: fit-content;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: playlist-card-in 0.4s ease forwards;
  grid-column: auto;
  grid-row: auto;
  min-width: 0;
  
}

.playlist-card:hover .blur {
  bottom: -0.6rem;
  opacity: 0.4;
  transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.playlist-card:hover .main {
  transform: scale(1.01);
  transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.playlist-card .type {
  position: absolute;
  font-size: 1.8rem;
  color: #fff;
  left: 0.5rem;
  bottom: 25%;
}

.playlist-card .cover {
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

.playlist-card .playlist-name {
  margin-top: 0.4rem;
  font-size: 1.1rem;
  font-weight: 600;
  opacity: var(--text-opacity-2);
}

.playlist-card .playlist-count {
  font-size: 0.9rem;
  margin-top: 0.3rem;
  opacity: var(--text-opacity-3);
  left: 0;
  bottom: 0;
}

.playlist-card .pop {
  color: #fff;
  font-size: 1.05rem;
  position: absolute;
  top: 0.75rem;
  right: 0.9rem;
  font-weight: 500;
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
.playlist-card:hover .playall {
  opacity: 1;
}
</style>
