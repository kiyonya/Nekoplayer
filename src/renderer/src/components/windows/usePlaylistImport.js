import { ref } from 'vue'
import { checkImportTask, importPlaylist } from '../../api/edit'
const importTaskId = ref('')
const taskResult = ref(null)
const taskMsg = ref('')
const musicmeta = require('music-metadata')
const path = require('path')
export {importTaskId,taskResult,taskMsg}
export async function usePlaylistImport(params,callback) {
  let task = await importPlaylist(params)
  const taskId = task.data.taskId

  importTaskId.value = taskId

  let retry = 10
  let checkTimer = setInterval(async () => {
    if (retry === 0) {
      clearInterval(checkTimer)
      alert('导入不正确，请检查')
      return
    }
    let taskStatus = await checkImportTask(taskId)
    let tasks = taskStatus.data.tasks
    taskMsg.value = taskStatus.data.taskProcess
    if (taskStatus.code === 200) {
      
      if (
        tasks.every((i) => {
          return i.status === 'COMPLETE'
        })
      ) {
        clearInterval(checkTimer)
        alert(taskMsg.value)
        taskMsg.value = ''
        importTaskId.value = ''
        callback(tasks)
      }
    } else {
      retry--
    }
  }, 3000)
}
export async function getMetaFromFile(filepath) {
  let meta = await musicmeta.parseFile(filepath)
  let name = meta.common.title || path.basename(filepath)
  let artist = meta.common.artist || ''
  let album = meta.common.album || ''
  return {name,artist,album}
}