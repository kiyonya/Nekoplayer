<template>
<ModalWindow :mask="false" @close="emits('close')">
<h1>选择本地音乐库</h1>
<div class="local-lib" v-for="(key,value) in local" @click="emits('select',key)">
    <h2 class="name">{{ key?.name }}</h2>
    <p class="path">{{ key?.path }}</p>
</div>

</ModalWindow>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import ModalWindow from './ModalWindow.vue';
const local = ref({})
function getLocalMusicStorage(){
    const local = JSON.parse(localStorage.getItem("neko_localMusicPath"))||{}
    console.log(local)
    return local
}
const emits = defineEmits(['close','select'])
onMounted(()=>{
    local.value = getLocalMusicStorage()
    
})
</script>
<style scoped>
.local-lib{
    width: calc(100% - 1.6rem);
    height: fit-content;
    padding: 0.2rem 0.8rem;
    background-color: transparent;
    border-radius: var(--br-1);
}
.local-lib:hover{
    background-color: var(--hover);
}
.local-lib .name{
    font-size: 17px;
    color: var(--text-o-2);
}
.local-lib .path{
    font-size: 15px;
    color: var(--text-o-4);
}
</style>