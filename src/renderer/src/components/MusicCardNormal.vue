<template>
    <div class="music-card" @dblclick="this.$emit('play', trackDetial?.id)" tabindex="1"
        @keydown.enter="this.$emit('play', trackDetial?.id)">
        <div class="cover-shell" :class="{ 'active': this.$store.state.musicInfo.id == trackDetial.id }">
            <img :data-src="resize(trackDetial?.cover, 500)" alt="" class="main-cover" v-lazy>
            <img :data-src="resize(trackDetial?.cover, 500)" alt="" class="blur-cover" v-lazy>
            <button class="play-btn" @click="this.$emit('play', trackDetial?.id)">
                <Icon icon="material-symbols:play-arrow-rounded" class="icon" />
            </button>
        </div>
        <span class="sub">
            <ArtistNameGroup :array="trackDetial?.artist?.slice(0, 1)" class="artist"></ArtistNameGroup><span
                class="time">{{ mmss(trackDetial?.duration) }}</span>
        </span>
        <span class="name">{{ trackDetial?.name }}</span>
    </div>
</template>
<script>
import { resize } from '@/utils/imageProcess';
import ArtistNameGroup from './ArtistNameGroup.vue';
import { mmss } from '@/utils/timers';
import { Icon } from '@iconify/vue';
export default {
    name: 'MusicCardNormal',
    components:{
        Icon,ArtistNameGroup
    },
    methods:{
        resize,mmss
    },
    props: {
        trackDetial: {
            type: Object
        },
        source: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    emits: ['play']
}
</script>
<style scoped>
.music-card {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    box-sizing: border-box;
    min-width: 0;

    .cover-shell {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: var(--br-2);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: brightness(0.5);
        transition: .5s;

        img {
            width: 100%;
            aspect-ratio: 1/1;
            position: absolute;
            border-radius: var(--br-2);
        }

        .main-cover {
            z-index: 2;
        }

        .blur-cover {
            z-index: 1;
            width: 95%;
            bottom: -0.5rem;
            filter: blur(20px) saturate(1.1);
            opacity: 0.1;
        }

        .play-btn {
            width: auto;
            height: auto;
            align-items: center;
            justify-content: center;
            background: #ffffff3e;
            backdrop-filter: blur(5px) saturate(1.1) brightness(0.9);
            border: 1px solid #ffffff3d;
            border-radius: 50%;
            color: #fff;
            position: absolute;
            z-index: 4;
            display: none;

            .icon {
                width: 3rem;
                height: 3rem;
            }
        }
    }

    .name {
        font-size: 1.1rem;
        font-weight: bold;
        color: var(--text-o-1);
        position: relative;
        z-index: 3;
    }

    .artist {
        font-size: 0.9rem;

        color: var(--text-o-3);
    }

    .sub {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        justify-content: space-between;
        z-index: 3;

        .time {
            font-size: 0.9rem;
            color: var(--text-o-3);
        }
    }

}

.music-card:hover,
.music-card:focus {
    outline: none;

    .cover-shell {
        filter: none;
    }

    .blur-cover {
        bottom: -1rem;
        opacity: 0.5;
    }

    .play-btn {
        display: flex;
    }
}

.active {
    outline: 2px solid var(--strong);
    filter: none !important;

    .blur-cover {
        bottom: -1rem !important;
        opacity: 0.5 !important;
    }
}
</style>