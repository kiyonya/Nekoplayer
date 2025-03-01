import { store } from '@/store'
import { FileDownloader } from '@/utils/downloader'
import { computed, ref, watch } from 'vue'
const fs = require('fs')
const path = require('path')
const filedownloader = new FileDownloader(5)
const taskUrl = ref('')
const taskFilename = ref('')
const tasks = ref({})
const savePath = computed({
  get: () => store.state.config.toolDownloaderSavePath,
  set: (val) => {
    store.commit('config', { key: 'toolDownloaderSavePath', value: val })
  }
})
watch(taskUrl, () => {
  parseFileName(taskUrl.value)
})
function parseFileName(url) {
  try {
    const fileUrl = new URL(url)
    const fpath = fileUrl.pathname.split('/')
    const lastPath = fpath[fpath.length - 1]
    taskFilename.value = lastPath.replace(/\.$/, '')
    return lastPath.replace(/\.$/, '')
  } catch (error) {}
}
export async function setSavePath() {
  const spath = await window.api.fsopen({
    title: '选择下载路径',
    properties: ['openDirectory']
  })
  if (spath) {
    savePath.value = spath[0]
  }
}
export function startDownload() {
  try {
    const url = taskUrl.value
    const saveTo = savePath.value
    const filename = taskFilename.value
    if (!url || !saveTo || !filename) {
       throw new Error("不合法的值");
    }
    const taskID = filedownloader.addTask(url, path.join(saveTo, filename), (p) => {
      tasks.value[taskID] = { name: filename, process: p }
    })
  } catch (error) {
    alert(error)
  }
}
export { taskUrl, taskFilename, tasks }