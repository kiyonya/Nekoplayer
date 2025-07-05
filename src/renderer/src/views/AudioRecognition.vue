<template>
    <div class="page">
        <h2 class="pt">听歌识曲</h2>
        <div class="pending" v-if="doing">
            <div class="music-loader">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>

            </div>
            <span>正在聆听音乐...</span>
        </div>
        <div class="result" v-if="!doing">
            <span v-if="!results?.length">什么都没找到</span>
            <div class="tracks">
                <Song v-for="(song, index) in results" :source="{ type: 'smi', id: null }" :trackDetial="{
                    name: song.name,
                    cover: song.album.picUrl,
                    artist: song.artists,
                    album: song.album,
                    id: song.id,
                    duration: song.duration,
                    tns: song.tns || null,
                    alia: song.alia,
                    mv: song.mv
                }" :index="index" 
                @menu="trackMenuSelected" 
                @play="playTracks" 
                @browser-open="browserOpen">
                </Song>

            </div>
        </div>
        <div class="control">
            <button v-if="!doing" @click="run">重新识别</button>
        </div>
    </div>
</template>
<script setup>
import { recognizeSystemAudio } from '@/utils/audiomatch';
import { onMounted, ref } from 'vue';
import Song from '@/components/Song.vue';
import { player } from '@/main';
const doing = ref(false)
const results = ref([])
function run() {
    doing.value = true
    recognizeSystemAudio().then(data => {
        console.log(data)
        results.value = data?.data?.result?.map(i=>i?.song)
        doing.value = false
    })
}
onMounted(() => {
    run()
})
function playTracks(id) {
let source = { type: 'smi', id: null }
  player.playInsertTracks(id,results.value.map(i=>({id:i.id,source})),source)
}
function browserOpen(url) {
  window.electron.ipcRenderer.send('app:openWebView', url)
}
function trackMenuSelected(track,item) {
  let id = track?.id
  let name = track?.name
  const act = item?.act
  let source = { type: 'smi', id: null }
  const actions = {
    play: () => {
      playTracks(id)
    },
    addnext: () => {
      player.addTrackToNext(id, source)
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
      toolkit.downloadLyric(id,name)
    },
    downloadNloLyric: () => {
      toolkit.downloadNloLyric(id,name)
    }
  }
  if (actions[act]) {
    actions[act]()
  }
}
</script>
<style scoped>
.page {
    padding-top: 1.5rem;
    gap: 2rem;
}

.music-loader {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100px;
    gap: 8px;
}

.music-loader .bar {
    width: 10px;
    height: 30px;
    background: linear-gradient(to top, color-mix(in srgb, var(--strong) 80%, white), var(--strong));
    border-radius: 5px;
    animation: music-wave 0.8s ease-in-out infinite;
}

.music-loader .bar:nth-child(1) {
    animation-delay: 0.1s;
}

.music-loader .bar:nth-child(2) {
    animation-delay: 0.3s;
}

.music-loader .bar:nth-child(3) {
    animation-delay: 0.5s;
}

.music-loader .bar:nth-child(4) {
    animation-delay: 0.7s;
}

.music-loader .bar:nth-child(5) {
    animation-delay: 0.9s;
}

.music-loader p {
    margin-left: 20px;
    font-family: Arial, sans-serif;
    color: #333;
    font-size: 16px;
}

@keyframes music-wave {

    0%,
    100% {
        transform: scaleY(1);
    }

    50% {
        transform: scaleY(2);
    }
}

.pending {
    width: 12rem;
    height: 12rem;
    position: absolute;
    left: calc(50% - 6rem);
    top: calc(50% - 6rem - 4rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    span {
        font-size: 1.2rem;
        color: var(--text-o-3);
    }
}

.control {
    margin-top: auto;
    margin-bottom: 10rem;

    button {
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: fit-content;
        align-items: center;
        font-weight: 600;
        font-size: 1.1rem;
        background-color: var(--ui);
        box-sizing: border-box;
        padding: 0.4rem 0.6rem;
        border-radius: var(--br-1);
        transition: 0.1s;
        color: var(--text-o-3);
        text-decoration: none;
        cursor: pointer;
        border: none;
    }
}
.result{
    width: 93%;
    flex: 1;
}
.tracks{
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>