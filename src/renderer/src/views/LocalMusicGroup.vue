<template>
    <div class="page">

        <div class="head">
            <div class="cover" style="opacity: 1;">
                <img :src="cover" alt="" class="main"
                    @load="($event) => { $event.target.parentElement.style.opacity = '1' }" v-if="cover" />
                <img :src="cover" alt="" class="blur" v-if="cover" :key="cover" />
                <div class="no-cover" v-if="!cover">
                    <Icon icon="material-symbols:music-note" class="i"
                        style="font-size: 4rem; color: var(--text-o-1);" />
                </div>
            </div>
            <div class="detail">
                <h2 class="title">{{ detail?.name }}</h2>
                <span class="local">本地音乐集</span>
                <span class="info">最后更新于 {{ getDate(detail?.updatedAt) }} · {{ count }} 首歌</span>
                <div class="actions">
                    <button>
                        <Icon icon="material-symbols:play-arrow" class="i" style="font-size: 1.2rem;" />
                        <span @click="playAll">播放</span>
                    </button>

                    <button @click="load(true)">
                        <Icon icon="mingcute:refresh-3-line" style="font-size: 1.1rem;" />
                    </button>
                </div>
            </div>
            <div class="import">
                <button @click="importFiles">
                    <Icon icon="tdesign:file-import" />
                    <span>导入音乐</span>
                </button>
                <button @click="importDir">
                    <Icon icon="tdesign:folder-import" />
                    <span>导入文件夹</span>
                </button>
            </div>
        </div>
        <div class="list-display display" v-if="classification=='list'">
            <div class="sort">
            <button @click="sortByDefault" :class="{ 'sort-highlight': sortType === 'default' }">
                默认排序
            </button>
            <button class="sort-by-name" @click="sortByName()" :class="{ 'sort-highlight': sortType === 'name' }">
                <Icon icon="material-symbols:arrow-upward-alt-rounded" style="font-size: 1.2rem;"
                    v-if="sortSelectorState.name" />
                <Icon icon="material-symbols:arrow-downward-alt-rounded" style="font-size: 1.2rem;"
                    v-if="!sortSelectorState.name" />
                <span>名称</span>
            </button>
            <button class="sort-by-size" @click="sortByImportTime()"
                :class="{ 'sort-highlight': sortType === 'importTime' }">
                <Icon icon="material-symbols:arrow-upward-alt-rounded" style="font-size: 1.2rem;"
                    v-if="sortSelectorState.importTime" />
                <Icon icon="material-symbols:arrow-downward-alt-rounded" style="font-size: 1.2rem;"
                    v-if="!sortSelectorState.importTime" />

                <span>时间</span>
            </button>
            <button class="sort-by-size" @click="sortBySize()" :class="{ 'sort-highlight': sortType === 'size' }">
                <Icon icon="material-symbols:arrow-upward-alt-rounded" style="font-size: 1.2rem;"
                    v-if="sortSelectorState.size" />
                <Icon icon="material-symbols:arrow-downward-alt-rounded" style="font-size: 1.2rem;"
                    v-if="!sortSelectorState.size" />
                <span>大小</span>
            </button>
        </div>
        <div class="songs" v-if="songs.length > 0">
            <TransitionGroup name="fade">
                <LocalSong v-for="(song, index) in songs" :key="song.path" :cover="song?.cover" :name="song.name"
                    :path="song.path" :album="song.album" :artist="song.artist" :size="song.size" :index="index"
                    :time="song?.time" :duration="song.duration" :bitrate="song?.bitrate" :lossless="song?.lossless"
                    :codec="song?.codec"
                    :matched="song?.matched"
                    :md5="song?.md5"
                    @play="play" @delete-in-group="deleteInGroup" @delete="deleteFile" @setlyric="setLyric" />
            </TransitionGroup>
        </div>
        </div>
        <div class="artists-display display" v-if="classification=='artist'">
            <div class="artists">

            </div>
        </div>
    </div>
