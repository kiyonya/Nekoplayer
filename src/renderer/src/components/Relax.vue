<template>
    <div class="relax" @click="emits('close')">
        <div class="app-control">
            <button @click.stop="minimize">
                <Icon icon="mingcute:minimize-line" />
            </button>
            <button @click.stop="closeApp">
                <Icon icon="material-symbols:close" />
            </button>
        </div>
        <div class="background">
            <img class="bg-img" v-if="theme.backgroundMode === 'image' && theme.backgroundImage"
                :src="theme.backgroundImage" :key="theme.backgroundImage" />
            <video class="bg-vid" v-if="theme.backgroundMode === 'video'" :src="theme.backgroundVideo" autoplay loop
                muted :key="theme.backgroundVideo"></video>
            <img :src="nowPlaying.cover" alt="" v-else class="cover-bg" v-if="nowPlaying.cover">
            <div class="mask-5"></div>
        </div>
        <div class="left">
            <div class="now-playing">
                <img :src="nowPlaying?.cover" alt="" v-if="nowPlaying.cover">
                <div class="info">
                    <h3 class="song-name">{{ nowPlaying?.name }}</h3>
                    <span class="ar">{{nowPlaying?.artist?.map(i => i.name)?.join("/")}}</span>
                </div>
            </div>
            <h1>NEKOPLAYER</h1>
            <span>待机模式 - 点击任意位置离开</span>
        </div>
        <div class="right">
            <div class="clock">
                <h1>{{ clock.hour.toString().padStart(2, "0") }}:{{ clock.minute.toString().padStart(2, "0") }}:{{
                    clock.second.toString().padStart(2,"0") }}</h1>
                <span>星期{{ zhMap[clock.day] }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { closeApp } from '@/main'
import { store } from '@/store'
import { Icon } from '@iconify/vue'
import { onUnmounted } from 'vue'
import { onMounted } from 'vue'
import { computed, ref } from 'vue'

let emits = defineEmits(['close'])
let clock = ref({
    hour: 0,
    minute: 0,
    second: 0,
    day: 0
})
let zhMap = ["日", "一", "二", "三", "四", "五", "六"]
const theme = computed(() => store.state.theme)
const nowPlaying = computed(() => store.state.musicInfo)

let clockInterval = null
onMounted(() => {
    const date = new Date()
    clock.value.second = date.getSeconds()
    clock.value.minute = date.getMinutes()
    clock.value.hour = date.getHours()
    clock.value.day = date.getDay()
    clockInterval = setInterval(() => {
        const date = new Date()
        clock.value.second = date.getSeconds()
        clock.value.minute = date.getMinutes()
        clock.value.hour = date.getHours()
        clock.value.day = date.getDay()
    }, 1000)
    window.gc && window.gc()
})
onUnmounted(() => {
    clearInterval(clockInterval)
    window.gc && window.gc()
})
function minimize() {
  window.electron.ipcRenderer.send('main:minimize')
}
function maximize() {
  window.electron.ipcRenderer.send('main:maximize')
}
</script>
<style scoped>
.relax {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99999999;
    background: var(--component);
    color: white;

    .background {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;

        .bg-img,
        .bg-vid,
        .cover-bg {
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
        }
        .cover-bg{
            filter: blur(2px);
        }
        .mask-5 {
            width: 100vw;
            height: 40vh;
            position: fixed;
            bottom: 0;
            left: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.469), transparent);
            z-index: -1;
        }
    }
}

.left {
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 2rem;
    bottom: 2rem;
    color: white;

    h1 {
        font-size: 5.5rem;
        margin: 0px;
        padding: 0px;
    }

    span {
        font-size: 1.5rem;
        color: var(--text-o-4);
    }

    .now-playing {
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 4rem;
            height: 4rem;
            border-radius: var(--br-2);
            object-fit: cover;
        }

        .info {
            display: flex;
            flex-direction: column;

            .song-name {
                font-size: 1.5rem;
                margin: 0px;
                padding: 0px;
            }

            .ar {
                font-size: 1rem;
                color: var(--text-o-2);
            }
        }
    }
}

.right {
    width: fit-content;
    height: fit-content;
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text);
    font-family: 'Courier New, Lucida Console, Consolas';
    text-align: right;
    color: white;

    h1 {
        font-size: 3rem;
        margin: 0px;
        padding: 0px;
    }

    span {
        font-size: 1.5rem;
        color: var(--text-o-4);
        letter-spacing: 3px;
    }
}

.app-control {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    gap: 1rem;
    z-index: 5;

    button {
        width: 2.5rem;
        height: 2.5rem;
        background:rgba(255, 255, 255, 0.358);
        color: white;
        border-radius: var(--br-1);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.5rem;

    }
}
</style>
