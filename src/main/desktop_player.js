import path from 'path'
import { windowManager } from '.'
import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import fs from 'fs'
function getResourcesPath() {
  if (!app.isPackaged) {
    return path.join(__dirname, '../../resources', '/plugin', '/desktopplayer')
  }
  return path.join(
    process.resourcesPath,
    'app.asar.unpacked',
    '/resources',
    '/plugin',
    '/desktopplayer'
  )
}
const __BASEPATH__ = getResourcesPath()
function readResourcePack(dirname) {
  let dir = path.join(__BASEPATH__, `/${dirname}`)
  if (!fs.existsSync(dir)) {
    return
  }
  let metaPath = path.join(dir, 'pack.json')
  let metaJson = { dir }
  try {
    metaJson =
      fs.existsSync(metaPath) && JSON.parse(fs.readFileSync(metaPath, { encoding: 'utf-8' }))
  } catch (e) {}
  let electronWindowOptions = {
    width: 420,
    height: 150,
    resizable: false,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    ...(metaJson.electronWindowOptions || {})
  }
  electronWindowOptions.webPreferences = {
    preload: path.join(__dirname, '../preload/desktop_player.js'),
    sandbox: true,
    nodeIntegration: true,
    contextIsolation: false
  }
  let entryFile = path.join(dir, metaJson.entry || 'index.html')
  if ((!fs.existsSync(entryFile) || path.extname(entryFile) !== '.html') && !metaJson.devMode) {
    return
  }
  return {
    electronWindowOptions,
    entryFile,
    meta: metaJson,
    dir
  }
}
export function createDesktopPlayer(desktopEntryForlderName = 'default') {
  const isCreate = windowManager.getWindow('desktopplayer')
  if (isCreate) {
    return
  }
  const mainWindow = windowManager.getWindow('main')
  if (!mainWindow) {
    return
  }
  const data = readResourcePack(desktopEntryForlderName)
  if (!data) {
    throw new Error('错误：缺少目录')
  }
  const { electronWindowOptions, entryFile, meta, dir } = data
  
  const desktopPlayer = windowManager.createWindow('desktopplayer', electronWindowOptions)

  console.log(meta)

  if (meta.devMode) {
    let port = meta?.devOptions?.port || 9090
    desktopPlayer.loadURL(`http://localhost:${port}`)
    desktopPlayer.webContents.openDevTools({
        mode: 'detach'
    })
  } else {
    desktopPlayer.loadFile(entryFile)
  }
  desktopPlayer.setAlwaysOnTop(true)
  desktopPlayer.on('ready-to-show', () => {
    desktopPlayer.show()
    desktopPlayer.webContents.send('desktopplayer:meta', meta)
  })
  return desktopPlayer
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
