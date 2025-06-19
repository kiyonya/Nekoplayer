<template>
    <ModalWindow @close="emits('close')" :title="'创建或加入一起听'">
        <div class="create shell">
            <h3 class="title" @click="player.createListentogetherRoom()">创建一起听</h3>
        </div>
        <div class="join shell">
            <h3 class="title">加入一起听</h3>
        </div>
    </ModalWindow>
</template>
<script setup> 
    import { ref } from 'vue';
    import ModalWindow from './windows/ModalWindow.vue';
import { player } from '@/main';
    const emits = defineEmits(['close'])
    const tab = ref('create')
</script>
<style scoped>

    .shell{
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 0.6rem;
        background: var(--component-diff);
    }
    .title{
        font-size: 1.1rem;
        color: var(--text);
    }
</style>