import { is } from '@electron-toolkit/utils'
import { windowManager } from '.'
import { attach, detach } from 'electron-as-wallpaper'
import { screen,app } from 'electron'
import path from 'path'
import fs from 'fs'
function getResourcesPath() {
  if (!app.isPackaged) {
    return path.join(__dirname, '../../resources',"/musicdesktop");
  }
  return path.join(process.resourcesPath,"/resources","/musicdesktop");
}
const __mddir__ = getResourcesPath()
export function createMusicDesktop(desktopHtmlName) {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  const musicDesktop = windowManager.createWindow('musicdesktop', {
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    type: 'desktop',
    resizable: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      sandbox: false,
      contextIsolation: false,
      preload: path.join(__dirname, '../preload/index.js'),
    }
  })
  if(fs.existsSync(path.join(__mddir__,`/${desktopHtmlName}`))){
    musicDesktop.loadFile(path.join(__mddir__,`/${desktopHtmlName}`,"index.html"))
  }

  if(is.dev){
    musicDesktop.webContents.openDevTools({
        mode:'detach'
    })
  }
  
  musicDesktop.on('ready-to-show',()=>{
    attach(musicDesktop)
  })
}

export function killMusicDesktop(){
    if(windowManager.getWindow('musicdesktop')){
        windowManager.closeWindow('musicdesktop')
    }
    return true
}
