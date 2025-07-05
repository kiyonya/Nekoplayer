import {  contextBridge, desktopCapturer, ipcRenderer, webFrame } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getQQPlaylist:(id)=>ipcRenderer.invoke("importer:getQQPlaylist",id),
  openDir:()=>ipcRenderer.invoke("dialog:openDir"),
  fsopen:(opt)=>ipcRenderer.invoke("dialog:fsopen",opt),
  readDirAudioFile:()=>ipcRenderer.invoke('localmusic:readDirAudioFile',dir,filter),
  getSongsMeta:()=>ipcRenderer.invoke('localmusic:getSongsMeta',files),
  writeBuffer:(id,fpath,buffer)=>ipcRenderer.invoke('file:writeBuffer',id,fpath,buffer),
  readBuffer:(id,fpath)=>ipcRenderer.invoke('file:readBuffer',id,fpath),
  getBillboardVocaloidRank:(year = null,month = null,day = null,r)=>ipcRenderer.invoke('billboard:getVocaloidRank',year,month,day,r),
  readDir:(path,extentions,enu) =>ipcRenderer.invoke('file:readdir',path,extentions,enu),
  deleteFile:(path)=>ipcRenderer.invoke('file:deleteFile',path),
  audioMetaReader:(files)=>ipcRenderer.invoke('file:audioMetaReader',files),
  dialogOpenDir:(opt)=>ipcRenderer.invoke('dialog:openDir',opt),
  dialogOpenFile:(opt)=>ipcRenderer.invoke('dialog:openFile',opt),
  getMd5:(file)=>ipcRenderer.invoke('file:getMd5',file),
  readFileBuffer:(file)=>ipcRenderer.invoke('file:readFileBuffer',file),
  dialogSaveFile:(opt)=>ipcRenderer.invoke('dialog:saveFile',opt),
  writeFile:(file,buffer)=>ipcRenderer.invoke('file:writeFile',file,buffer),
  fileExists:(files)=>ipcRenderer.invoke("file:exists",files),
  fileExist:(file)=>ipcRenderer.invoke("file:exist",file),
  readFileStream:(path)=>ipcRenderer.invoke("file:readFileStream",path)
}


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.webFrame = webFrame
}
