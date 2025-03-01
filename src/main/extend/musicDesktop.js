import { BrowserWindow, screen } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import path from "node:path"
export function createWaveDesktop() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  const waveDesktopWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    type:'desktop',
    resizable: false,
    fullscreen:true,
    show: false,
    alwaysOnTop:false,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: false
    }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    waveDesktopWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/wavedesktop')
  } else {
    console.log('进入electron statistic')
    waveDesktopWindow.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: 'wavedesktop' })
  }
  return waveDesktopWindow
}
