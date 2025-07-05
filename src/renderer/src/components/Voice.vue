<template>
    <div class="voice" @dblclick.stop="$emit('play',id)" :class="{onplay:$store.state.musicInfo.id == id}">
        <div class="index">{{ (index + 1).toString().padStart(2,"0") }}</div>
        <div class="cover">
            <img :src="cover" alt="">
            <Icon icon="material-symbols:play-arrow-rounded" class="i" @click.stop="$emit('play',id)"/>
        </div>
        <div class="name text-limit">{{ name }}</div>
        <div class="duration">{{ formatMillisecondsToMMSS(duration)}}</div>
        <div class="time">{{ getDate(update) }}</div>
    </div>
</template>
<script>
import { getDate } from '@/utils/timers';
import { Icon } from '@iconify/vue';
export default {
    components:{
        Icon
    },
    name: "Voice",
    props: [
        "name", "update", "duration", "id", "cover", "index"
    ],
    methods: {
        getDate,
        formatMillisecondsToMMSS(milliseconds) {
            const ms = Number(milliseconds);
            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            return `${formattedMinutes}:${formattedSeconds}`;
        }
    },
    emits:['play']
}
</script>
<style scoped>
.voice {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 4rem;
    align-items: center;
    gap: 0.8rem;
    position: relative;
    box-sizing: border-box;
    padding: 0 0.8rem;
    border-radius: var(--br-1);

    .cover {
        width: 3.2rem;
        aspect-ratio: 1/1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 100%;
            aspect-ratio: 1/1;
            border-radius: var(--br-1);
        }

        .i{
        position: absolute;
        font-size:2.5em;
        opacity: 0;
    }
    }
    .index{
        font-size: 0.9rem;
        font-weight: bold;
        color: var(--text-o-3);
    }
    .name{
        font-size: 1.1rem;
        font-weight: bold;
        max-width: 35rem;
        color: var(--text-o-2);
    }
    .duration{
        position: absolute;
        left: 70%;
        color: var(--text-o-3);
    }
    .time{
        position: absolute;
        right: 0.8rem;
        color: var(--text-o-3);
    }  

    
}
.voice:hover{
    background: var(--component-diff);
    box-shadow: var(--shadow);

    .cover .i{
        opacity: 1;
    }

    .cover img{
        filter: brightness(0.75);
    }
}
</style>