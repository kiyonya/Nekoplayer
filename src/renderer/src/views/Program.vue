<template>
    <div class="page">
        <div class="head">
            <div class="cover" style="opacity: 1;">

                <!--@load="($event) => { $event.target.parentElement.style.opacity = '1' }"-->
                <img :src="detail?.picUrl + `?parma=500y500`" alt="" class="main" />
                <img :src="detail?.picUrl + `?parma=500y500`" alt="" class="blur" />
            </div>
            <div class="info">
                <h2 class="title">{{ detail?.name }}</h2>
                <div class="dj">
                    <img :src="detail?.dj?.avatarUrl" alt="">
                    <span>{{ detail?.dj?.nickname }}</span>
                </div>
                <span class="sub">最后更新于{{ getDate(detail?.lastProgramCreateTime) }} · {{ detail?.programCount
                    }}首节目</span>
                <div class="desc">{{ detail?.desc }}</div>
                <div class="btns">
                    <button @click="playall">
                        <Icon icon="material-symbols:play-arrow-rounded" class="i" />
                        播放
                    </button>
                    <button>
                        <Icon icon="material-symbols:favorite-outline-rounded" class="i" />
                    </button>
                </div>
            </div>

        </div>
        <div class="programs" ref="programs">
            <div class="batch" v-for="(batch) in programBatches" :style="{
                height: batch?.height + 'rem'
            }" :data-page="batch?.page">
            <Voice 
            v-for="(song,index) in batch?.data"
            :name="song?.name"
            :cover="song?.coverUrl + '?param=100y100'"
            :update="song?.createTime"
            :duration="song?.duration"
            :index="index + batch?.baseIndex"
            :id="song?.id"
            :key="song?.id"
            @play="playVoice"
            />
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getDjRadioDetail, getDjRadioProgram,getDjRadioAllVoiceId } from "@/api/program"
import { getDate } from '@/utils/timers';
import { Icon } from '@iconify/vue';
import { nextTick } from 'vue';
import Voice from '@/components/Voice.vue';
import { player } from '@/main';
let detail = ref({})
let programBatches = ref([])
const programs = ref(null)
let batchSize = 20
let singleProgramElementHeight = 4
let more = true
let prid
function load(rid) {
    getDjRadioDetail(rid).then(async data => {
        detail.value = data?.data
        let count = data?.data?.programCount
        let pageCount = Math.ceil(count / batchSize)
        data = null
        for (let i = 0; i < pageCount; i++) {
            programBatches.value.push({
                page: i,
                data: [],
                height: singleProgramElementHeight * ((count - i * batchSize) > batchSize ? batchSize : count - i * batchSize),
                loaded: false,
                baseIndex:batchSize * i
            })
        }
        await nextTick(() => {

            let loaderOb = new IntersectionObserver((entries) => {
                entries.forEach(enter => {
                    if (enter.isIntersecting && more) {
                        let page = enter.target.dataset.page
                        if(programBatches.value[page].loaded){
                            return
                        }
                        getDjRadioProgram(rid,page,batchSize).then(data=>{
                            programBatches.value[page].data = data?.programs
                            programBatches.value.loaded = true
                            more = data?.more
                            loaderOb.unobserve(enter.target)
                            if(programBatches.value.every(i=>i.loaded)){
                                loaderOb.disconnect()
                                loaderOb = null
                            }   
                        })
                    }
                })
            })
            if (programs.value) {
                let batchs = programs.value.children
                for (let batch of batchs) {
                    loaderOb.observe(batch)
                }
            }
        })
    })
}
onMounted(() => {
    let rid = useRoute().params.id
    Promise.resolve().then(load(rid))
    prid = rid
})
function playVoice(id){
    let source = {
        id:prid,
        type:"voicelist"
    }
    player.playVoiceList(id,null,source)
}
function playall(){
     let source = {
        id:prid,
        type:"voicelist"
    }
    player.playVoiceList(null,null,source,true)
}
</script>
<style scoped>
.head {
    position: relative;
    margin-top: 3rem;
    margin-bottom: 1.8rem;
    width: 93%;
    height: 16rem;
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: 1.5rem;
}

.cover {
    height: 100%;
    aspect-ratio: 1/1;
    position: relative;
    display: flex;
    justify-content: center;
    transition: .3s ease;
}

.cover .main {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: var(--br-3);
    object-fit: cover;
}

.cover .blur {
    width: 95%;
    aspect-ratio: 1/1;
    position: absolute;
    border-radius: var(--br-3);
    z-index: -1;
    filter: blur(15px);
    bottom: -1rem;
    opacity: 0.5;
    object-fit: cover;
}

.cover .playcount {
    position: absolute;
    z-index: 10;
    right: 0.5rem;
    top: 0.5rem;
}

.info {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    gap: 0.3rem;

    h2 {
        font-size: 2.2rem;
    }

    .dj {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.12rem;

        img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
        }
    }

    .sub {
        width: fit-content;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        font-weight: 400;
        color: var(--strong);
    }

    .desc {
        width: 90%;
        height: fit-content;
        display: -webkit-inline-box;
        margin: auto auto auto 0px;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        text-overflow: ellipsis;
        opacity: var(--text-o-4);
        font-size: 0.9rem;
    }

    .desc:hover {
        text-decoration: underline;
    }
}

.btns {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    margin: auto auto 0px 0px;
    width: 100%;
    height: 2.5rem;
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
.programs{
    display: flex;
    flex-direction: column;
    width: 93%;
}
</style>