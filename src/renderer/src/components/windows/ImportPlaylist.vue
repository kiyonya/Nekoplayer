<template>
  <ModalWindow :mask="true" @close="emits('close')">
    <h1>导入歌单</h1>
    <span v-if="importTaskId">已创建任务:{{ importTaskId }} 请耐心等待完成</span>
    <div class="methods">
      <span @click="importmode = 'local'" :class="importmode == 'local' ? 'hl' : ''">元数据导入</span>
      <span @click="importmode = 'link'" :class="importmode == 'link' ? 'hl' : ''">链接导入</span>
      <span @click="importmode = 'text'" :class="importmode == 'text' ? 'hl' : ''">文字导入</span>
    </div>
    <div class="display">
      <div class="import-data shell" v-show="importmode === 'local'">

        <div class="local-form" ref="localdataImportForm">
          <div class="head">
            <span class="serial">#</span><span>歌名</span><span>艺术家</span><span>专辑</span>
          </div>
          <div v-for="(row,index) in localdataImportRows" class="rows">
            <span class="serial">{{index + 1 }}</span>
            <input type="text" class="name" placeholder="请输入歌名" v-model="row.name"/>
            <input type="text" class="artist" placeholder="请输入艺术家" v-model="row.artist"/>
            <input type="text" class="album" placeholder="请输入专辑" v-model="row.album"/>
          </div>
        </div>
        
        <div class="local-tool row">
          <button @click="localdataImportRows.push({name:'',artist:'',album:''})" class="strong-button">增加一行</button>
          <button @click="localdataImportRows = [{name:'',artist:'',album:''}]">清空</button>
          <button title="从我的本地音乐导入" @click="showLocalMusicSelector = true">本地音乐库导入</button>
        </div>
      </div>
      <div class="import-link" v-show="importmode === 'link'" ref="linkImportForm">
        <div class="links-shell">
          <div class="link" v-for="link in linkdataImportRows">
          <input type="url" name="" id="" class="link-input input-style" placeholder="请输入链接"/>
          <button
            class="remove"
            @click.stop="
              (e) => {
                e.target.parentNode.remove()
              }
            "
          >
          删除
          </button>
        </div>
        </div>
        <button @click="linkdataImportRows++">增加链接</button>
      </div>
      <div class="import-text" v-show="importmode === 'text'">
        <textarea name="" id="" ref="textImportForm" class="text-input"></textarea>
      </div>
    </div>
    <div class="import-setting">
      <span>歌单名称</span>
      <input type="text" placeholder="歌单名称" v-model="playlistName" class="input-style" />
     <div class="row">
      <input type="checkbox" name="import-in-like" id="" ref="importInLike" />
      <label for="import-in-like">导入我喜欢的歌单</label>
     </div>
     <div class="row  self-bottom to-right">
      <button @click="createTask()" class="strong-button">创建任务</button>
      <button @click="emits('close')">取消</button>
     </div>
      
    </div>
  </ModalWindow>
  <SelectLocalMusic v-if="showLocalMusicSelector" @close="showLocalMusicSelector = false" @select="(val)=>{handleLocalLibImport(val);showLocalMusicSelector = false}"></SelectLocalMusic>
</template>
<script setup>
import { ref } from 'vue'
import ModalWindow from './ModalWindow.vue'
import { getMetaFromFile, usePlaylistImport } from './usePlaylistImport';
import { taskResult,taskMsg,importTaskId } from './usePlaylistImport';
import SelectLocalMusic from './SelectLocalMusic.vue';
import { readFileIterated } from '@/lib/io';
import { Icon } from '@iconify/vue';
const importmode = ref('local')
const localdataImportRows = ref([{name:'',artist:'',album:''}])
const linkdataImportRows = ref(1)
const linkImportForm = ref(null)
const textImportForm = ref(null)
const importInLike = ref(null)
const playlistName = ref('')


const showLocalMusicSelector = ref(false)

const emits= defineEmits(['close'])


