import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  Tray,
  Notification,
  session
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createWaveDesktop } from './extend/musicDesktop'
import icon from '../../resources/icon.png?asset'
import ncmapi from 'NeteaseCloudMusicApi/app'
import modules from './ncmapiModuleDef'
import path from 'node:path'
import { attach, detach } from 'electron-as-wallpaper'
import WindowManager from './windows'
import { registerPowerEvents, registerTray, registIPC } from './ipcEvents'
const windowManager = new WindowManager()
export {windowManager}
const mainWindowOptions = {
  width: 1300,
  height: 800,
  minWidth: 1300,
  minHeight: 800,
  show: false,
  frame: false,
  autoHideMenuBar: true,
  title:'猫播',
  ...(process.platform === 'linux' ? { icon } : {}),
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
    nodeIntegration: true,
    contextIsolation: false,
    webSecurity: false
  }
}
ncmapi.startNcmApi(11451)
function ready() {
 
  const mainWindow = windowManager.createWindow('main',mainWindowOptions)
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  mainWindow.webContents.openDevTools()

  const desktop = windowManager.createWindow('desktop',{
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })
  desktop.loadFile(join(__dirname,'../renderer/pages/desktop_player.html'))
  desktop.webContents.openDevTools()





  electronApp.setAppUserModelId('猫猫播放器')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('app:close', (e) => {
    windowManager.closeAllWindows()
    app.quit()
  })
  ipcMain.on('app:minimize', () => {
    mainWindow.minimize()
  })
  ipcMain.on('app:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.handle('dialog:openDir', handleDir)
  ipcMain.handle('dialog:fsopen', async (e, opt) => {
    const path = await fsopen(opt)
    return path
  })
  ipcMain.on('shell:openExplorer', (e, path) => {
    openExplorer(path)
  })
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
}

app.whenReady().then(()=>{
  ready()
  registIPC(windowManager)
  registerTray()
  registerPowerEvents()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function handleDir(type) {
  const path = await dialog.showOpenDialog({
    title: '选择目录',
    buttonLabel: '选择喵',
    properties: ['openDirectory']
  })
  if (!path.canceled) {
    return path.filePaths[0]
  } else {
    return false
  }
}

async function openExplorer(pathname) {
  shell.openPath(path.join(pathname, '/'))
}

async function fsopen(opt) {
  const path = await dialog.showOpenDialog(opt)
  if (!path.canceled) {
    return path.filePaths
  } else {
    return undefined
  }
}
