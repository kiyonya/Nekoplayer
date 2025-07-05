import { getPlaylistDetial } from "@/api/playlist"
import { getSongDetial, getSongUrl, getSongUrlBatch } from "@/api/song"
import { store } from "@/store"
import { computed } from "vue"

const downloadPath = computed(()=>store.state.config.downloadPath)
const downloadQuality = computed(()=>store.state.config.downloadQuality || 'lossless')
/**
 * @param {Array} tasks
 */
export async function addDownloadTask(tasks) {
  let taskIds = []
  let savePath = downloadPath.value
  if(!savePath){
    const dir = await window.api.dialogOpenDir()
    if (dir) {
        savePath = dir
        store.commit("config",{key:"downloadPath",value:dir})
    }
  }
  for (let task of tasks) {
    const { url, fileName,exdata } = task
    let taskid = await window.electron.ipcRenderer.invoke('file:addDownloadTask', {
      url,
      savePath,
      fileName:fileName,
      exdata:exdata || {}
    })
    taskIds.push(taskid)
  }
  return taskIds
}
async function getSongDownloadData(ids) {
  let data = {}
  const detail =( await getSongDetial(ids.join(",")))?.songs
  const urls = (await getSongUrlBatch(ids,'exhigh'))?.data
  for(let i of detail){
    data[i?.id] = {
      title:i.name,
      artist:i.ar.map(i=>i.name).join(","),
      album:i?.al?.name,
      cover:i?.al?.picUrl,
      url:"",
      id:i?.id,
      ncm:true
    }
  }
  for(let i of urls){
    data[i?.id].url = i?.url
    data[i?.id].format = i?.type
  }
  return (Object.values(data).filter(i=>i.url))
}
export async function downloadPlaylist(pid,batchSize = 50) {
  
  const dt = await getPlaylistDetial(pid)
  let ids = dt?.playlist?.trackIds.map(i=>i.id)
  let batches = []
  for(let i = 0;i < ids.length;i += batchSize){
    batches.push(ids.slice(i,i+batchSize))
  }
  batches = batches.map(ids=>getSongDownloadData(ids))
  let downloadDatas = (await Promise.all(batches))[0]

  let tids = await addDownloadTask(downloadDatas.map(i=>({
    url:i?.url,
    fileName:`${i?.title}-${i?.artist}.${i.format}`,
    exdata:i,
  })))
  return tids
}