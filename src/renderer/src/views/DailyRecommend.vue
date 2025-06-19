<template>
    <div class="page">
        <div class="head">
            <h1>{{ date }}，<span style="color: var(--strong);">为您推荐</span></h1>
            <span class="tip">根据您的听歌喜好生成，每日6时更新</span>
            <div class="btns">
                <button @click.stop="playall">
                    <Icon icon="material-symbols:play-arrow-rounded" class="i" />
                    播放
                </button>
                <button>
                    <Icon icon="lucide:ellipsis" class="i" />
                </button>
            </div>
        </div>
        <div class="tracks">
            <Song v-for="(song, index) in tracks" :source="{ type: 'dailyrecommend', id: null }" :trackDetial="{
                name: song.name,
                cover: song.al.picUrl,
                artist: song.ar,
                album: song.al,
                id: song.id,
                duration: song.dt,
                tns: song.tns || null,
                alia: song.alia,
                mv: song.mv
            }" :index="index" @play="playTracks" />
        </div>
    </div>
</template>
<script setup>
import { getDailySong } from '@/api/recommend';
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import Song from '@/components/Song.vue';
import { player } from '@/main';
import { onUnmounted } from 'vue';
let tracks = ref([])
let date = ref("")
onMounted(() => {
    Promise.resolve().then(() => {
        getDailySong().then(data => {
            tracks.value = data?.data?.dailySongs || []
        })
        let d = new Date()
        date.value = d.getMonth() + 1 + "月" + d.getDate() + "日"
    })
})
onUnmounted(()=>{
    tracks = null
    date = null
    window.webFrame.clearCache()
})
function playTracks(id) {
    let source = { type: 'dailyrecommend', id: null }
    player.playPlaylist(id, tracks.value.map(i => {
        return {
            id: i.id,
            source
        }
    }), { type: 'dailyrecommend', id: null })
}
function playall() {
    let source = { type: 'dailyrecommend', id: null }
    player.playNewList(tracks?.value?.[0]?.id, tracks.value.map(i => {
        return {
            id: i.id,
            source
        }
    }), source)
}
</script>
<style scoped>
.head {
    position: relative;
    margin-top: 1rem;
    margin-bottom: 1.8rem;
    width: 93%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: start;

    .tip {
        color: var(--text-o-3);
    }
}

.btns {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    margin: auto auto 0px 0px;
    width: 100%;
    height: 2.5rem;
    margin-top: 1rem;
}

.btns button {
    height: 100%;
    aspect-ratio: 1/1;
    border: none;
    background: var(--ui);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    border-radius: var(--br-1);
    color: var(--text-o-2);
    font-size: 1.2rem;
    gap: 0.2rem;
    box-shadow: var(--shadow);
}

@property --gp {
    syntax: "<percentage>";
    initial-value: 0%;
    inherits: false;
}

@keyframes play-in {
    from {
        --gp: 0%
    }
}

.btns button:first-child {
    --gp: 100%;
    padding: 0.4rem 1rem;
    aspect-ratio: auto;
    background: linear-gradient(to right, var(--strong-light) var(--gp), transparent var(--gp));
    font-weight: 600;
    color: white;
    fill: white;
    animation: play-in .5s;
}

.btns button .i {
    width: 1.4em;
    height: 1.4em;
    color: inherit;
}

.tracks {
    width: 93%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    scroll-snap-type: proximity;
    margin-bottom: 5rem;
}
</style>