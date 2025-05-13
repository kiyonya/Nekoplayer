<template>
  <div>

    <img class="app-bg-img" v-if="theme.backgroundMode === 'image' && theme.backgroundImage" :style="{filter:`blur(${theme.backgroundImageBlur}px) brightness(${theme.backgroundImageBrightness}) saturate(${theme.backgroundImageSaturate})`,opacity:theme.backgroundImageOpacity,objectFit:theme.backgroundImageFit}" :src="theme.backgroundImage"/>

    <div class="app-bg-bloom" v-if="theme.backgroundMode === 'bloom'" :style="`--b:rgb(${store.state.bloomColor})`"></div>

    <div class="eletron-window"></div>

    <TopBar v-show="$route.name !== 'DesktopLyric'"></TopBar>
    
    <LoginWindow v-if="store.state.showLoginWindow"></LoginWindow>

    <NormalPlaybar
      v-if="!['DesktopLyric', 'MV'].includes($route.name) && store.state.musicInfo.id"
    ></NormalPlaybar>

    <SideBar></SideBar>
    <div class="app-view">
      
      <router-view v-slot="{ Component }" @scroll="debounceScroll($event)" ref="routerView">
          <KeepAlive :max="10" :include="['Recommend', 'LocalMusic','Artist','Library','Search','Comment','LocalMusicGroup']">
            <component :is="Component" class="router-view" :key="$route.fullPath" />
          </KeepAlive>
      </router-view>
    </div>

    <Transition name="fade">
      <PlaylistBar v-if="store.state.showPlaylistBar"></PlaylistBar>
    </Transition>

    <Equalizer v-if="store.state.showEqualizer"></Equalizer>

    <Transition name="player">
      <MusicPlayer v-if="store.state.showPlayer"></MusicPlayer>
    </Transition>
    <button class="totop" :class="showToTop ? 'show-totop' : ''" @click="totop">
      <Icon icon="tdesign:backtop" style="width: 2em;height: 2em;"/>
    </button>

    
  </div>
</template>
<script setup>
import PlaylistBar from '../components/PlaylistBar.vue'
import NormalPlaybar from '../components/NormalPlaybar.vue'
import LoginWindow from '../components/Login.vue'
import TopBar from '../components/TopBar.vue'
import MusicPlayer from '../components/musicplayer/MusicPlayer.vue'
import { computed, ref, watch } from 'vue'
import Equalizer from '../components/Equalizer.vue'
import { store } from '../store'
import 'vue-slider-component/theme/default.css'
import SideBar from '../components/SideBar.vue'
import { Icon } from '@iconify/vue'
import {debounce} from '../utils/utils'
import { onBeforeRouteLeave } from 'vue-router'
const theme = computed({
  get: () => store.state.theme
})
const showToTop = ref(false)
const debounceScroll = debounce((e)=>{
  store.commit('updateScroll',e.target.scrollTop)
  if (e.target.scrollTop > window.innerHeight) {
    showToTop.value = true
  } else {
    showToTop.value = false
  }
},100,false)
function totop(){
  document.querySelector('.router-view').scrollTo({top:0,behavior:'smooth'})
}
</script>
<style>
.router-view {
  flex: 1;
  height: 100%;
  overflow-y: scroll;
}
@keyframes viewer-in {
  from {
    opacity: 0;
  }
}

.player {
  transform: translateY(100vh);
  visibility: hidden;
  transition: 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.showplayer {
  visibility: visible;
  transform: none;
}

.totop {
  width: 3rem;
  height: 3rem;
  background: var(--ui-light);
  backdrop-filter: blur(3px);
  position: fixed;
  right: 1.5rem;
  bottom: 6rem;
  animation: totop 0.6s ease-in-out;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(10rem);
  transition: 0.3s ease-in-out;
  opacity: 0;
  z-index: 999;
  color: var(--text);
}
.show-totop {
  transform: none;
  opacity: 1;
}

.viewer-change-enter-active {
}

.viewer-change-leave-active {
}
.fade-enter-active,
.fade-leave-active,
.fade-enter,
.fade-leave-to {
  transform: translateX(27vw);
}
.player-enter,
.player-leave-to {
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: translateY(100vh);
}


.app-bg-img{
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: -1;
}
.app-bg-bloom{
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: -1;
  top: 0;
  background: linear-gradient(to bottom,var(--b),var(--root) 45%);
  opacity: 0.5;
  transition: .5s;
}

</style>
