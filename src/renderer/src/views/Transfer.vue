<template>
    <div class="page">
        <button @click="test">测试</button>
        <div class="selector">
            <button @click="showPage = 'pending'">下载中 ({{ pending.length }})</button>
            <button @click="showPage = 'completed'">已完成</button>
        </div>
        <div class="tasks" v-if="showPage === 'pending'">
            <div class="task" v-for="task in pending" :key="task?.id">
                <img :src="resize(task?.exdata?.cover, 300, true)" alt="" class="task-cover" v-if="task?.exdata?.cover">
                <div class="detail">
                    <h3 class="name">{{ task?.exdata?.title || task?.fileName }}</h3>
                    <span class="filename" v-if="task.exdata.ncm">{{ task.filePath }}</span>
                    <div class="status">

                        <span>{{ statusMap[task.status]}}</span>
                        <span class="pg" style="width: 1.5rem;">{{ task.progress.toFixed() }}%</span>
                        <div class="progress">
                            <div class="tk" :style="{ width: task.progress + '%' }"></div>
                        </div>
                        <span class="speed">{{ formatSpeed(task.speed) }}</span>

                    </div>
                </div>
                <div class="control">
                    <button @click="task?.status === 'downloading' ? pauseTask(task?.id) : resumeTask(task?.id)" class="ump-btn">
                        <Icon :icon="task?.status === 'downloading' ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'" />
                    </button>

                </div>
            </div>
        </div>
        <div class="tasks" v-if="showPage === 'completed'">
            <div class="task" v-for="task in completed" :key="task?.id">
                <img :src="resize(task?.exdata?.cover, 300, true)" alt="" class="task-cover" v-if="task?.exdata?.cover">
                <div class="detail">
                    <h3 class="name">{{ task?.exdata?.title || task?.fileName }}</h3>
                    <span class="filename" v-if="task.exdata.ncm">{{ task.filePath }}</span>
                    <div class="status">
                        <span>{{ statusMap[task.status]}}</span>
                    </div>
                </div>
                <div class="control">
                    <button @click="highlightFileInExplorer(task?.filePath)" class="ump-btn">
                        <Icon icon="material-symbols:folder" />
                    </button>
                    <button @click="onpenFileInShell(task?.filePath)" class="ump-btn">
                        <Icon icon="material-symbols:open-in-new" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onUnmounted } from 'vue';
import { onMounted, ref } from 'vue';
import { addDownloadTask, downloadPlaylist } from "@/utils/downloader_api"
import { resize } from '@/utils/imageProcess';
import { Icon } from '@iconify/vue';
let pending = ref([])
let downloading = ref([])
let completed = ref([])
let failed = ref([])
let queryInterval = null
let showPage = ref('pending')
let statusMap = {
    pending: "已提交",
    paused: "已暂停",
    downloading: "下载中",
    failed:"失败",
    completed:"已完成"
}
async function test() {
    //https://music.163.com/#/playlist?id=12267840213
    downloadPlaylist(12267840213)
}
function formatSpeed(bytesPerSecond) {
    if (bytesPerSecond === 0) return '0 B/s';

    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    let speed = bytesPerSecond;
    let unitIndex = 0;

    while (speed >= 1024 && unitIndex < units.length - 1) {
        speed /= 1024;
        unitIndex++;
    }

    return `${speed.toFixed(2)} ${units[unitIndex]}`;
}
async function query() {
    const status = await window.electron.ipcRenderer.invoke('file:getDownloadTasksStatus')
    pending.value = status.filter(i => i.status === "pending" || i.status === "downloading" || i.status === "paused")
    completed.value = status.filter(i => i.status === "completed")
    failed.value = status.filter(i => i.status === "failed")
}
function pauseTask(id){
    window.electron.ipcRenderer.invoke("file:downloaderPauseTask",id).then(data=>{
        console.log(data)
    })
}
function resumeTask(id){
    window.electron.ipcRenderer.invoke("file:downloaderResumeTask",id).then(data=>{
        console.log(data)
    })
}
function highlightFileInExplorer(path){
    window.electron.ipcRenderer.invoke("dialog:highlightFileInExplorer",path)
}
function onpenFileInShell(path){
    window.electron.ipcRenderer.invoke("file:openFileWithDefaultApp",path)
}
onMounted(() => {
    queryInterval = setInterval(async () => {
        query()
    }, 500);
})
onUnmounted(() => {
    clearInterval(queryInterval)
    pending = null
    downloading = null
    completed = null
    failed = null
})
</script>
<style scoped>
.page {
    gap: 1.5rem;
}

@keyframes task-in {
    from {
        transform: translateY(70px);
        opacity: 0;
    }
}

.tasks {
    display: flex;
    flex-direction: column;
    width: 93%;
    gap: 0.9rem;

    .task {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        width: 100%;
        background: var(--ui);
        box-shadow: var(--shadow);
        box-sizing: border-box;
        padding: 0.6rem;
        border-radius: var(--br-1);
        animation: task-in .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
    }

    .detail {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        gap: 0.2rem;
    }

    .name {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-o-1);
    }

    .filename {
        font-size: 0.9rem;
        color: var(--text-o-3);
    }

    .status {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-o-1);
        width: 100%;
    }

    .speed {
        min-width: 5rem;
        font-size: 0.9rem;
        color: var(--text-o-2);
        overflow: hidden;
    }

    .progress {
        width: 22rem;
        height: 0.4rem;
        background: var(--text-o-3);
        border-radius: var(--br-1);
        overflow: hidden;
        position: relative;
    }

    .tk {
        width: 0%;
        height: 100%;
        background: var(--strong);
        position: absolute;
        transition: width 0.1s ease-in-out;
    }

    .task-cover {
        width: 8rem;
        height: 5rem;
        object-fit: cover;
        border-radius: var(--br-1);
    }

    .control{
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: auto;
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        
       button{
        font-size: 1.6rem;
        color: var(--text-o-2);
       }
    }
}
.selector{
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    width: 93%;
    button {
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
}
</style>