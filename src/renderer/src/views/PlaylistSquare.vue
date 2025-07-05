<template>
    <div class="page">
        <h2 class="pt">发现歌单</h2>
        <div class="block cats">
            <RouterLink v-for="tag in personalizedTags" class="link" :to="{ name: 'PlaylistCategory', params: { cat: tag?.tag } }" @click="lastChioce = '';showSelector = false">
                {{ tag?.tag }}
            </RouterLink >
            <button @click="showSelector = !showSelector" class="link" :class="{highlight:lastChioce || showSelector}">
                {{ lastChioce || '分类' }}
                <Icon icon="icon-park-solid:down-one" :class="{r:showSelector}" style="transition: .2s;"/>
            </button>
        </div>

        <div class="cats-view" :class="{ show: showSelector }">
            <div class="cat" v-for="cat in playlistCats" v-show="showSelector">
                <span class="cat-name">{{ cat?.cat }}</span>
                <div class="cat-subs">
                    <span v-for="(sub, index) in cat?.sub" :style="{ animationDelay: index * 0.02 + 's' }" class="warp-in">
                        <RouterLink :to="{ name: 'PlaylistCategory', params: { cat: sub?.name } }" class="link" @click="lastChioce = sub?.name;showSelector = false" :class="{highlight:lastChioce === sub?.name}">
                            {{ sub?.name }}
                        </RouterLink>
                    </span>

                </div>
            </div>
        </div>

        <div class="block" v-for="block in blocks">
            <h2 class="ti">{{ block?.uiElement?.mainTitle?.title }}</h2>
            <div class="g-shell-6">
                <PlaylistCard
                    v-for="creative in block?.creatives?.slice(0, (block?.creatives?.length <= 6 ? (deviceScreenSize < 1 ? 5 : 6) : deviceScreenSize < 1 ? 10 : 12))"
                    :name="creative?.uiElement?.mainTitle?.title" :cover="creative?.uiElement?.images?.[0]?.imageUrl"
                    :id="creative?.creativeId" :key="creative?.creativeId" 
                     @playall="player.playPlaylist(null, null, { type: 'playlist', id: creative?.creativeId },true)"/>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getPlaylistSquare, getPlaylistCatlist,getPersonalizedPlaylistTag } from '@/api/playlist';
import PlaylistCard from '@/components/PlaylistCard.vue';
import { ref, computed, onDeactivated } from 'vue';
import { onMounted } from 'vue';
import { store } from '@/store';
import { onActivated } from 'vue';
import { onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { player } from '@/main';
const deviceScreenSize = computed(() => {
    return store.state.deviceScreenSize
})
let lastLoadTime = 0
let blocks = ref([])
let playlistCats = ref([])
let showSelector = ref(false)
let personalizedTags = ref([])
let lastChioce = ref("")
let initLoad = true
function initialLoad() {
    getPlaylistCatlist().then(cats => {
        playlistCats.value = cats
    })
    getPersonalizedPlaylistTag().then(data=>{
        personalizedTags.value = data?.data
    })
}
function loadContent() {
    getPlaylistSquare().then(data => {
        blocks.value = data?.data?.blocks
        getPlaylistSquare(data?.data?.cursor).then(data => {
            blocks.value.push(...data?.data?.blocks)
        })
        lastLoadTime = Date.now()
        initLoad = false
    })
}
onMounted(() => {
    Promise.resolve().then(() => {
        initialLoad()
        loadContent()
    })

})
onActivated(() => {
    if (Date.now() - lastLoadTime > 3 * 60 * 1000 && !initLoad) {
        loadContent()
    }
})
onUnmounted(() => {
    blocks = null
    initLoad = true
})
</script>
<style scoped>
.page {
    gap: 1.2rem;
    padding-top: 2rem;
}

.block {
    width: 93%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    .ti {
        font-weight: 600;
        font-size: 1.5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        color: var(--strong);
    }
}

.block:last-child {
    margin-bottom: 7rem;
}

@keyframes warp-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.cats {

    width: 93%;
    display: flex;
    flex-direction: row;
    align-items: center;
    
    .link:hover{
        background: var(--strong);
    }
}

.cats-view {
    display: flex;
    flex-direction: column;
    width: 93%;
    background: var(--component-diff);
    box-sizing: border-box;
    opacity: 0;
    gap: 0.8rem;
    border-radius: var(--br-1);
    height: 0rem;
    padding: none;
    transition: .2s;
    transform-origin: top center;
    transform: scaleY(0) skewX(100px);
    overflow: hidden;
    backdrop-filter: blur(4px);

    .cat {
        display: flex;
        flex-direction: row;
        gap: 1.6rem;
        width: 100%;
        align-items: center;
        border-bottom: 1.6px solid var(--border);
        padding-bottom: 0.6rem;


        .cat-name {
            width: fit-content;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .cat-subs {
            flex: 1;
            height: fit-content;
            display: inline-flex;
            white-space: auto;
            flex-wrap: wrap;
            gap: 0.8rem;
        }

        .warp-in {
            opacity: 0;
            animation: warp-in 0.5s forwards;
        }

        
    }

    .cat:last-child {
        border: none;
    }
}
.link {
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
.show {
    padding: 1rem;
    height: 26rem;
    opacity: 1;
    transform: scaleY(1);
}
.highlight{
    background: var(--strong);
}
.r{
    transform: rotate(180deg);
}
</style>