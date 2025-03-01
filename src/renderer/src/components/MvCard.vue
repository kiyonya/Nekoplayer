<template>
    <div class="mv-card" @mouseenter="hover()" @mouseleave="unhover()" :class="this.previewUrl ? 'allowPreview' :''" @click="$router.push({name:'MV',params:{id:id}})">
        <img :src="this.cover" alt="" class="cover" v-if="!this.previewUrl">
        <div class="playbtn" v-if="!this.allowPreview">
            <img src="@/assets/images/play-round.svg" alt="" class="i">
        </div>
        <div class="preview-shell" v-if="this.previewUrl">
            <img src="@/assets/images/sound-on.svg" alt="" class="i" v-if="!mute" @click="tmute">
            <img src="@/assets/images/sound-mute.svg" alt="" class="i" v-if="mute" @click="tmute">
             <video :src="previewUrl" class="preview"  autoplay loop :muted="this.mute"></video>
        </div>
        <div class="info">
            <span v-if="playCount"><img src="@/assets/images/video.svg" alt="" class="i">{{ this.formatNumber(this.playCount) }}</span>
            <span><img src="@/assets/images/clock.svg" alt="" class="i">{{ this.mmss(this.duration) }}</span>
        </div>
        <span class="name text-limit">{{ name }}</span>
        <span class="date">{{ date }}</span>
    </div>
</template>
<script>
import { formatNumber } from '@/utils/libs';
import { mmss } from '@/utils/timers';
import { getMvPreview } from '@/api/artist';
import router from '@/router';
export default{
    data(){
        return{
            usePreview:false,
            timer:null,
            previewUrl:undefined,
            previewOK:false,
            mute:true
        }
    },
    methods:{
        formatNumber,mmss,getMvPreview,
        hover(){
            if(!this.allowPreview){
                return
            }
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.preview(this.id)
            }, 400);
        },
        unhover(){
            clearTimeout(this.timer)
            this.timer = null
            this.previewUrl = undefined
        },
        tmute(){
            this.mute = !this.mute
        },
        async preview(id){
            this.previewUrl = (await this.getMvPreview(id,240)).data.url
        }
    },
    props:['cover','name','playCount','duration','date','id','allowPreview']
}
</script>
<style scoped>
    .mv-card{
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
       display: flex;
       flex-direction: column;
       min-width: 0;
    }
    .my-card:hover .playbtn{
        opacity: 1;
    }
    .cover{
        width: 100%;
        height: 80%;
        border-radius: 0.5rem;
        object-fit: cover;
    }
    .name{
        width: 90%;
        font-size: 1.1rem;
        font-weight: 600;
        opacity: var(--text-opacity-2);
        margin-top: 0.2rem;
    }
    .date{
        font-size: 0.8rem;
        opacity: var(--text-opacity-4);
       margin-top: -0.1rem;
    }
    .info{
        position: absolute;
        display: flex;flex-direction: row;
        width: 94%;
        padding: 0.2rem 3%;
        height: fit-content;
        font-size: 0.9rem;
        color: #fff;
        bottom: calc(100%  - 80%);
        background: linear-gradient(0deg,#000000a2,transparent);
        border-radius: 0.5rem;
        transition: .3s;
    }
    .info span{
        display: flex;align-items: center;
    }
    .info span:last-child{
        margin: auto 0px auto auto;
    }
    .info span img{
        height: 1rem;
        aspect-ratio: 1/1;
        margin-right: 0.2rem;
    }
    .i{
        filter: invert(1);
    }
    .preview-shell{
        position: relative;
        width: 100%;
        height: 80%;
        top: 0;
        object-fit: cover;
        overflow: hidden;
        border-radius: 0.5rem;
        z-index: 4;
    }
    .preview{
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
    }
    .preview-shell .i{
        width: 1.2rem;
        position: absolute;
        z-index: 6;
        right: 0.8rem;
        bottom: 0.8rem;
        background: #ffffffac;
        padding: 0.3rem;
        border-radius: 0.2rem;
    }
    .playbtn{
        position: absolute;
        width: 100%;
        height: 80%;
        top: 0;
        backdrop-filter: brightness(0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        opacity: 0;
        transition: .3s;
        z-index: 5;
    }
    .playbtn .i{
        width: 3rem;
    }
    .allowPreview:hover .info{
        opacity: 0;
    }
</style>
