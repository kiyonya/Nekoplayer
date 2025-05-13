<template>
    <div class="starpick-main" :style="{border:`1px solid ${color}`}">
        <img :src="this.cover + '?param=300y300'" alt="" class="starpick-main-bg" @load="getMainColor($event)" crossorigin="anonymous">
        <img :src="this.cover + '?param=500y500'" alt="" class="starpick-main-cover" crossorigin="anonymous">
        <div class="starpick-main-info">
            <p class="name">{{ this.name }}</p>
            <p class="artist">{{ joinArtist(this.artist) }}</p>

            <p class="FM">{{ $t('recommend.FMTip') }}</p>
        </div>
        <div class="starpick-btn" @click="this.$audio.play(this.id,{rs:{type:'add',id:id}})">
            <img src="@/assets/images/play-solid.svg" alt="" class="ic" id="_clip" >
        </div>
    </div>
</template>
<script>
import ColorThief from 'colorthief'
import { ref } from 'vue';
export default {
    data(){
        return{
            color:ref('')
        }
    },
    methods: {
        joinArtist(array) {
            let s = [];
            for (let item in array) {
                s.push(array[item].name);
            }
            return s.join(" / ");
        },
        async getMainColor(e){
            const colorthief = new ColorThief()
            const color = await colorthief.getColor(e.target)
            this.color = `rgba(${color[0]},${color[1]},${color[2]},0.2)`
        },
    },
    props: ['cover', 'name', 'artist','id']
}
</script>
<style>
.starpick-main {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
    background: var(--app-theme-component);
    border-radius: 5px;
    transition: .3s;
    box-shadow: 2px 2px 15px #0000001e;
}

.starpick-main .starpick-main-bg {
    width: 100%;
    object-fit: contain;
    position: absolute;
    left: -15%;
    mask: linear-gradient(90deg, #000, transparent);
    opacity: 0.5;
    filter: blur(1px);
    z-index: 0;
}

.starpick-main .starpick-main-cover {
    width: 30%;
    height: 85%;
    object-fit: cover;
    position: relative;
    z-index: 1;
    margin-left: 3%;
    border-radius: 5px;
    box-shadow: 2px 2px 15px #0000001e;
}

.starpick-main .starpick-main-info {
    width: 62%;
    height: 85%;
    display: flex;
    gap: 0.3rem;
    flex-direction: column;
    justify-content: start;
    margin-left: 2%;
}

.starpick-main .starpick-main-info .name {
    margin-top: 2%;
    font-weight: 600;
    width: 90%;
    opacity:var(--FM-title-text-opacity);
    font-size: 1.5rem;
}

.starpick-main .starpick-main-info .artist {
    font-size: 1.05rem;
    opacity: var(--FM-artist-text-opacity);
}
.starpick-main .starpick-main-info .FM {
    font-size: 1rem;
    opacity: var(--text-opacity-3);
    margin: auto auto 5px 0px;
    font-weight: 600;
}
.starpick-main .starpick-btn{
    position: absolute;
    right: 3%;
    bottom: 7.5%;
    width: 3rem;
    height: 3rem;
    background: var(--app-theme-decoration);
    z-index: 3;
    border-radius: 50%;
    display: flex;
    opacity: 0.8;
}
.starpick-btn .ic{
    width: 50%;
    filter: invert(100%);
    margin: auto;

}
</style>