</template>
<script setup>
import { localMusic, player } from '@/main';
import { onBeforeMount, ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import LocalSong from '@/components/LocalSong.vue';
import { getDate } from '@/utils/timers';
import { onActivated } from 'vue';
const cover = ref("")
const detail = ref({})
const id = ref("")
const songs = ref([])
const songsClassficatedByArtist = ref({})
const songsClassficatedByAlbum = ref({})
const classification = ref('list')
const count = ref('')
const sortType = ref('default')
const sortSelectorState = ref({
    name: false,
    size: false,
    importTime: false
})

onActivated(() => {
    load()
})
async function load(reload = false) {
let groupId;
    if (id.value) {
        groupId = id.value
    } else {
        const route = useRoute()
        groupId = route.params.id
        id.value = groupId
    }
    const data = await localMusic.openGroup(groupId)
    if (data?.cover) {
        cover.value = Uni8ArrayToObjectUrl('image/jpeg', data?.cover)
    }
    detail.value = data.detail
    const groupSongs = await localMusic.getSongsDataByMd5(data?.songs)

    songs.value = groupSongs.map((i,index)=>{
        return {
            ...i.data,
            defaultSort: index
        }
    })


     if (sortType.value === 'name') {
         sortByName()
     }
     else if (sortType.value === 'size') {
         sortBySize()
     }
     else if (sortType.value === 'importTime') {
         sortByImportTime()
     }
     count.value = songs.value.length
     updateCover()

    //  mutiClassify(songs.value)
}
function updateCover() {

    for (let song of songs.value) {
        if (song.cover) {
            localMusic.updateGroupCover(id.value,song?.md5).then(unit8Array=>{
                cover.value = Uni8ArrayToObjectUrl("image/jpeg",unit8Array)
            })
            break
        }
    }
}
async function importDir() {
    const dir = await window.api.dialogOpenDir()
    if (dir) {
        localMusic.importDir(id.value, dir).then((res) => {

            load(true)
        })
    }
}
async function importFiles() {
    const files = await window.api.dialogOpenFile({ properties: ['multiSelections'] })
    if (files) {
        localMusic.importFiles(id.value, files).then(res => {
            load(true)
        })
    }
}
function Uni8ArrayToObjectUrl(mime, array) {
    const blob = new Blob([array], { type: mime });
    const url = URL.createObjectURL(blob);
    return url
}
function sortByName() {

    const reverse = sortSelectorState.value.name
    sortType.value = 'name'
    // sortSelectorState.value.size = false
    // sortSelectorState.value.importTime = false
    sortSelectorState.value.name = !sortSelectorState.value.name
    if (reverse) {
        songs.value.sort((a, b) => {
            if (a.name > b.name) return -1
            if (a.name < b.name) return 1
            return 0
        })
        return
    }
    else {
        songs.value.sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
        })
        return
    }

}
function sortBySize(reverse = sortSelectorState.value.size) {
    sortType.value = 'size'
    // sortSelectorState.value.name = false
    // sortSelectorState.value.importTime = false
    sortSelectorState.value.size = !sortSelectorState.value.size
    if (reverse) {
        songs.value.sort((a, b) => {
            if (a.size > b.size) return -1
            if (a.size < b.size) return 1
            return 0
        })
        return
    }
    else {
        songs.value.sort((a, b) => {
            if (a.size < b.size) return -1
            if (a.size > b.size) return 1
            return 0
        })
        return
    }
}
function sortByImportTime(reverse = sortSelectorState.value.importTime) {
    sortType.value = 'importTime'
    // sortSelectorState.value.name = false
    // sortSelectorState.value.size = false
    sortSelectorState.value.importTime = !sortSelectorState.value.importTime
    if (reverse) {
        songs.value.sort((a, b) => {
            if (a.time > b.time) return -1
            if (a.time < b.time) return 1
            return 0
        })
        return
    }
    else {
        songs.value.sort((a, b) => {
            if (a.time < b.time) return -1
            if (a.time > b.time) return 1
            return 0
        })
        return
    }
}
function sortByDefault() {
    sortType.value = 'default'
    songs.value.sort((a, b) => {
        if (a.defaultSort > b.defaultSort) return 1
        if (a.defaultSort < b.defaultSort) return -1
        return 0
    })
}
async function play(md5) {
    const source = {
        id: id.value,
        type: 'localgroup'
    }
    player.playLocalList(md5, songs.value.map(song => {
        return {
            id: song?.md5,
            source
        }
    }), source)
}
function playAll(){
    const first = songs.value?.[0]?.md5
    if(first){
        play(first)
    }
}
function deleteInGroup(md5) {
    localMusic.deleteSong(md5, id.value).then((data) => {
        songs.value = songs.value.filter(i => i.md5 !== md5)
        count.value = songs.value.length
        updateCover()
        //mutiClassify(songs.value)
    })
}
function deleteFile(path,md5) {
    deleteInGroup(md5)
    localMusic.deleteSongFile(path, md5,id.value)
}
function classificationByArtist() {
    const artists = {}
    for (let song of songs.value) {
        for (let artist of song.artists) {
            const ar = artist.split('/').map(i => i.trim())
            for (let i of ar) {
                if (!artists[i]) {
                    artists[i] = []
                }
                artists[i].push(song)
            }
        }
    }

    return artists
}

