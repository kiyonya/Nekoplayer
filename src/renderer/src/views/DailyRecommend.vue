<template>
 <div class="page">
    <div class="head">
        <div class="bg" :style="`background-image:url(${cover})`"></div>
        <div class="main">
            <h1>每日推荐</h1>
            <span>根据你的音乐口味生成 · 每天6:00更新</span>
        </div>
    </div>
    <div class="content">
        <Track v-if="tracks"  :tracks="this.tracks" :source="{type:'daily',id:null}" class="tracks"></Track>
    </div>
 </div>
</template>
<script>
import { getDailySong } from '@/api/recommend';
import Track from '@/components/Track.vue';
    export default{
        components:{
            Track
        },
        data(){
            return{
                tracks:[],
                cover:undefined
            }
        },
        methods:{
            async loadDailySong(){
                const data = await getDailySong()
                this.tracks = data.data.dailySongs
                this.cover = data.data.dailySongs[0].al.picUrl
            }
        },
        created(){
            this.loadDailySong()
        }
    }
</script>
<style scoped>
.page{
    width: 100% !important;
    padding: 0 !important;
}
    .head{
        height: 30rem;
        width: 100%;
        display: flex;
        position: relative;
        overflow: hidden;
    }
    .head .bg{
        width: 100%;
        height: 100%;
        position: absolute;
        object-fit: cover;
        filter: saturate(90%)  brightness(0.7);
        z-index: -1;
        background:  no-repeat;
        background-size: cover;
        background-attachment: fixed;
        background-position: center center;
        transform: scale(1.1);
    }
    ._mask{
        width: 100%;
        height: 75%;
        position: absolute;
        bottom: 0;
        background: linear-gradient(to top,var(--app-theme) ,transparent 45%);
        z-index: -1;
    }
    .head .main{
        width: fit-content;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        filter: brightness(1.5);
        gap: 0.3rem;
    }
    .main h1{
        font-size: 5.2rem;
        letter-spacing: 1rem;
    }
    .main span{
        font-size: 1.2rem;
        font-weight: 500;
    }
    .tracks{
        margin-top: 2rem;
    }
    .content{
        width: 98%;
        display: flex;
        justify-content: center;
        background: var(--component);
        margin-top: -2rem;
        border-radius: 2rem 2rem 0 0;
        box-shadow:var(--shadow)
    }
</style>