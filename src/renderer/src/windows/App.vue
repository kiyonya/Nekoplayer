<template>
  <div>
    <img class="app-bg-img" v-if="theme.backgroundMode === 'image' && theme.backgroundImage"
      :style="{ filter: `blur(${theme.backgroundImageBlur}px) brightness(${theme.backgroundImageBrightness}) saturate(${theme.backgroundImageSaturate})`, opacity: theme.backgroundImageOpacity, objectFit: theme.backgroundImageFit, transform: `scale(${theme.backgroundImageScale})` }"
      :src="theme.backgroundImage" />

    <div class="app-bg-bloom" v-if="theme.backgroundMode === 'bloom'" :style="`--b:rgb(${store.state.bloomColor})`">
    </div>

    <video class="app-bg-vid" v-if="theme.backgroundMode === 'video'" :src="theme.backgroundVideo"
      :style="{ opacity: theme.backgroundVideoOpacity, objectFit: theme.backgroundVideoFit, transform: `scale(${theme.backgroundVideoScale})` }"
      autoplay loop :muted="theme.backgroundVideoMute" :key="theme.backgroundVideo">
    </video>

    <div class="eletron-window"></div>

    <TopBar v-show="$route.name !== 'DesktopLyric'"></TopBar>

    <LoginWindow v-if="store.state.showLoginWindow"></LoginWindow>

    <NormalPlaybar v-if="!['DesktopLyric', 'MV'].includes($route.name) && store.state.musicInfo.id"></NormalPlaybar>

    <SideBar></SideBar>
    <div class="app-view">

      <router-view v-slot="{ Component }" @scroll="debounceScroll($event)" ref="routerView" >
        <transition name="slide" mode="out-in">
          <KeepAlive :max="20"
            :include="['Recommend', 'LocalMusic', 'Artist', 'Library', 'Search', 'Comment', 'LocalMusicGroup', 'Setting', 'Radio', 'PlaylistSquare', 'PlaylistCategory', 'SearchDetail']">
            <component :is="Component" class="router-view" :key="$route.fullPath" />
          </KeepAlive>
        </transition>
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
      <Icon icon="tdesign:backtop" style="width: 2em;height: 2em;" />
    </button>

    <Transition name="relax-fade">
    <Relax v-if="store.state.standBy" @close="store.commit('standByMode',false)"/>
    </Transition>

  </div>
</template>
<script setup>
import PlaylistBar from '../components/PlaylistBar.vue'
import NormalPlaybar from '../components/NormalPlaybar.vue'
import TopBar from '../components/TopBar.vue'
import { computed, ref, watch, defineAsyncComponent } from 'vue'
import { store } from '../store'
import 'vue-slider-component/theme/default.css'
import SideBar from '../components/SideBar.vue'
import { Icon } from '@iconify/vue'
import { debounce } from '../utils/utils'
import { onBeforeRouteLeave } from 'vue-router'
import MusicPlayer from '../components/musicplayer/MusicPlayer.vue'
import Equalizer from '@/components/Equalizer.vue'
import LoginWindow from '@/components/Login.vue'
import Relax from '@/components/Relax.vue'
import router from '@/router'
const theme = computed({
  get: () => store.state.theme
})
const showToTop = ref(false)
const debounceScroll = debounce((e) => {
  store.commit('updateScroll', e.target.scrollTop)
  if (e.target.scrollTop > window.innerHeight) {
    showToTop.value = true
  } else {
    showToTop.value = false
  }
}, 100, false)
function totop() {
  document.querySelector('.router-view').scrollTo({ top: 0, behavior: 'smooth' })
}

if (location.href.startsWith("file")) {
  router.push({ name: "Recommend" })
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

.viewer-change-enter-active {}

.viewer-change-leave-active {}

.fade-enter-active,
.fade-leave-active,
.fade-enter,
.fade-leave-to {
  transform: translateX(25rem);
}



.app-bg-img {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: -1;
  transition: .3s;
}

.app-bg-bloom {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: -1;
  top: 0;
  background: linear-gradient(to bottom, var(--b), var(--root) 45%);
  opacity: 0.5;
  transition: .5s;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.15s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;

}

/* Player transition styles */
.player-enter-active,
.player-leave-active {
  transition: all 0.4s;
  /* Custom bezier curve for bouncy effect */
}

.player-enter-from {
  transform: translateY(100%);
}

.player-enter-to {
  transform: translateY(0);
}

.player-leave-from {
  transform: translateY(0);
}

.player-leave-to {
  transform: translateY(100%);
}

.app-bg-vid {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -10;
  transition: .1s;
}

.relax-fade-enter-active,
.relax-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.relax-fade-enter-from,
.relax-fade-leave-to {
  transform: translateY(-100%);
}
.relax-fade-enter-to,
.relax-fade-leave-from {
  transform: translateY(0);
}

</style>
