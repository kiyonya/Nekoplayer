import { createWriteStream, existsSync } from 'fs'
import { logger } from './log'
import { readFile } from 'fs/promises'
import { getBillboardVOCALOIDSongs } from './plugins/billboard_vocaloid_rank'
import { is } from '@electron-toolkit/utils'
const {
  ipcMain,
  app,
  dialog,
  Tray,
  Menu,
  nativeImage,
  powerSaveBlocker,
  powerMonitor,
  ipcRenderer
} = require('electron')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')
const musicMeta = require('music-metadata')
const https = require('https')
const http = require('http')
const staticResourcesPath = process.resourcesPath
function getResourcesPath() {
  if (!app.isPackaged) {
    return path.join(__dirname, '../../resources')
  }
  return path.join(process.resourcesPath, '/resources')
}
import { windowManager } from '.'
import { createDesktopPlayer, killDesktopPlayer } from './desktop_player'
import { createMusicDesktop } from './music_desktop'
import { captcha_verify, login_cellphone } from 'NeteaseCloudMusicApi'

const saveData = {
  nowPlaying: null,
  currentTime: 0
}

export function registIPC() {
  ipcMain.on('app:openWebView', (e, url) => {
    const webView = windowManager.createWindow('webview')
    console.log(url)
    webView.loadURL(url)
  })
  ipcMain.on('app->desktop:musicinfo', (e, data) => {
    const desktopWindows = windowManager.getWindow('desktop')
    if (desktopWindows) {
      desktopWindows.webContents.send('desktop:musicinfo', data)
    }
  })
  ipcMain.on('app->desktop:lyric', (e, lyric) => {
    const desktopWindows = windowManager.getWindow('desktop')
    if (desktopWindows) {
      desktopWindows.webContents.send('desktop:lyric', lyric)
    }
  })
  ipcMain.on('app->desktop:play', (e) => {
    const desktopWindows = windowManager.getWindow('desktop')
    if (desktopWindows) {
      desktopWindows.webContents.send('desktop:play')
    }
  })
  ipcMain.on('app->desktop:pause', (e) => {
    const desktopWindows = windowManager.getWindow('desktop')
    if (desktopWindows) {
      desktopWindows.webContents.send('desktop:pause')
    }
  })
  ipcMain.on('app->desktop:volumechange', (e, volume) => {
    const desktopWindows = windowManager.getWindow('desktop')
    if (desktopWindows) {
      desktopWindows.webContents.send('desktop:volumechange', volume)
    }
  })
  ipcMain.on('app->desktop:timeupdate', (e, currentTime) => {
    const desktopWindows = windowManager.getWindow('desktop')
    if (desktopWindows) {
      desktopWindows.webContents.send('desktop:timeupdate', currentTime)
    }
  })
  ipcMain.on('desktop->app:seek', (e, currentTime) => {
    const main = windowManager.getWindow('main')
    if (main) {
      main.webContents.send('app:seek', currentTime)
    }
  })
  ipcMain.on('desktop->app:next', (e) => {
    const main = windowManager.getWindow('main')
    if (main) {
      main.webContents.send('app:next')
    }
  })
  ipcMain.on('desktop->app:previous', (e) => {
    const main = windowManager.getWindow('main')
    if (main) {
      main.webContents.send('app:previous')
    }
  })
  ipcMain.on('desktop->app:toggleplay', () => {
    const main = windowManager.getWindow('main')
    if (main) {
      main.webContents.send('app:toggleplay')
    }
  })
  ipcMain.on('desktop->app:volumechange', (e, volume) => {
    const main = windowManager.getWindow('main')
    if (main) {
      main.webContents.send('app:volumechange', volume)
    }
  })
  ipcMain.on('desktop->app:ready', () => {
    const main = windowManager.getWindow('main')
    if (main) {
      main.webContents.send('desktop:ready')
    }
  })
  ipcMain.on('app:useDesktopPlayer', () => {
    if (windowManager.getWindow('desktop')) {
      killDesktopPlayer()
    } else {
      createDesktopPlayer()
    }
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

  ipcMain.on('player:nowplaying', (e, nowplaying) => {
    saveData.nowPlaying = nowplaying
    const musicDesktop = windowManager.getWindow('musicdesktop')
    if (musicDesktop) {
      musicDesktop.webContents.send('musicdesktop:nowplaying', nowplaying)
    }
  })

  ipcMain.on('player:timeupdate', (e, currentTime) => {
    saveData.currentTime = currentTime
    const musicDesktop = windowManager.getWindow('musicdesktop')
    if (musicDesktop) {
      musicDesktop.webContents.send('musicdesktop:timeupdate', currentTime || 0)
    }
  })

  ipcMain.on('musicdesktop:init', (e) => {
    const musicDesktop = windowManager.getWindow('musicdesktop')
    if (musicDesktop) {
      musicDesktop.webContents.send('musicdesktop:nowplaying', saveData.nowPlaying)
      musicDesktop.webContents.send('musicdesktop:timeupdate', saveData.currentTime)
    }
  })

  ipcMain.on('app:useMusicDesktop', (e, pathname = 'oldplayer') => {
    createMusicDesktop(pathname)
  })

  //   ipcMain.handle('dialog:fsopen', async (e, opt) => {
  //     const path = await fsopen(opt)
  //     return path
  //   })
  // ipcMain.handle('app:info', () => {
  //   return {
  //     appPath: app.getAppPath(),
  //     appData: app.getPath('appData'),
  //     temp: app.getPath('temp'),
  //     exe: app.getPath('exe'),
  //     sessionData: app.getPath('sessionData'),
  //     logs: app.getPath('logs'),
  //     version: app.getVersion(),
  //     metrics: app.getAppMetrics(),
  //     musicPath: app.getPath('music')
  //   }
  // })

  ipcMain.on('app:registerGlobalShotcut', (e, shotcut) => {})
  ipcMain.on('log', (event, level, message) => {
    logger[level](message)
  })

  ipcMain.handle('file:writeBuffer', async (e, id, fpath, buffer) => {
    buffer = Buffer.from(buffer)
    try {
      if (!id || !fpath || !Buffer.isBuffer(buffer)) {
        throw new Error('Invalid parameters')
      }
      if (!existsSync(fpath)) {
        throw new Error(`Directory does not exist: ${fpath}`)
      }
      const filepath = path.join(fpath, `${id}.cb`)
      await new Promise((resolve, reject) => {
        const stream = createWriteStream(filepath)
        stream.on('finish', resolve)
        stream.on('error', (err) => {
          require('fs').unlink(filepath, () => reject(err))
        })
        stream.write(buffer)
        stream.end()
      })

      return { success: true, filepath }
    } catch (err) {
      console.error('Failed to write buffer:', err)
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('file:readBuffer', async (e, id, fpath) => {
    try {
      if (!id || !fpath) {
        throw new Error('Invalid parameters')
      }
      const filepath = path.join(fpath, `${id}.cb`)
      if (!existsSync(filepath)) {
        return { exists: false }
      }
      const buffer = await readFile(filepath)
      return {
        exists: true,
        buffer: buffer,
        size: buffer.length,
        filepath
      }
    } catch (err) {
      console.error('Failed to read buffer:', err)
      return { exists: false, error: err.message }
    }
  })
  ipcMain.handle('file:readdir', async (event, dirPath, extensions = [], recursive = true) => {
    // 内部递归函数
    async function readDirRecursively(currentDir) {
      const dirResults = []
      try {
        const items = await fs.promises.readdir(currentDir)

        await Promise.all(
          items.map(async (item) => {
            const fullPath = path.join(currentDir, item)
            try {
              const stat = await fs.promises.stat(fullPath)

              if (stat.isDirectory()) {
                if (recursive) {
                  const subDirResults = await readDirRecursively(fullPath)
                  dirResults.push(...subDirResults)
                }
              } else {
                const fileExt = path.extname(item).toLowerCase()
                if (normalizedExtensions.length === 0 || normalizedExtensions.includes(fileExt)) {
                  dirResults.push(fullPath)
                }
              }
            } catch (error) {
              console.error(`Error processing ${fullPath}:`, error)
            }
          })
        )

        return dirResults
      } catch (error) {
        console.error(`Error reading directory ${currentDir}:`, error)
        return []
      }
    }

    // 主逻辑
    if (!existsSync(dirPath)) {
      return {
        success: false,
        error: `Directory does not exist: ${dirPath}`,
        files: []
      }
    }

    // 规范化扩展名
    const normalizedExtensions = extensions.map((ext) =>
      ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`
    )

    try {
      const files = await readDirRecursively(dirPath)
      return {
        success: true,
        files,
        error: null
      }
    } catch (error) {
      console.error(`Error processing directory ${dirPath}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        files: []
      }
    }
  })
  ipcMain.handle('file:audioMetaReader', async (e, files = []) => {
    if (!Array.isArray(files)) {
      throw new Error('参数必须是文件路径数组')
    }

    // 使用Promise.all处理所有文件
    const promises = files.map((song) => {
      return new Promise((resolve) => {
        const exists = fs.existsSync(song)
        if (!exists) {
          resolve({
            success: false,
            error: '文件不存在'
          })
        } else {
          getFileHash(song).then((hash) => {
            musicMeta
              .parseFile(song)
              .then((meta) => {
                const { common, format } = meta
                resolve({
                  success: true,
                  meta: {
                    ...common,
                    ...format
                  },
                  path: song,
                  time: fs.statSync(song).mtimeMs,
                  size: fs.statSync(song).size,
                  hash
                })
              })
              .catch((error) => {
                resolve({
                  success: false,
                  error,
                  hash
                })
              })
          })
        }
      })
    })

    // 等待所有文件处理完成
    try {
      const result = await Promise.all(promises)
      return result
    } catch (error) {
      console.error('处理音频元数据时出错:', error)
      return files.map((song) => ({
        success: false,
        path: song,
        error: '处理过程中发生错误'
      }))
    }
  })
  ipcMain.handle('file:getMd5', async (e, filePath) => {
    if (!filePath) {
      throw new Error('参数不能为空')
    }
    if (!existsSync(filePath)) {
      throw new Error('文件不存在')
    }
    try {
      const hash = await getFileHash(filePath)
      return hash
    } catch (error) {
      console.error('计算文件MD5时出错:', error)
      throw error
    }
  })
  ipcMain.handle('file:getFilesMd5', async (e, files = []) => {
    files.map((file) => getFileHash(file))
    const hashs = await Promise.all()
  })
  ipcMain.handle('file:readFileBuffer', async (e, filepath) => {
    if (!existsSync(filepath)) {
      return { exists: false }
    }
    const buffer = await readFile(filepath)
    return {
      exists: true,
      buffer: buffer,
      size: buffer.length,
      filepath
    }
  })
  ipcMain.handle('file:readFileStream', async (e, filepath) => {
    if (!existsSync(filepath)) {
      return { exists: false }
    } else {
      return {
        exists: true,
        stream: fs.createReadStream(filepath),
        filepath
      }
    }
  })
  ipcMain.handle('file:deleteFile', async (e, filepath) => {
    if (!existsSync(filepath)) {
      return { exists: false }
    }
    try {
      await fs.promises.unlink(filepath)
      return { success: true }
    } catch (error) {
      console.error('删除文件时出错:', error)
      return { success: false, error: error.message }
    }
  })
  ipcMain.handle('file:writeFile', async (e, filepath, buffer) => {
    fs.writeFile(filepath, buffer, (err) => {
      if (err) {
        console.error('写入文件时出错:', err)
        return { success: false, error: err.message }
      } else {
        return { success: true }
      }
    })
  })
  ipcMain.handle('billboard:getVocaloidRank', (e, y, m, d, r) => {
    return getBillboardVOCALOIDSongs(y, m, d, r)
  })
  ipcMain.handle('dialog:openDir', async (e, opt) => {
    const { title = '选择文件夹', defaultPath = app.getPath('music') } = opt || {}
    const result = await dialog.showOpenDialog(windowManager.getWindow('main'), {
      properties: ['openDirectory'],
      title,
      defaultPath
    })
    if (result.canceled) {
      return undefined
    } else {
      return result.filePaths[0]
    }
  })
  ipcMain.handle('dialog:openFile', async (e, opt) => {
    const { title = '选择文件', defaultPath = '', properties = [], filters = [] } = opt || {}
    const result = await dialog.showOpenDialog(windowManager.getWindow('main'), {
      properties: ['openFile', ...properties],
      title,
      defaultPath,
      filters
    })
    if (result.canceled) {
      return undefined
    } else {
      return result.filePaths
    }
  })
  ipcMain.handle('dialog:saveFile', async (e, opt) => {
    const { title = '保存文件', filters = [], defaultPath = '' } = opt || {}
    const result = await dialog.showSaveDialog(windowManager.getWindow('main'), {
      title,
      filters,
      defaultPath
    })
    if (result.canceled) {
      return undefined
    } else {
      return result.filePath
    }
  })
  ipcMain.handle('file:exists', async (e, files) => {
    const loss = []
    for (const file of files) {
      if (!fs.existsSync(file)) {
        loss.push(file)
      }
    }
    if (loss.length == 0) {
      return null
    }
    return loss
  })
  ipcMain.handle('file:exist', async (e, file) => {
    return fs.existsSync(file)
  })
  ipcMain.handle('tool:downloadFileTo', async (e, { url, filepath, filename }) => {
    if (!url || !filepath || !filename) {
      throw new Error('缺少必要参数: url, filepath 或 filename')
    }
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, { recursive: true })
    }
    const fullPath = path.join(filepath, filename)
    const client = url.startsWith('https') ? https : http
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(fullPath)
      const request = client.get(url, (response) => {
        if (response.statusCode !== 200) {
          fileStream.close()
          fs.unlinkSync(fullPath)
          return reject(`下载失败，HTTP状态码: ${response.statusCode}`)
        }

        // 管道传输数据
        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve({
            success: true,
            path: fullPath,
            size: fs.statSync(fullPath).size
          })
        })
      })

      // 错误处理
      request.on('error', (err) => {
        fileStream.close()
        fs.unlinkSync(fullPath)
        reject(`请求错误: ${err.message}`)
      })

      fileStream.on('error', (err) => {
        request.destroy()
        fs.unlinkSync(fullPath)
        reject(`文件写入错误: ${err.message}`)
      })

      request.setTimeout(30000, () => {
        request.destroy()
        fileStream.close()
        fs.unlinkSync(fullPath)
        reject('下载超时')
      })
    })
  })
  ipcMain.handle("tool:getFolderSize",async (e,folderPath)=>{
    if(!fs.existsSync(folderPath)){
      return null
    }
    return getLargeFolderSizeBatched(folderPath)
  })
  ipcMain.handle("auth:loginAsCaptcha",async (e,phone,captcha)=>{
    const request = await captcha_verify({phone,captcha})
    login_cellphone
    
    if(request.body?.data === true){
      return request
    }
    else{
      return null
    }
  })
  ipcMain.on("dev:openDevTool",async (e)=>{
    let mainWindow = windowManager.getWindow("main")
    if(mainWindow){
      mainWindow.webContents.openDevTools({
          mode: 'detach',
          activate: true,
          title: 'DevTools',
          preferences: {
            'enable-autofill': true
          }
      })
    }
  })
}