function classificationByAlbum() {
    const albums = {}
    for (let song of songs.value) {
        if (!albums[song.album]) {
            albums[song.album] = []
        }
        albums[song.album].push(song)
    }

    return albums
}

function mutiClassify(songs){
    songsClassficatedByAlbum.value = classificationByAlbum(songs)
    songsClassficatedByArtist.value = classificationByArtist(songs)
}

async function setLyric(md5){
    localMusic.setLocalLyricFromFile(md5)
}
</script>
<style scoped>
.page {
    padding-top: 1rem;

}

.head {
    width: 92%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    height: fit-content;

    .detail {
        height: 100%;
        display: flex;
        flex-direction: column;

        .title {
            font-size: 2rem;
        }

        .local {
            color: var(--strong);
            font-size: 1.3rem;
        }

        .info {
            color: var(--text-o-3);
            margin-top: 1rem;
        }

    }

    .actions {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin-top: 1rem;
        margin-bottom: 0;
        margin-top: auto;

        button {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: var(--br-1);
            background: var(--ui);
            color: var(--text-o-1);
            font-size: 1rem;
            cursor: pointer;
            transition: .3s ease;
            border: none;

            &:hover {
                background: var(--hover);
            }
        }
    }
}

.cover {
    width: 15rem;
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
    border-radius: 5%;
}

.cover .blur {
    width: 95%;
    aspect-ratio: 1/1;
    position: absolute;
    border-radius: 5%;
    z-index: -1;
    filter: blur(15px);
    bottom: -1rem;
    opacity: 0.3;
}

.cover .no-cover {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 5%;
    background: var(--ui);
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    color: var(--text-o-1);
}

.songs {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 5rem;
}

.import {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: 0;
    margin-top: auto;
    margin-bottom: 0;
    gap: 1rem;

    button {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: var(--br-1);
        background: var(--ui);
        color: var(--text-o-1);
        font-size: 1rem;
        cursor: pointer;
        transition: .3s ease;
        border: none;

        &:hover {
            background: var(--hover);
        }
    }
}
.display {
    width: 92%;
    height: fit-content;
    .title {
        font-size: 1.8rem;
        letter-spacing: 2px;
        margin-left: 0;
        margin-right: auto;
    }
}
.sort {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 0;

    button {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding: 0.3rem 0.7rem;
        border-radius: var(--br-1);
        background: var(--ui);
        color: var(--text-o-1);
        font-size: 1rem;
        cursor: pointer;
        transition: .3s ease;
        border: none;

        &:hover {
            background: var(--hover);
        }
    }
}
.artists-display{
    display: flex;
    flex-direction: row;
    height: calc(100% - 5rem);
    margin-top: 3rem;
    margin-bottom: 3rem;
    .artists{
        width: 15rem;
        height: 100%;
        background-color: var(--component-diff);
        border-radius: var(--br-1);
    }



}
.sort-highlight {
    background: var(--strong) !important;
    color: var(--text-o-1);
    font-weight: bold;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
    position: absolute;
}
</style>