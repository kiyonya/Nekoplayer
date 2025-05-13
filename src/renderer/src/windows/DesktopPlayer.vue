<template>
    <div class="desktop-player" ref="desktopPlayer" :style="{backgroundColor:`rgb(${miniPlayerBackground},0.3)`}">
        <div class="base" v-show="dialogMode === 'player'">
            <button class="change-mode" @click="dialogMode = 'lyric'">
                <Icon icon="material-symbols-light:lyrics-rounded" class="icon"/>
            </button>
            <div class="cover">
                <img :src="currentPlayDetial?.cover" alt="" class="cover-image"  ref="colorImage" crossorigin="anonymous">
            </div>
            <div class="song">
                <h2 class="name text-limit">{{ currentPlayDetial?.name }}</h2>
                <span class="artist">
                    <ArtistNameGroup :array="currentPlayDetial?.artist" style="max-width: 10rem;" class="text-limit"></ArtistNameGroup>
                </span>
                <VueSlider class="audio-slider" width="100%" :process-style="{ background: '#fff' }"
                    :rail-style="{ background: '#ffffff60' }" :max="1" :min="0" :interval="0.01" :tooltip="'none'"
                    :dot-size="12"  v-model="progress" ></VueSlider>
                <div class="time">
                    <span>
                        {{ mmss(currentTime * 1000) }}
                    </span>

                    <span>
                        {{ mmss(currentPlayDetial?.duration) }}
                    </span>
                </div>
                <div class="audio-control">
                    <button >
                        <Icon icon="iconamoon:playlist-repeat-song-bold" class="icon-small" />
                    </button>
                    <button @click="prev">
                        <Icon icon="fluent:previous-32-filled" class="icon" />
                    </button>
                    <button @click="togglePlay">
                        <Icon icon="fluent:pause-32-filled" class="icon" v-if="audioState === 'play'"/>
                        <Icon icon="fluent:play-32-filled" class="icon" v-if="audioState === 'pause'"/>
                    </button>
                    <button @click="next">
                        <Icon icon="fluent:next-32-filled" class="icon" />
                    </button>
                    <button>
                        <Icon icon="lucide:list-music" class="icon-small" />
                    </button>

                </div>
            </div>

        </div>
        <div class="lyric" v-show="dialogMode === 'lyric'">
            <button class="change-mode" @click="dialogMode = 'player'">
                <Icon icon="material-symbols-light:lyrics-rounded" class="icon"/>
            </button>
            <div class="music-info">
                <img :src="currentPlayDetial?.cover" alt="" class="small-cover" />
                <div class="lyric-content">
                    <h2 class="name text-limit">{{ currentPlayDetial?.name }}</h2>
                    <span class="artist">
                        <ArtistNameGroup :array="currentPlayDetial?.artist"></ArtistNameGroup>
                    </span>
                </div>
                <div class="player-control">
                    
                </div>
            </div>
            <div class="lyric-container">
                <Transition name="lyric-transition" mode="out-in">
                <div class="highlight-lyric" :key="highlightLyric?.timestamp">
                    <h2>{{ highlightLyric?.text }}</h2>
                    <span>{{ highlightLyric?.tlyric }}</span>
                    <div class="gap" v-if="highlightLyric?.gap">
                        <span v-for="i in 3" class="ball"></span>
                    </div>
                </div>
                </Transition>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import VueSlider from 'vue-slider-component';
import ArtistNameGroup from '@/components/ArtistNameGroup.vue';
import { mmss } from '@/utils/timers';
import { Icon } from '@iconify/vue';
import { onMounted, onUnmounted } from 'vue';
import { computed } from 'vue';
import ColorThief from 'colorthief'
import { getMainColorFromImage } from '@/utils/color';
const dialogMode = ref('player')
const currentPlayDetial = ref({})
const currentTime = ref(0)
const audioState = ref('pause')
const desktopPlayer = ref(null)
const miniPlayerBackground = ref([255,255,255])
const lyric = ref({})
const highlightLyric = ref({})
window.electron.ipcRenderer.on('desktop:musicinfo', (e, data) => {
    currentPlayDetial.value = JSON.parse(data)
    const musicCoverSorce = currentPlayDetial.value?.cover
    if(musicCoverSorce){
        console.log(musicCoverSorce)
        const colorImage = new Image()
        colorImage.crossOrigin = 'anonymous'
        colorImage.src = musicCoverSorce
        colorImage.onload = async () => {
            const mainColor = await getMainColorFromImage(colorImage)
            console.log(mainColor)
            miniPlayerBackground.value = mainColor
        }
    }
})
window.electron.ipcRenderer.on('desktop:timeupdate', (e, data) => {
    currentTime.value = JSON.parse(data)
    highlightLyric.value = getHightlightLyric()
    
})
window.electron.ipcRenderer.on('desktop:play', (e) => {
    audioState.value = 'play'
    console.log('onplay')
})
window.electron.ipcRenderer.on('desktop:pause', (e) => {
    audioState.value = 'pause'
    console.log('onpause')
})
window.electron.ipcRenderer.on('desktop:lyric', (e, data) => {
    lyric.value = JSON.parse(data)
})
const progress = computed({
    get: () => currentTime.value * 1000 / currentPlayDetial.value.duration || 0,
    set: (value) => {
        window.electron.ipcRenderer.send('desktop->app:seek', value * currentPlayDetial.value.duration / 1000)
    }
})