export function registerTray() {
  const mainWindow = windowManager.getWindow('main')
  const ico = path.join(__dirname, '../renderer/icon.png')

  const tray = new Tray(ico)
  const menu = Menu.buildFromTemplate([
    {
      label: '播放/暂停',
      click: () => {
        mainWindow.webContents.send('player:toggleplay')
      }
    },
    {
      label: '上一首',
      click: () => {
        mainWindow.webContents.send('player:previous')
      }
    },
    {
      label: '下一首',
      click: () => {
        mainWindow.webContents.send('player:next')
      }
    },
    {
      label: '播放模式',
      type: 'submenu',
      submenu: [
        {
          label: '单曲循环',
          click: () => {
            mainWindow.webContents.send('player:playmode', 'loop')
          }
        },
        {
          label: '列表循环',
          click: () => {
            mainWindow.webContents.send('player:playmode', 'list')
          }
        },
        {
          label: '列表随机',
          click: () => {
            mainWindow.webContents.send('player:playmode', 'random')
          }
        }
      ]
    },
    {
      label: '桌面播放器',
      click: () => {
        if (windowManager.getWindow('desktop')) {
          killDesktopPlayer()
        } else {
          createDesktopPlayer()
        }
      }
    },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        windowManager.closeAllWindows()
        app.quit()
      }
    }
  ])
  tray.setContextMenu(menu)

  tray.setToolTip('nekoplayer')
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
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

