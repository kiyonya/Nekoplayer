import { app, desktopCapturer, globalShortcut, ipcMain, session, webContents } from 'electron'
import { join } from 'path'
import { optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import WindowManager from './windows'
import { registerPowerEvents, registerSystemTaskbar, registerTray, registIPC } from './ipcEvents'
import { startNcmApi } from 'NeteaseCloudMusicApi/app'
import net from 'net'
const windowManager = new WindowManager()
export { windowManager }
class NekoPlayer {
  constructor() {
    this.initApp()
    this.mainWindow = null
  }
  static mainWindowOptions = {
    width: 1260,
    height: 830,
    minWidth: 1260,
    minHeight: 830,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    title: 'NekoPlayer',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  }
  async initApp() {
    if (!app.requestSingleInstanceLock()) {
      app.quit()
    } else {
      const apiPort = await this._findFreePort(11451, 11600)
      await startNcmApi(apiPort)

      app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) {
            this.mainWindow.restore()
          }
          this.mainWindow.focus()
          this.mainWindow.flashFrame(true)
        }
      })

      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          this.quit()
        }
      })

      app.whenReady().then(async () => {
        this.mainWindow = await this.createAppWindow()

        globalShortcut.register('CommandOrControl+Alt+Shift+D', () => {
          this.mainWindow.webContents.openDevTools({
            mode: 'detach',
            activate: true,
            title: '应急开发工具'
          })
        })
        
        registIPC(windowManager)
        registerTray(windowManager)
        registerPowerEvents()

        
      })
    }
  }
  async createAppWindow() {
    const mainWindow = windowManager.createWindow('main', NekoPlayer.mainWindowOptions)
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
    
    mainWindow.webContents.on('did-finish-load', () => {
      if (is.dev) {
        setTimeout(() => {
          mainWindow.webContents.openDevTools({
            mode: 'detach',
            activate: true,
            title: 'DevTools',
            preferences: {
              'enable-autofill': true
            }
          })
        }, 1000)
      }
    })

    
    mainWindow.on('ready-to-show', () => {
      registerSystemTaskbar(mainWindow)
      mainWindow.show()
      mainWindow.focus()
    })
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
    ipcMain.on('app:close', (e) => {
      this.quit()
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
    return mainWindow
  }
  async _findFreePort(startPort = 11451, endPort = 11600) {
    for (let port = startPort; port <= endPort; port++) {
      try {
        await new Promise((resolve, reject) => {
          const server = net.createServer()
          server.unref()
          server.on('error', reject)
          server.listen({ port }, () => {
            server.close(() => resolve(port))
          })
        })
        return port
      } catch (err) {
        if (err.code !== 'EADDRINUSE') throw err
      }
    }
    throw new Error('No free ports found in the given range')
  }
  async registerMediaRequestHandler(){
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      callback({ video: false, audio: sources[0] })
    })
  }, { useSystemPicker: true })
  }
  async quit() {
    globalShortcut.unregisterAll()
    windowManager.closeAllWindows()
    app.quit()
  }
}

new NekoPlayer()
