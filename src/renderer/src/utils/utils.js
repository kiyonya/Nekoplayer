import { showMessageNotification } from "@/components/notification/use_notification"
import { player, toolkit } from "@/main"

export function debounce(func, wait, immediate = false) {
  let timeout
  return function (...args) {
    const context = this
    if (immediate && !timeout) {
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (!immediate) {
        func.apply(context, args)
      }
      timeout = null
    }, wait)
  }
}

export function trackMenuSelected(track,item,source,playTracks) {
  let id = track?.id
  let name = track?.name
  const act = item?.act
  const actions = {
    play: () => {
      playTracks(id)
    },
    addnext: () => {
      
      player.addTrackToNext(id, source)
    },
    browser: () => {
      const url = `https://music.163.com/#/song?id=${id}`
      window.electron.ipcRenderer.send('app:openWebView', url)
    },
    copylink: () => {
      const url = `https://music.163.com/#/song?id=${id}`
      window.navigator.clipboard.writeText(url)
      showMessageNotification("已复制")
    },
    downloadlyric: () => {
      toolkit.downloadLyric(id,name)
    },
    downloadNloLyric: () => {
      toolkit.downloadNloLyric(id,name)
    }
  }
  if (actions[act]) {
    actions[act]()
  }
}