export function registerSystemTaskbar(windowManager) {
  const mainWindow = windowManager.getWindow('main')
  let thumbarButtons = [
    {
      tooltip: '1',
      icon: nativeImage.createFromPath(path.join(getResourcesPath(), '/taskbar', 'previous.png')),
      click() {
        mainWindow.webContents.send('player:previous')
      }
    },
    {
      tooltip: '2',
      icon: nativeImage.createFromPath(path.join(getResourcesPath(), '/taskbar', 'play.png')),
      click() {
        mainWindow.webContents.send('player:toggleplay')
      }
    },
    {
      tooltip: '2',
      icon: nativeImage.createFromPath(path.join(getResourcesPath(), '/taskbar', 'next.png')),
      click() {
        mainWindow.webContents.send('player:next')
      }
    }
  ]
  ipcMain.on('player:pause', () => {
    thumbarButtons[1] = {
      tooltip: '2',
      icon: nativeImage.createFromPath(path.join(getResourcesPath(), '/taskbar', 'play.png')),
      click() {
        mainWindow.webContents.send('player:toggleplay')
      }
    }
    mainWindow.setThumbarButtons(thumbarButtons)
  })
  ipcMain.on('player:play', () => {
    thumbarButtons[1] = {
      tooltip: '2',
      icon: nativeImage.createFromPath(path.join(getResourcesPath(), '/taskbar', 'pause.png')),
      click() {
        mainWindow.webContents.send('player:toggleplay')
      }
    }
    mainWindow.setThumbarButtons(thumbarButtons)
  })
  mainWindow.setThumbarButtons(thumbarButtons)
}
function getFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5')
    const stream = fs.createReadStream(filePath)
    stream.on('data', (data) => {
      hash.update(data)
    })
    stream.on('end', () => {
      resolve(hash.digest('hex'))
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })
}
async function getLargeFolderSizeBatched(folderPath, batchSize = 100) {
  let totalSize = 0;
  let dirsToProcess = [folderPath];
  while (dirsToProcess.length > 0) {
    const currentDir = dirsToProcess.shift();
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      const statsPromises = batch.map(entry => {
        const fullPath = path.join(currentDir, entry.name);
        return entry.isDirectory() 
          ? (dirsToProcess.push(fullPath), Promise.resolve(null))
          : fs.promises.stat(fullPath);
      });
      const statsResults = await Promise.all(statsPromises);
      for (const stat of statsResults) {
        if (stat && !stat.isDirectory()) {
          totalSize += stat.size;
        }
      }
    }
  }
  return totalSize;
}