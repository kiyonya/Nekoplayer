<template>
  <div class="page">
    <div class="head">
      <h1 class="title">本地音乐</h1>
      <button @click="showDirSelector=true"> 创建</button>
      <button > 目录</button>
    </div>

    <ModalWindow id="import" v-if="showDirSelector" @close="showDirSelector = false">
      <button @click="importDir">选择文件夹</button>
    </ModalWindow>
  </div>
</template>
<script setup>
import { openDir } from '@/audioplay/localMusic';
import ModalWindow from '@/components/windows/ModalWindow.vue';
import { onBeforeMount } from 'vue';
import { ref } from 'vue';
const showDirSelector = ref(false)
const activedDirs = ref([])
const songs = ref([])
async function importDir(){
  const path = await openDir()
  if(path){
    addDir(path)
  }
}
function addDir(path){
   activedDirs.value.push(path)
   localStorage.setItem('neko_local_dir',JSON.stringify(activedDirs.value))
}
function removeDir(path){
  const index = activedDirs.value.indexOf(path)
  if(index >= 0){
    activedDirs.value.splice(index,1)
  }
  localStorage.setItem('neko_local_dir',JSON.stringify(activedDirs.value))
}
function setup(){
  activedDirs.value = JSON.parse(localStorage.getItem('neko_local_dir')) || []
}
function readAudioFile(dir){
  
}
onBeforeMount(()=>{
  setup()
})
</script>
<style scoped>
  .head{
    width: 92%;
    height: fit-content;
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    gap: 1.2rem;

    .title{
      font-size: 1.8rem;
      letter-spacing: 2px;
      margin-left:0;
      margin-right: auto;
    }
    button{
      width: fit-content;
      height: fit-content;
      padding: 0.5rem 1.5rem;
      background: var(--ui);
      color: var(--text-o-1);
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 15px;
    }
    
  }
</style>