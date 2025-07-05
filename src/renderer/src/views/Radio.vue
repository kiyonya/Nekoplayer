<template>
    <div class="page">
        <h2 class="pt">收听电台</h2>
        <div class="block" v-for="block in renderBlocks">
            <h2 class="ti">{{ block?.uiElement?.mainTitle?.title }}</h2>
            <div class="g-shell-6">
                <VoiceCard
                    v-for="(voice, index) in (block?.creatives.length > 6 ? block?.creatives?.slice(0, deviceScreenSize < 1 ? 10 : 12) : block?.creatives?.slice(0, deviceScreenSize < 1 ? 5 : 6))"
                    :name="voice?.uiElement?.mainTitle?.title"
                    :cover="voice?.uiElement?.image?.imageUrl + '?param=200y200'" :label="voice?.uiElement?.labelTexts"
                    :id="voice?.creativeId" :count="voice?.creativeExtInfoVO?.playCount"
                    v-if="block?.showType === 'VOICE_HOMEPAGE_FIXED_VOICELIST' || block?.showType === 'VOICE_HOMEPAGE_RCMDLIKE_VOICELIST'" />
            </div>
        </div>
    </div>
</template>
<script setup>
import {  getVoiceHomepage } from '@/api/program';
import VoiceCard from '@/components/VoiceCard.vue';
import { store } from '@/store';
import { onActivated } from 'vue';
import { onUnmounted } from 'vue';
import { onMounted, ref, computed } from 'vue';
let recommendLikeVoiceList = ref([])
let renderBlocks = ref([])
let lastLoadTime = 0
const deviceScreenSize = computed(() => {
    return store.state.deviceScreenSize
})
function load() {
    Promise.resolve().then(() => {
        getVoiceHomepage().then(data => {
            let blocks = data?.data?.blocks
            renderBlocks.value = blocks.filter(i => i.blockCode !== "VOICE_HOMEPAGE_BLOCK_WEEKNEW_VOICE" && i.blockCode !== "VOICE_HOMEPAGE_BLOCK_BANNER")
            lastLoadTime = Date.now()
        })
    })
}
onActivated(()=>{
    if (Date.now() - lastLoadTime > 1000 * 60 * 3 || !renderBlocks.value.length) {
        load()
    }
})
onMounted(() => {
    Promise.resolve().then(load)
})
onUnmounted(() => {
    recommendLikeVoiceList = null
    lastLoadTime = 0
    renderBlocks = null
})
</script>
<style scoped>
.page {
    gap: 1.2rem;
    padding-top: 2rem;
}

.block {
    width: 93%;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.block:last-child {
    margin-bottom: 5rem;
}

.ti {
    font-weight: 600;
    font-size: 1.4rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    animation: ti-in .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: var(--strong);

    button {
        width: fit-content;
        height: fit-content;
        padding: 0.3rem;
        font-size: 1rem;
        border: none;
        background: none;
        color: var(--text-o-2);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--br-1);

    }

    button:hover {
        background: var(--hover);
    }
}
</style>