import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getQQPlaylist:(id)=>ipcRenderer.invoke("importer:getQQPlaylist",id),
  openDir:()=>ipcRenderer.invoke("dialog:openDir"),
  fsopen:(opt)=>ipcRenderer.invoke("dialog:fsopen",opt),
  queryAppInfo:()=>ipcRenderer.invoke("app:info"),
  readDirAudioFile:()=>ipcRenderer.invoke('localmusic:readDirAudioFile',dir,filter),
  getSongsMeta:()=>ipcRenderer.invoke('localmusic:getSongsMeta',files)
}


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
