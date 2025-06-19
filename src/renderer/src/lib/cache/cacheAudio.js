import { store } from '@/store'
import { computed } from 'vue'
import { FileDownloader } from '@/utils/downloader'
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const fileDownloader = new FileDownloader(3)
const fileCachePath = computed(() => {
  const datapath = store.state.appInfo?.sessionData
  if (datapath) {
    return path.join(datapath, 'Cache', 'Cache_File')
  }
  return null
})
function getAudioExt(quality){
    if(['standard','higher','exhigh'].includes(quality)){return "mp3"}
    else return "flac"
}
export function initFileCache() {
  if (!fileCachePath.value) {
    return
  }
  const exists = fs.existsSync(fileCachePath.value)
  if (!exists) {
    fs.mkdirSync(fileCachePath.value, { recursive: true })
  }
}
/**
 * 缓存音频
 * @param {number} id
 * @param {string} url
 * @param {string} quality
 */
export function cacheAudioFromUrl(id, url, quality, type = 'audio') {
  let filename = md5String([type, id, quality].join('_')) + `.${type}`
  if(fs.existsSync(path.join(fileCachePath.value, filename))){return}
  fileDownloader.addTask(url, path.join(fileCachePath.value, filename))
}
export function readAudioCacheFile(id,quality,type="audio"){
    let filename = md5String([type, id, quality].join('_'))   
    let filepath = path.join(fileCachePath.value, filename + `.${type}` )
    if(!fs.existsSync(filepath)){return null} 
    return filepath
}
export function clearAudioCache(){
  if(!fs.existsSync(fileCachePath.value)){return}
  const files = fs.readdirSync(fileCachePath.value)
  for(let file of files){
    fs.unlinkSync(path.join(fileCachePath.value,file))
  }
}
export function getAudioCacheUsage(){
  if(!fs.existsSync(fileCachePath.value)){return}
  let size = 0
  const files = fs.readdirSync(fileCachePath.value)
  for(let file of files){
    const stats = fs.statSync(path.join(fileCachePath.value,file))
    size += stats.size
  }
  return size
}
function md5String(string) {
  const hash = crypto.createHash('md5')
  hash.update(string)
  return hash.digest('hex')
}
window.rc = clearAudioCache
window.ru = getAudioCacheUsage