function handleLocalCollect() {
  let result = []
  localdataImportRows.value.forEach(i=>{
    if(i.name && (i.artist || i.album)){
      result.push(i)
    }
  })
  return result.length > 0 ? result : null
}
function handleLinkCollect() {
  const form = linkImportForm.value
  let result = []
  const links = form.querySelectorAll('.link-input')
  links.forEach((element) => {
    if (element.value) {
      result.push(element.value)
    }
  })
  return result.length > 0 ? result : null
}
function handleTextCollect() {
  const form = textImportForm.value
  if (form.value) {
    return form.value
  }
}
function collect(mode) {
  let res
  if (mode === 'local') {
    let local = handleLocalCollect()
    if (local) {
      res = JSON.stringify(local)
    }
  } else if (mode === 'link') {
    let link = handleLinkCollect()
    if (link) {
      res = JSON.stringify(link)
    }
  } else if (mode === 'text') {
    let text = handleTextCollect()
    if (text) {
      res = text
    }
  }
  return res
}
async function createTask() {
  let mode = importmode.value
  let enc = collect(mode)
  if (!enc) {
    alert('空字段')
    return
  }
  let name = playlistName.value
  let fav = importInLike.value.checked

  usePlaylistImport({mode:mode,enc:encodeURIComponent(enc),name:name,fav:fav},(status)=>{


  })
}


function handleLocalLibImport(val){
  let fs = readFileIterated(val.path,{extendNameFilter:['mp3','flac','wav']})
  fs.forEach(async (path)=> {
    let meta = await getMetaFromFile(path)
    localdataImportRows.value.push(meta)
  })
}



</script>
<style scoped>
.methods {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  font-size: 1.5rem !important;
  margin-bottom: 1rem;
}
.methods span {
  opacity: 1;
}
.hl{
  color: var(--app-theme-strong);
  
}
.h1::before{
  content: '';
  width: 100%;
  position: absolute;
  bottom: -1rem;
  display: block;
  height: 4px;
  background: var(--app-theme-strong);
}
.display {
  width: 40rem;
  height: 30rem;
  min-height: 20rem;
}
.shell{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.local-form{
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 24rem;
  overflow-y: auto;
  padding-bottom: 2rem;
}
.links-shell{
  max-height: 24rem;
  overflow-y: auto;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.local-form .rows,.head{
  width: calc(100% - 1rem);
  height: fit-content;
  justify-content: center;
  align-items: center;
  display: grid;
  gap: 0.8rem;
  grid-template-columns: 0.1fr 1fr 1fr 1fr;
  

}
.local-form .head{
  position: sticky;
  top: 0;
  background: var(--app-theme-component);
  z-index: 9;
}
.local-form .rows input{
  width: calc(100% - 1.8rem);
 margin: auto;
  height: fit-content;
  padding: .4rem .9rem;
  background: var(--hover);
  border: none;
  border-radius: var(--br-1);
  outline: none;
  color: var(--text-color);
  font-size: 1rem;
}
.local-form .rows input:focus{
  outline: 1.5px solid var(--app-theme-strong);
}



.import-link{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.link {
  display: flex;
  flex-direction: row;
}
.link .link-input{
  flex: 1;
  border-radius: var(--br-1) 0 0 var(--br-1);
}
.link .remove{
  border-radius: 0 var(--br-1) var(--br-1) 0;
 
}
.link .remove  .icon{
    width: 1.6rem;
    height: 1.6rem;
  }
.link .remove:active{
  transform: none;
}
.link .remove:hover{
  background: rgb(255, 70, 70);
  color: #fff;
}
.import-setting {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.import-setting input[type="checkbox"]{
  width: 1.3rem;
  height: 1.3rem;
  border: 1px solid #000;
  border-radius: var(--br-1);
}
.import-setting input[type="checkbox"]:checked{
  background-color: var(--app-theme-strong);
}
.serial{
  width: 100%;
  text-align: center;
}
.input-style{
  padding: .4rem .9rem;
  background: var(--hover);
  border: none;
  border-radius: var(--br-1);
  outline: none;
  color: var(--text-color);
  font-size: 1rem;
}.text-input{
  width: calc(100% - 1rem);
  height: 24rem;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.5rem;
  outline: none;
  border: none;
  border-radius: var(--br-1);
  overflow-y: auto;
  resize: none;
  background-color: var(--hover);
  font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.text-input:focus{
  outline: 1.5px solid var(--app-theme-strong);
}
</style>
