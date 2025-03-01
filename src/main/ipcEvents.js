import localAPI from './local_music_loader'
import { logger } from './log'
const {
  ipcMain,
  app,
  dialog,
  ipcRenderer,
  Tray,
  Menu,
  nativeImage,
  powerSaveBlocker,
  powerMonitor
} = require('electron')
const path = require('path')
export function registIPC(windowManager) {
  ipcMain.on('app:openWebView', (e, url) => {
    const webView = windowManager.createWindow('webview')
    webView.loadURL(url)
  })
  ipcMain.on('app:msgbox', (e, opt) => {
    const { title = '信息', message = '默认信息' } = opt
    const msg = dialog.showMessageBox(windowManager.getWindow('main'), {
      title,
      message
    })
  })
  ipcMain.on('main:close', () => {
    windowManager.closeAllWindows()
    app.quit()
  })
  ipcMain.on('main:maximize', () => {
    windowManager.maximize('main')
  })
  ipcMain.on('main:minimize', () => {
    windowManager.minimize('main')
  })
  ipcMain.on('app:close', () => {
    windowManager.closeAllWindows()
    app.quit()
  })
  ipcMain.on('shell:openExplorer', (e, path) => {
    openExplorer(path)
  })
  //   ipcMain.handle('dialog:fsopen', async (e, opt) => {
  //     const path = await fsopen(opt)
  //     return path
  //   })
  ipcMain.handle('app:info', () => {
    return {
      appPath: app.getAppPath(),
      appData: app.getPath('appData'),
      temp: app.getPath('temp'),
      exe: app.getPath('exe'),
      sessionData: app.getPath('sessionData'),
      logs: app.getPath('logs'),
      version: app.getVersion(),
      metrics: app.getAppMetrics(),
      musicPath: app.getPath('music')
    }
  })
  ipcMain.handle('localmusic:readDirAudioFile',(e,dir,filter)=>{
    return localAPI.readDirAudioFile(dir,filter)
  })
  ipcMain.handle('localmusic:getSongsMeta',(e,files)=>{
    return localAPI.getSongsMeta(files)
  })
  ipcMain.on('app:registerGlobalShotcut', (e, shotcut) => {})
  ipcMain.on('log', (event, level, message) => {
    logger[level](message)
  })
}

export function registerTray() {
  const ico = nativeImage.createFromPath('./assets/icon.png')
  const tray = new Tray(ico)
  const menu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setContextMenu(menu)
  tray.setToolTip('nekoplayer')
}

export function registerPowerEvents() {
  let noSuspensionId
  if (!powerMonitor.isOnBatteryPower()) {
    noSuspensionId = powerSaveBlocker.start('prevent-app-suspension')
  }
  powerMonitor.on('on-battery', () => {
    if (noSuspensionId && powerSaveBlocker.isStarted(noSuspensionId)) {
      powerSaveBlocker.stop(noSuspensionId)
      noSuspensionId = undefined
    }
  })
  powerMonitor.on('on-ac', () => {
    if (!noSuspensionId || !powerSaveBlocker.isStarted(noSuspensionId)) {
      noSuspensionId = powerSaveBlocker.start('prevent-app-suspension')
    }
  })
}
async function fsopen(opt) {
  const path = await dialog.showOpenDialog(opt)
  if (!path.canceled) {
    return path.filePaths
  } else {
    return undefined
  }
}
