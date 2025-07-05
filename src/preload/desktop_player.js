import { contextBridge, ipcRenderer, webFrame } from 'electron'
const api = {
  onListUpdate: (callback) => {
    const listener = (e, list) => callback(list)
    ipcRenderer.on('desktopplayer:list', listener)
    return () => ipcRenderer.removeListener('desktopplayer:list', listener)
  },
  onTimeUpdate: (callback) => {
    const listener = (e, currentTime) => callback(currentTime)
    ipcRenderer.on('desktopplayer:timeupdate', listener)
    return () => ipcRenderer.removeListener('desktopplayer:timeupdate', listener)
  },
  onLyricUpdate: (callback) => {
    const listener = (e, lyric) => callback(lyric)
    ipcRenderer.on('desktopplayer:lyric', listener)
    return () => ipcRenderer.removeListener('desktopplayer:lyric', listener)
  },
  onNowPlayingUpdate: (callback) => {
    const listener = (e, np) => callback(np)
    ipcRenderer.on('desktopplayer:nowplaying', listener)
    return () => ipcRenderer.removeListener('desktopplayer:nowplaying', listener)
  },
  onNowPlayingUpdate: (callback) => {
    const listener = (e, np) => callback(np)
    ipcRenderer.on('desktopplayer:nowplaying', listener)
    return () => ipcRenderer.removeListener('desktopplayer:nowplaying', listener)
  },
  onStateUpdate: (callback) => {
    const listener = (e, s) => callback(s)
    ipcRenderer.on('desktopplayer:state', listener)
    return () => ipcRenderer.removeListener('desktopplayer:state', listener)
  },
  onPlaymodeChange: (callback) => {
    const listener = (e, s) => callback(s)
    ipcRenderer.on('desktopplayer:playmode', listener)
    return () => ipcRenderer.removeListener('desktopplayer:playmode', listener)
  },
  onVolumeChange: (callback) => {
    const listener = (e, s) => callback(s)
    ipcRenderer.on('desktopplayer:volumechange', listener)
    return () => ipcRenderer.removeListener('desktopplayer:volumechange', listener)
  },
  onCanPlay: () => {
    const listener = (e, d) => callback(d)
    ipcRenderer.on('desktopplayer:canplay', listener)
    return () => ipcRenderer.removeListener('desktopplayer:canplay', listener)
  },
  togglePlay: () => {
    ipcRenderer.send('toplayer:toggleplay')
  },
  resize: (w, h) => {
    ipcRenderer.send('app:resize', 'desktopplayer', w, h)
  },
  previous: () => {
    ipcRenderer.send('toplayer:previous')
  },
  next: () => {
    ipcRenderer.send('toplayer:next')
  },
  seek: (time) => {
    ipcRenderer.send('toplayer:seek', time)
  },
  playSong: (id, source) => {
    ipcRenderer.send('toplayer:playsong', id, source)
  },
  getSongListDetail: (ids) => {
    return ipcRenderer.invoke('cli:getListDetail', ids)
  },
  close: () => {
    ipcRenderer.send('app:closeDesktopPlayer')
  },
  changeVolume: (v) => {
    ipcRenderer.send('toplayer:changevolume', v)
  },
  changePlayMode: (m) => {
    ipcRenderer.send('toplayer:changeplaymode', m)
  },
  webFrame
}
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {}
} else {
  window.api = api
}
