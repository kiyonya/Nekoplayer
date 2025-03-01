<template>
  <div class="n-playbar" @click="showPlayer(true)" >
    <VueSlider class="slider" width="100%" height="4px" @click.stop :dot-size="0" tooltip="none" :lazy="true" v-model="progress" :min="0" :max="1" :interval="0.01" :use-keyboard="true" 
    :process-style="{background:'rgb(109,118,255)'}"
     ></VueSlider>

    <div class="music-info">
      <img :src="resize(musicInfo.cover, 150)" class="playbar-cover" @click.stop="showPlayer" />
      <div class="n-playbar-info">
        <h4 class="musicname text-limit">{{ musicInfo.name }}</h4>
        <span class="musicartist"
          ><ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup
        ></span>
      </div>
    </div>
    <div class="playbar-m">
      <div class="widget-shell">
        <button>
          <Icon icon="proicons:heart" class="icon1" />
        </button>

        <button @click.stop="player.previous()">
          <Icon icon="fluent:previous-20-filled" class="icon2" />
        </button>

        <button @click.stop="player.playOrPause()">
          <Icon icon="fluent:play-12-filled" class="icon3" v-if="audioState.state === 'pause'" />
          <Icon icon="fluent:pause-12-filled" class="icon3" v-if="audioState.state === 'play'" />
        </button>

        <button @click.stop="player.next()">
          <Icon icon="fluent:next-20-filled" class="icon2" />
        </button>

        <button @click.stop="player.switchPlaymode()">
          <Icon icon="tabler:repeat" class="icon1" v-show="playerState.mode === 'list'" />
          <Icon icon="tabler:repeat-once" class="icon1" v-show="playerState.mode === 'loop'" />
          <Icon icon="fe:random" class="icon1" v-show="playerState.mode === 'random'" />
        </button>
      </div>
    </div>
    <div class="playbar-a">
      <button @click.stop="store.commit('showEqualizer',true)">
        <Icon icon="ri:equalizer-3-line" class="icon2"/>
      </button>
      <button @click.stop="togglePlaylisyBar()">
        <Icon icon="flowbite:list-music-outline" class="icon2"/>
      </button>
    </div>
  </div>
</template>
<script setup>
import ArtistNameGroup from './ArtistNameGroup.vue'
import temp from '@/store/temp'
import { store } from '@/store'
import { resize } from '@/utils/imageProcess'
import { Icon } from '@iconify/vue'
import VueSlider from 'vue-slider-component'
import { computed } from 'vue'
import { player } from '@/main'
const audioState = computed(()=>{
  return store.state.audioState
})
const progress = computed({
  get:()=>{return store.state.audioState.ct / store.state.audioState.dt},
  set:(val)=>{
    console.log(val)
    const time = val * store.state.audioState.dt
    player.seek(time)
  }
})
const musicInfo= computed(()=>{
  return store.state.musicInfo
})
const playerState = computed(()=>{
  return store.state.playerState
})
function showPlayer(){
  store.commit('showPlayer',true)
}
function togglePlaylisyBar(){
  if(store.state.showPlaylistBar){
    store.commit('showPlaylistBar',false)
  }
  else{
    store.commit('showPlaylistBar',true)
  }
}
</script>
<style scoped>
.n-playbar {
  --pd: 5%;
  padding: 0% var(--pd);
  width:100%;
  box-sizing: border-box;
  height: 4.5rem;
  position: fixed;
  left: 0;
  bottom: 0;
  background: var(--component) ;
  background-image: url() ;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: exclusion;
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: ' . . . ';
  z-index: 1000;
}

.n-playbar .music-info {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.n-playbar .music-info .playbar-cover {
  height: 3rem;
  aspect-ratio: 1/1;
  object-fit: cover;
  margin-left: 1rem;
  border-radius: 10%;
}

.n-playbar .playbar-m {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
}

.n-playbar .widget-shell {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.4rem;
}

.n-playbar .widget {
  width: 1.7rem;
  opacity: 0.75;
}

.n-playbar .small {
  padding: 0 1.2rem 0 1.2rem;
  width: 1.3rem !important;
}

.n-playbar .musicname {
  font-size: 1.1em;
  margin: 0px;
  opacity: 0.7;
  width: 100%;
}

.n-playbar .n-playbar-info {
  width: fit-content;
  height: 80%;
  letter-spacing: normal;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  justify-content: center;
  margin-left: 0.75em;
}

.n-playbar .musicartist {
  font-size: 1rem;
  margin: 0px;
  opacity: 0.5;
}
.n-playbar .playbar-a {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto 2.25rem auto auto;
  gap: 1.2rem;
}
.n-playbar .playbar-a img {
  width: 1.6rem;
}

.slider {
  position: absolute;
}

.i {
  width: 1.5rem;
}
button {
  appearance: none;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;

  aspect-ratio: 1/1;
  padding: 0.3rem;
  border-radius: 20%;

  transition: 0.2s;
}
button:hover {
  background: var(--hover);
}
.icon1 {
  width: 1.5em;
  height: 1.5em;
  color: var(--text-o-3);
}
.icon2 {
  width: 1.9em;
  height: 1.9em;
  color: var(--text-o-2);
}
.icon3 {
  width: 3em;
  height: 3em;
  color: var(--text-o-1);
}
</style>
