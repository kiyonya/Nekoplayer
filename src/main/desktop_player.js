import path from 'path'
import { windowManager } from '.'
import { is } from '@electron-toolkit/utils'
import {app} from "electron"
function getResourcesPath() {
  if (!app.isPackaged) {
    return path.join(__dirname, '../../resources',"/desktopplayer");
  }
  return path.join(process.resourcesPath,"/resources","/desktopplayer");
}
const __mddir__ = getResourcesPath()
export function createDesktopPlayer(htmlEntryName) {
  const mainWindow = windowManager.getWindow('main')
  if (!mainWindow) {
    return
  }
  const desktopPlayer = windowManager.createWindow('desktopplayer', {
    width: 500,
    height: 200,
    resizable: false,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    title: '猫播',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })
   if(fs.existsSync(path.join(__mddir__,`/${htmlEntryName}`))){
    desktopPlayer.loadFile(path.join(__mddir__,`/${htmlEntryName}`,"index.html"))
  }
  if(is.dev){
   desktopPlayer.webContents.openDevTools({
        mode:'detach'
    })
  }
  desktopPlayer.setAlwaysOnTop(true)
  mainWindow.webContents.send('desktop:queryMusicInfo')
  mainWindow.webContents.send('desktop:on')
}

export function killDesktopPlayer() {
  if (windowManager.getWindow('desktopplayer')) {
    windowManager.closeWindow('desktopplayer')
  }
  const mainWindow = windowManager.getWindow('main')
  if (!mainWindow) {
    return
  }
  mainWindow.webContents.send('desktopplayer:off')
}