function handleMouseEnter() {
    desktopPlayer.value.setAttribute('style', '--webkit-app-region: drag')
    desktopPlayer.value.classList.add('onhover')
}

function handleMouseLeave() {
    desktopPlayer.value.setAttribute('style', '--webkit-app-region: no-drag')
    desktopPlayer.value.classList.remove('onhover')
}

onMounted(() => {
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.electron.ipcRenderer.send('desktop->app:ready')
})

onUnmounted(() => {
    window.removeEventListener('mouseenter', handleMouseEnter)
    window.removeEventListener('mouseleave', handleMouseLeave)
})

function prev() {
    window.electron.ipcRenderer.send('desktop->app:previous')
}

function next() {
    window.electron.ipcRenderer.send('desktop->app:next')
}

function togglePlay() {
    window.electron.ipcRenderer.send('desktop->app:toggleplay')
}
function getHightlightLyric(){
    const time = currentTime.value
    const lyricArray = lyric.value || []
    const index = lyricArray?.findIndex((item) => {
        return item.timestamp> time
    })
    return lyricArray[index - 1]
}
</script>
<style scoped>
.desktop-player {
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;
    -webkit-user-select: none;

    border-radius: 10px;
    box-sizing: border-box;
    padding: 0.7rem;
    backdrop-filter: blur(10px);
    transition: all .5s;
}

.desktop-player .base {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    position: relative;
}
.desktop-player .lyric {
    width: 100%;
    height: 10rem;
    display: flex;
    flex-direction: column;
    position: relative;
}
.desktop-player .lyric .music-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    
    color: white;
}
.desktop-player .lyric .music-info .small-cover {
    width: 3rem;
    height: 3rem;
    aspect-ratio: 1/1;
    border-radius: 0px;
    object-fit: cover;
    border-radius: 5px;
}
.desktop-player .lyric .music-info .lyric-content {
    display: flex;
    flex-direction: column;
    
}
.desktop-player .lyric .music-info .lyric-content .name {
    font-size: 1rem;
    max-width: 16.5rem;
    margin-bottom: 0.1rem;
}
.desktop-player .lyric .music-info .lyric-content .artist {
    font-size: 0.7rem;
    opacity: 0.7;
}

.desktop-player .lyric .lyric-container {
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    align-items: start;
    gap: 0.5rem;
    color: white;
    transform: translateY(0);
    margin-left: 1rem;
}
.desktop-player .lyric .lyric-container h2{
    font-size: 1.3rem;
    font-weight: 600;
}
.desktop-player .lyric .lyric-container span{
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.7;
}
.desktop-player .lyric .gap{
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}
.desktop-player .lyric .gap .ball{
    width: 1rem;
    height: 1rem;
    background-color: white;
    border-radius: 50%;
    opacity: 1;
}
.change-mode{
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: fit-content;
    height: fit-content;
    aspect-ratio: 1/1;
    display: flex;
    padding: 0.2rem;
    align-items: center;
    justify-content: center;
    border-radius: 0.4rem;
    color: white;
    position: absolute;
    right: 0.8rem;
    top: 0.8rem;
    z-index: 1;
    -webkit-app-region: no-drag;
}
.change-mode .icon {
    font-size: 1.5rem;
    color: inherit;
}
.change-mode:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
.desktop-player .base .cover {
    width: 10rem;
    height: 10rem;
    aspect-ratio: 1/1;
    flex-shrink: 0;
}

.desktop-player .base .cover .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.song {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 1rem;
    margin-right: 1rem;
    -webkit-app-region: no-drag;
    color: white;
}

.song .name {
    font-size: 25px;
    max-width: 16.5rem;
    margin-bottom: 0.2rem;
}

.song .artist {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
}

.song .audio-slider {
    width: 100%;
}

.song .time {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
}

.song .audio-control {
    width: 100%;
    height: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
    color: white;
}

.song .audio-control .icon {
    font-size: 1.7rem;
    color: inherit;
}

.song .audio-control .icon-small {
    font-size: 1.2rem;
    color: inherit;
}

.song button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: fit-content;
    height: fit-content;
    display: flex;
    padding: 0.4rem;
    align-items: center;
    justify-content: center;
    border-radius: 0.4rem;
    color: inherit;
}

.song button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.onhover {
    background-color: rgba(255, 255, 255, 0.1);
}
.lyric-transition-enter-from {
    transform: translateY(20px);
    opacity: 0;
    transition:  0.4s;
    filter: blur(2px);
}
.lyric-transition-leave-to{
    transform: translateY(-20px) ;
    filter: blur(2px);
    opacity: 0;
    transition:  0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.lyric-transition-enter-active, .lyric-transition-leave-active {
    transition:  0.2s;
}
</style>