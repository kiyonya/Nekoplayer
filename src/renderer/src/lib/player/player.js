import { matchSong } from '@/api/edit'
import { getDynamicCover, getSongDetial, getSongUrl, scrobble } from '@/api/song'
import { store } from '@/store'
import temp from '@/store/temp'
import { fileToMD5 } from '@/utils/enc'
import { nekoLyricObjectGenerator } from '@/utils/lrc'
import { computed, watch } from 'vue'
import { getPlaylistDetial, getPlaylistSongs, getPlaylistTracks } from '@/api/playlist'
import { getAlbum } from '@/api/album'
import { getArtistBriefAndSongs, getArtistDetial } from '@/api/artist'
import { getDailySong, personalFM } from '@/api/recommend'
import { cacheAudioFromUrl, readAudioCacheFile } from '../cache/cacheAudio'
import { showSideNotification } from '@/components/notification/use_notification'
import { getLyric } from '@/api/lyric'
import { AudioManager } from './audio'
import Dexie from 'dexie'
import {
  acceptRoom,
  checkRoom,
  createRoom,
  endRoom,
  getHostPlaylist,
  getRoomStatus,
  postPlayCommand,
  postPlaylist,
  postRoomHeartbeat
} from '@/api/lt'
import { resize } from '@/utils/imageProcess'
import { localMusic } from '@/main'
const path = require('path')
const os = require('os')
const config = computed(() => {
  return store.state.config
})
const useEQ = computed({
  get: () => store.state.config.useEQ
})
const equalizer = computed({
  get: () => store.state.equalizerData
})
const profile = computed(() => {
  return store.state.profile
})
export default class Player {
  constructor() {
    this.AUDIO = null
    this.events = {}
    this.audioManager = new AudioManager()
    this.audioCacheDB = new Dexie('audioCacheDB')
    this.audioCacheDB.version(1).stores({
      audioCache: '++id,resource,linkpath',
      lyricCache: '++id,resource,lyric',
      musicDetialCache: '++id,resource,detial,coverpath,audiopath'
    })
    this.playmode = 'list'
    this.useShuffle = false
    this.volume = 1
    this.volumeBeforeMute = 1
    //播放
    this._list = []
    this._listDetial = []
    this.listDetialCached = false
    this.isShuffe = false
    this.shuffledList = []
    this._source = { type: '', id: 114514 }
    this.oldSource = undefined
    this.currentMusicInfo = {}
    this.currentId = 0
    this.lastId = 0
    this.nextId = 0
    this.autoplay = true
    this.quality = 'jyeffect'
    this.duration = 0
    this.currentTime = 0
    this.lyric = {}
    this.personalFMInit = false
    this.currentPersonalFMTrack = {}
    this.currentPersonalFMId = 0
    this.nextPersonalFMTrack = {}
    this.personalFMList = []
    this.isPersonalFM = false
    this.isListentogether = false
    this.listentogether = {
      isHost: false,
      isJoined: false,
      roomId: null,
      creatorId: null,
      roomDetial: {},
      hintText: '',
      formerSongId: 0,
      targetSongId: 0,
      lastProgress: 0
    }
    this.listentogetherClientSeq = 1
    this.beforeJoinSaved = {
      shuffle: [],
      list: [],
      index: 0
    }
    this.listentogetherPollingInterval = null
    this.listentogetherPlaymode = 'ORDER_LOOP'
    this.INIT()

    window.crm = this.createListentogetherRoom.bind(this)
    window.jrm = this.joinListentogetherRoom.bind(this)
    window.erm = this.endListentogetherRoom.bind(this)
  }
  static IS_INIT = false
  get list() {
    return this.isShuffe ? this.shuffledList : this._list
  }
  set list(list) {
    this._list = list
  }
  get listDetial() {
    return new Promise((resolve, reject) => {
      if (this.listDetialCached) {
        resolve(this._listDetial)
      } else {
        this.getListDetial(50).then((detials) => {
          this.listDetial = detials
          this.listDetialCached = true
          resolve(detials)
        })
      }
    })
  }
  set listDetial(list) {
    this._listDetial = list
  }
  get currentNormalList() {
    return this._list
  }
  get currentShuffedList() {
    return this.shuffledList
  }
  set source(source) {
    this._source = source
  }
  get source() {
    return this._source
  }

  emit(id, ...args) {
    const callbacks = this.events[id]
    if (callbacks.length >= 1) {
      for (const callback of callbacks) {
        if (typeof callback === 'function') {
          callback(...args)
        }
      }
    }
  }

  isLogin() {
    return store.state.loginStatus > 0
  }
  isNeedReplaceSource(source) {
    this.oldSource = this.source
    if (this.oldSource.id !== source.id || this.oldSource.type !== source.type) {
      return true
    }
    return false
  }
  getCursor(id) {
    const findId = id || this.currentId
    return this.list.findIndex((i) => i.id === findId)
  }
  play(id, source) {
    if (source.type === 'localgroup') {
      console.log(this.list)
      this.playLocalMusic(id)
    } else {
      this.playMusicOnNcm(id)
      if (config.value.allowScrobble) {
        this.scrobbleTrack(id, source)
      }
    }
  }
  playOnly(id, autoplay = true) {
    this.getAudioSourceFromNcm(id).then((url) => {
      this.replaceTrack(id, url, autoplay)
    })
  }
  playInsertTracks(start, mapListIds, source = {}) {
    let cloneList = this._deepClone(this.list)
    let pointer = this.getCursor()
    let deduplicateList = this._insertAndDeduplicate(cloneList, mapListIds, pointer)
    this.changePlaylist(deduplicateList, source)
    if (start) {
      this.play(start, source, false)
    }
  }
  insertPlaylistCandy(playlistId, source) {
    getPlaylistDetial(playlistId, true).then((detial) => {
      const trackIds = detial.playlist.trackIds.map((track) => {
        return { id: track.id, source }
      })
      this.playInsertTracks(null, trackIds, source)
    })
  }
  insertAlbumCandy(albumId, source) {
    getAlbum(albumId).then((data) => {
      let trackIds = data?.songs.map((i) => {
        return { id: i.id, source }
      })
      this.playInsertTracks(null, trackIds, source)
    })
  }
  playNewList(start, mapListIds, source = {}) {
    this.changePlaylist(mapListIds, source)
    if (start) {
      this.play(start, source, false)
    }
  }
  playPlaylist(start, mapListIds, source = {}, playfirst = false) {
    const { id } = source
    if (mapListIds && mapListIds?.length > 0) {
      this.changePlaylist(mapListIds, source, playfirst)
    } else {
      getPlaylistDetial(id).then((detial) => {
        const trackIds = detial.playlist.trackIds.map((track) => {
          return { id: track.id, source }
        })
        this.changePlaylist(trackIds, source, playfirst)
      })
    }
    if (start) {
      this.play(start, source, false)
    }
  }
  playAlbum(start, mapListIds, source, playfirst = false) {
    const { id } = source
    if (mapListIds) {
      this.changePlaylist(mapListIds, source, playfirst)
    } else {
      getAlbum(id).then((data) => {
        let trackIds = data?.songs.map((i) => {
          return { id: i.id, source }
        })
        this.changePlaylist(trackIds, source, playfirst)
      })
    }
    if (start) {
      this.play(start, source)
    }
  }
  playArtist(start, mapListIds, source, playfirst = false) {
    const { id } = source
    if (mapListIds) {
      this.changePlaylist(mapListIds, source, playfirst)
    } else {
      getArtistBriefAndSongs(id).then((data) => {
        const trackIds = data.hotSongs.map((song) => {
          return { id: song.id, source }
        })
        this.changePlaylist(trackIds, source, playfirst)
      })
    }
    if (start) {
      this.play(start, source)
    }
  }
  playPersonalFM(first = true, preload) {
    const info = first ? this.personalFMList.shift() : preload
    if (!this.personalFMInit || !info) {
      return
    }
    this.updatePersonalFM(info)
    const id = info?.id
    this.isPersonalFM = true
    this.getAudioSourceFromNcm(id).then((url) => {
      this.replaceTrack(id, url, this.autoplay)
    })
    this._updateLyric([])
    nekoLyricObjectGenerator(id).then((lyric) => {
      this._updateLyric(lyric)
    })
    getLyric(id).then((data) => store.commit('updateLyric', data))
    getDynamicCover(id).then((data) => {
      this.updateDynamicCover(data?.data)
    })
    this.updateNowPlaying({
      name: info?.name,
      id: id,
      cover: info?.album?.picUrl,
      artist: info?.artists,
      album: info?.album,
      duration: info?.duration,
      tns: info?.tns || null,
      alias: info?.alias || null,
      mv: info?.mv || null,
      expectQuality: this.quality,
      type: 'net',
      local: false,
      reason: info?.reason,
      format: {}
    })
  }

  automap(list, source) {
    return list.map((i) => {
      return { id: i.id, source }
    })
  }
  nextFM() {
    if (this.personalFMList.length < 5) {
      this.getPersonalFMTracks().then((songs) => {
        for (const i of songs) {
          const isRepeat = this.personalFMList.findIndex((t) => t.id === i.id)
          if (isRepeat < 0) {
            this.personalFMList.push(i)
          }
        }
      })
    }
    if (!this.isPersonalFM) {
      return
    }
    if (this.personalFMList.length <= 0) {
      showSideNotification('私人FM', '太快啦~还没有获得新的FM', 2000, (close) => {
        close()
      })
      return
    }
    const info = this.personalFMList.shift()
    this.playPersonalFM(false, info)
  }
  addTrackToNext(id, source) {
    const cursor = this.getCursor()
    const isTrackInPlaylist = this.getCursor(id)
    if (isTrackInPlaylist < 0) {
      this._insert(this.list, { id: id, source }, Math.max(cursor, 0))
    } else {
      this._move(this.list, isTrackInPlaylist, cursor >= isTrackInPlaylist ? cursor : cursor + 1)
    }
    this.listDetialCached = false
  }
  async playMusicOnNcm(id) {
    this.lastId = this.currentId
    this.currentId = id
    if (this.isListentogether && this.listentogether.isHost) {
      this.postPlayCommand(this.autoplay ? 'PLAY' : 'PAUSE')
      this.postHeartbeat(id)
    }
    this._updateLyric([])
    this.getAudioSourceFromNcm(id).then((url) => {
      this.replaceTrack(id, url, this.autoplay)
    })
    const cacheLyric = await this.audioCacheDB.lyricCache.get({ resource: id })
    if (cacheLyric) {
      this.lyric = JSON.parse(cacheLyric.lyric)
      this.sendLyric(this.lyric)
      store.commit('updateLyric', this.lyric)
    } else {
      getLyric(id).then((data) => {
        this.lyric = data
        store.commit('updateLyric', this.lyric)
        this.audioCacheDB.lyricCache.put({ resource: id, lyric: JSON.stringify(this.lyric) })
        this.sendLyric(this.lyric)
      })
    }
    this.getSongDetialFromNcm(id).then((detial) => {
      console.log(detial)
      this.updateNowPlaying(detial)
    })

    getDynamicCover(id).then((data) => {
      this.updateDynamicCover(data?.data)
    })
  }
  formatDetial(id, detial, etc) {
    return {
      name: detial?.name,
      id: id,
      cover: detial?.al?.picUrl,
      artist: detial?.ar,
      album: detial?.al,
      duration: detial?.dt,
      tns: detial?.tns || null,
      alias: detial?.alias || null,
      mv: detial?.mv || null,
      expectQuality: this.quality,
      type: 'net',
      local: false,
      format: {},
      ...etc
    }
  }
  async getSongDetialFromNcm(id) {
    return new Promise(async (resolve, reject) => {
      const cache = await this.audioCacheDB.musicDetialCache.get({ resource: id })

      if (cache && config.value.enableCache) {
        const detial = JSON.parse(cache.detial)
        const coverid = `cover-${id}`
        const readResult = await window.api.readBuffer(coverid, config.value.cachePath)
        if (readResult.exists) {
          const blob = new Blob([readResult?.buffer])
          console.log(blob)
          const objurl = URL.createObjectURL(blob)
          console.log(objurl)
          resolve({ ...detial, cover: objurl })
        } else {
          resolve(detial)
        }
      } else {
        getSongDetial(id).then((data) => {
          const detial = data?.songs[0]
          const fod = this.formatDetial(id, detial)
          this.cacheMusicDetial(id, fod)
          resolve(fod)
        })
      }
    })
  }
  async cacheMusicDetial(id, detial) {
    if (!config.value.enableCache) {
      return
    }
    const coverUrl = detial?.cover
    console.log(coverUrl)
    const res = await fetch(coverUrl)
    if (res.ok) {
      const blob = await res.blob()
      const buffer = await blob.arrayBuffer()
      console.log('封面buffer', buffer)
      const coverid = `cover-${id}`
      const cacheResult = await window.api.writeBuffer(coverid, config.value.cachePath, buffer)
      console.log(cacheResult)
      if (cacheResult?.success) {
        this.audioCacheDB.musicDetialCache.put({
          resource: id,
          detial: JSON.stringify(detial),
          coverpath: cacheResult?.filepath
        })
      }
    }
  }
  replaceTrack(id, file, autoplay = true) {
    this.audioManager.loadFromUrl(file, autoplay)
  }
  /**
   * @param {array} mapListIds
   * @param {Object} source
   */
  changePlaylist(mapListIds, source, playfirst = false) {
    this.list = mapListIds
    if (this.isNeedReplaceSource(source)) {
      this.source = source
      //发送一下一起听

      showSideNotification('播放器通知', '当前播放列表已被修改', 2000, (close) => {
        close()
      })
    }
    this.listDetialCached = false
    this.updateNowPlayingSource(source)
    this.shufflePlaylist()
    this.updatePlaylist(this.list)
    if (this.isListentogether && this.listentogether.isHost) {
      this.postListogetherData()
    }
    if (playfirst) {
      this.play(this.list[0]?.id, source)
    }
  }
  replacePlaylist(source) {
    return new Promise((resolve, reject) => {
      const { type, id } = source
      const cursor = this.getCursor()
      if (type === 'playlist') {
        //歌单
        getPlaylistDetial(id).then((detial) => {
          const trackIds = detial.playlist.trackIds
          this.list = trackIds.map((track) => {
            return { id: track.id, source }
          })
          resolve(this.list)
        })
      } else if (type === 'album') {
        //专辑
        getAlbum(id).then((album) => {
          const songs = album.songs
          this.list = songs.map((song) => {
            return { id: song.id, source }
          })
          resolve(this.list)
        })
        //艺术家
      } else if (type === 'artist') {
        getArtistDetial(id).then((data) => {
          const trackIds = data.hotSongs
          this.list = trackIds.map((song) => {
            return { id: song.id, source }
          })
          resolve(this.list)
        })
      } else if (type === 'addtoindex') {
        const current = this.getCursor(id)
        const last = this.getCursor(this.lastId)
        if (current < 0) {
          this._insert(this.list, { id: id, source }, Math.max(last, 0))
          resolve(this.list)
        }
      } else if (type === 'addnext') {
        const current = this.getCursor(id)
        if (current < 0) {
          this._insert(this.list, { id: id, source }, cursor)
          resolve(this.list)
        } else {
          this._move(this.list, current, cursor >= current ? cursor : cursor + 1)
          resolve(this.list)
        }
      } else if (type === 'daily') {
        getDailySong().then((data) => {
          console.log(data)
          const trackIds = data?.data?.dailySongs
          this.list = trackIds.map((track) => {
            return { id: track.id, source }
          })
          resolve(this.list)
        })
      }
    })
  }
  scrobbleTrack(id, source) {
    if (!['playlist', 'album'].includes(source?.type)) {
      return
    }
    scrobble(id, source?.id)
  }
  next() {
    if (this.isPersonalFM) {
      this.nextFM()
      return
    }

    if (
      this.isListentogether &&
      !this.listentogether.isHost &&
      this.listentogetherPlaymode !== 'LOOP'
    ) {
      return
    }
    if (
      this.isListentogether &&
      !this.listentogether.isHost &&
      this.listentogetherPlaymode === 'LOOP'
    ) {
      this.audioManager.seek(0)
      return
    }

    let cursor = this.getCursor()
    let nextTrack
    if (cursor < this.list.length - 1) {
      nextTrack = this.list[cursor + 1]
    } else {
      nextTrack = this.list[0]
    }
    console.log(cursor)
    this.play(nextTrack.id, nextTrack.source, false)
  }
  previous() {
    if (this.isPersonalFM || this.isListentogether) {
      return
    }
    let cursor = this.getCursor()
    let previousTrack
    if (cursor > 0) {
      previousTrack = this.list[cursor - 1]
    } else {
      previousTrack = this.list[this.list.length - 1]
    }
    this.play(previousTrack.id, previousTrack.source, false)
  }
  execPlay() {
    this.audioManager.play()
    if (this.isListentogether && this.listentogether.isHost) {
      this.postPlayCommand('PLAY')
    }
  }
  execPause() {
    this.audioManager.pause()
    if (this.isListentogether && this.listentogether.isHost) {
      this.postPlayCommand('PAUSE')
    }
  }
  restart() {
    this.audioManager.seek(0)
  }
  setVolume(i) {
    this.audioManager.setVolume(i)
  }
  mute() {
    this.audioManager.mute()
  }
  unmute() {
    this.audioManager.unmute()
  }
  toggleMute() {
    this.audioManager.toggleMute()
  }
  seek(time = null) {
    if (!time) {
      return null
    }
    if (time > this.duration) {
      time = this.duration
    }
    this.audioManager.seek(time)
    if (this.isListentogether && this.listentogether.isHost) {
      this.postPlayCommand('SEEK')
    }
    return null
  }
  playOrPause() {
    if (this.audioManager.status === 'PAUSE') {
      this.execPlay()
    } else {
      this.execPause()
    }
  }
  changePlaymode(mode) {
    if (!['list', 'random', 'loop'].includes(mode)) {
      return
    }
    //if(isPersonalFM && mode === 'random'){return}
    this.playmode = mode
    if (this.playmode === 'random') {
      this.isShuffe = true
    } else {
      this.isShuffe = false
    }
    this.updatePlaymode(mode)
    if (this.isListentogether && this.listentogether.isHost) {
      this.postListogetherData()
    }
  }
  switchPlaymode() {
    if (this.playmode === 'list') {
      this.changePlaymode('loop')
    } else if (this.playmode === 'loop') {
      this.changePlaymode('random')
    } else if (this.playmode === 'random') {
      this.changePlaymode('list')
    }
  }
  updateNowPlaying(info) {
    this.currentMusicInfo = info
    store.commit('updateMusicInfo', this.currentMusicInfo)

    window.electron.ipcRenderer.send(
      'app->desktop:musicinfo',
      JSON.stringify(this.currentMusicInfo)
    )

    console.log('传输')
    if (true) {
      this.updateMediaSession(info)
    }
  }
  updateNowPlayingSource(source) {
    store.commit('updateNowPlaylingSource', source)
  }
  updatePlaymode(mode) {
    store.commit('updatePlayerState', { key: 'mode', value: mode })
  }
  updatePlaylist(list) {
    store.commit('updatePlayerState', { key: 'list', value: list })
  }
  updateDynamicCover(cover) {
    store.commit('updateNowPlayingDynamicCover', cover)
  }
  updatePersonalFM(info) {
    store.commit('updatePersonalFM', info)
  }
  shufflePlaylist() {
    let temp = this._deepClone(this._list)
    this.shuffledList = temp.sort(() => {
      return 0.5 - Math.random()
    })
    return this.shuffledList
  }
  eventListen() {
    this.audioManager.on('timeupdate', this.onTimeupdate.bind(this))
    this.audioManager.on('ended', this.onTrackEnd.bind(this))
    this.audioManager.on('canplay', this.onCanplay.bind(this))
    this.audioManager.on('pause', this.onPause.bind(this))
    this.audioManager.on('play', this.onPlay.bind(this))
    this.audioManager.on('volumechange', this.onVolumeChange.bind(this))
  }
  eventUnlisten() {
    this.audioManager.off('ended', this.onTrackEnd.bind(this))
    this.audioManager.off('timeupdate', this.onTimeupdate.bind(this))
    this.audioManager.off('ended', this.onTrackEnd.bind(this))
    this.audioManager.off('canplay', this.onCanplay.bind(this))
    this.audioManager.off('pause', this.onPause.bind(this))
    this.audioManager.off('play', this.onPlay.bind(this))
  }
  onTrackEnd() {
    if (['random', 'list'].includes(this.playmode)) {
      this.next()
    } else {
      this.audioManager.seek(0)
      this.execPlay()
    }
  }
  onTimeupdate() {
    const currentTime = this.audioManager.currentTime //ss
    this.currentTime = currentTime
    window.electron.ipcRenderer.send('app->desktop:timeupdate', currentTime)
    store.commit('updateAudioState', { key: 'ct', value: currentTime })
  }
  onCanplay() {
    const duration = this.audioManager.durationSync // ss
    this.duration = duration
    store.commit('updateAudioState', { key: 'dt', value: duration })
  }
  onPause() {
    store.commit('updateAudioState', { key: 'state', value: 'pause' })
    window.electron.ipcRenderer.send('app->desktop:pause')
  }
  onPlay() {
    store.commit('updateAudioState', { key: 'state', value: 'play' })
    window.electron.ipcRenderer.send('app->desktop:play')
  }
  onVolumeChange() {
    store.commit('updateAudioState', { key: 'volume', value: this.audioManager.volume })
    window.electron.ipcRenderer.send('app->desktop:volumechange', this.audioManager.volume)
  }
  async getAudioSourceFromNcm(id) {
    const cache = await this.readAudioFromCache(id, this.quality)
    if (cache && config.value.enableCache) {
      console.log('从缓存中读取音频')
      return cache
    } else if (this.isLogin()) {
      const track = await getSongUrl(id, this.quality)
      if (!track) return null
      if (!track.url) return null
      if (track.freeTrialInfo !== null) return null
      this.cacheAudioBuffer(id, this.quality, track.url.replace(/^http:/, 'https:'))
      return track.url.replace(/^http:/, 'https:')
    } else {
      const outerLink = `https://music.163.com/song/media/outer/url?id=${id}`
      this.cacheAudioBuffer(id, 'standard', outerLink)
      return outerLink
    }
  }
  async cacheAudioBuffer(id, quality, url) {
    if (!config.value.enableCache) {
      return
    }
    try {
      const resource = `audio-${id}-${quality}`
      const blob = await fetch(url).then((res) => res.blob())
      const buffer = await blob.arrayBuffer()
      console.log(buffer)
      // this.audioCacheDB.audioCache.put({ resource, buffer })
      // console.log('音频缓存成功')
      console.log(window.api.writeBuffer(resource, config.value.cachePath, buffer))
    } catch (error) {}
  }
  async readAudioFromCache(id, quality) {
    const resource = `audio-${id}-${quality}`
    const readResult = await window.api.readBuffer(resource, config.value.cachePath)
    try {
      if (readResult.exists) {
        const blob = new Blob([readResult.buffer])
        return URL.createObjectURL(blob)
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }
  /**
   * 播放本地音乐
   * @param {string} file 本地音乐文件路径
   * @param {fileMD5<string>} md5
   * @returns {promise<void>}
   */
  async playLocalMusic(md5) {
    this.lastId = this.currentId
    this.currentId = md5

    const localSongData = (await localMusic.getSongsDataByMd5([md5]))[0]
    
    if(!localSongData) {
      return
    }
    const { path,data } = localSongData

    const audioBuffer = await window.api.readFileBuffer(path)
    if(audioBuffer.exists){
      const blob = new Blob([audioBuffer.buffer])
      const url = URL.createObjectURL(blob)
      this.replaceTrack(md5, url, this.autoplay)
    }
    this.updateNowPlaying(data)
    const lyric = await localMusic.getLocalLyric(md5)
    if(lyric){
        this.lyric = lyric
        store.commit('updateLyric', this.lyric)
        localMusic.setLocalLyric(md5, this.lyric)
        this.sendLyric(this.lyric)
    }
    else{
      if(data?.matched){
        const lyric = await getLyric(data.id)
        this.lyric = lyric
        store.commit('updateLyric', this.lyric)
        localMusic.setLocalLyric(md5, this.lyric)
        this.sendLyric(this.lyric)
      }
      else{
        this.lyric = []
        store.commit('updateLyric', this.lyric)
        localMusic.setLocalLyric(md5, this.lyric)
        this.sendLyric(this.lyric)
      }
    }
    console.log(path,md5,data)
  }
  async playLocalList(start,mapListIds,source){
    this.changePlaylist(mapListIds,source,false)
    console.log(mapListIds)
    if(start){
      this.playLocalMusic(start)
    }
  }
  sendLyric(lyric) {
    window.electron.ipcRenderer.send('app->desktop:lyric', JSON.stringify(lyric))
  }
  /**
   * 更新音乐的信息
   * @param {object} info
   */

  /**
   * 更新歌词
   * @param {object} lyric
   */
  _updateLyric(lyric) {
    temp.lyric.value = lyric
  }
  _insert(arr, data, index) {
    if (index < 0 || index > arr.length) {
      return
    }
    arr.splice(index + 1, 0, data)
    arr = [...new Set(arr)]
  }
  _move(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0])
  }
  /**
   * url链接转化为blob
   * @param {string} url
   * @return {Blob}
   */
  _audioUrlToBlob(url) {
    const source = new URL.createObjectURL()
  }
  async _matchLocalMusic(md5, meta) {
    if (meta.common.title && meta.common.artist) {
      const matchData = await matchSong({
        title: meta.common.title,
        album: meta.common.album,
        artist: meta.common.artist,
        duration: meta.format.duration,
        md5: md5
      })
      if (matchData.result.songs.length >= 0) {
        return matchData.result.songs[0]
      } else {
        return false
      }
    }
    return false
  }
  _blobImg(picture) {
    if (!picture) {
      return
    }
    const mime = picture.format
    const blob = new Blob([picture.data], { type: mime })
    const url = URL.createObjectURL(blob)
    return url
  }
  _deepClone(i) {
    return JSON.parse(JSON.stringify(i))
  }
  _switchArray(array, direct, name) {
    let index = array.indexOf(name)
    if (index < 0) {
      return
    }
    index + direct
    if (index > array.length - 1) {
      index = 0
    }
    if (index < 0) {
      index = array.length - 1
    }
    return array[index]
  }
  INIT() {
    if (Player.IS_INIT) {
      return
    }
    this.initMusicSession()
    this.eventListen()
    this.initAudioEffect()
    this.initIpc()
    this.syncListentogether()
    console.log('初始化音频播放器')
    Player.IS_INIT = true
  }
  initPersonalFM() {
    this.getPersonalFMTracks().then((songs) => {
      if (songs.length > 0) {
        this.updatePersonalFM(songs[0])
        this.personalFMList.push(...songs)
      }
      this.personalFMInit = true
      showSideNotification('私人FM', '初始化成功', 1000, (close) => {
        close()
      })
    })
  }
  initMusicSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        this.execPlay()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        this.execPause()
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.previous()
      })
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.next(this.isPersonalFM)
      })
      navigator.mediaSession.setActionHandler('stop', () => {
        this.execPause()
      })
      navigator.mediaSession.setActionHandler('seekbackward', (event) => {
        this.seek(this.seek() - (event.seekOffset || 10))
        this.updateMediaSessionPositionState()
      })
      navigator.mediaSession.setActionHandler('seekforward', (event) => {
        this.seek(this.seek() + (event.seekOffset || 10))
        this.updateMediaSessionPositionState()
      })
    }
  }
  initAudioEffect() {
    watch(
      equalizer,
      () => {
        this.audioManager.biquadFilterGroup.update(
          equalizer.value.equalizerFrequency,
          equalizer.value.equalizerGains,
          equalizer.value.equalizerQuality
        )
      },
      { deep: true }
    )

    watch(useEQ, () => {
      if (useEQ.value) {
        this.audioManager.biquadFilterGroup.enable()
      } else {
        this.audioManager.biquadFilterGroup.disable()
      }
    })
  }
  initIpc() {
    window.electron.ipcRenderer.on('app:seek', (e, currentTime) => {
      this.seek(currentTime)
    })
    window.electron.ipcRenderer.on('app:next', (e) => {
      this.next()
    })
    window.electron.ipcRenderer.on('app:previous', (e) => {
      this.previous()
    })
    window.electron.ipcRenderer.on('app:toggleplay', (e) => {
      this.playOrPause()
    })
    window.electron.ipcRenderer.on('desktop:ready', (e) => {
      window.electron.ipcRenderer.send(
        'app->desktop:musicinfo',
        JSON.stringify(this.currentMusicInfo)
      )
      if (this.audioManager.state === 'play') {
        window.electron.ipcRenderer.send('app->desktop:play')
      } else {
        window.electron.ipcRenderer.send('app->desktop:pause')
      }
      window.electron.ipcRenderer.send('app->desktop:lyric', JSON.stringify(this.lyric))
    })
  }
  updateMediaSession(info) {
    const meta = {
      title: info?.name,
      artist: info?.artist.map((a) => a.name).join(','),
      album: info?.album?.name,
      artwork: [
        {
          src: resize(info?.cover, 224),
          type: 'image/jpg',
          sizes: '224x224'
        },
        {
          src: resize(info?.cover, 512),
          type: 'image/jpg',
          sizes: '512x512'
        }
      ],
      length: info?.duration,
      trackId: info?.id
    }
    navigator.mediaSession.metadata = new MediaMetadata(meta)
  }
  updateMediaSessionPositionState() {
    if ('setPositionState' in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: this.duration,
        playbackRate: 1.0,
        position: this.seek()
      })
    }
  }
  _insertAndDeduplicate(arrayA, arrayB, pointer) {
    arrayA.splice(pointer + 1, 0, ...arrayB)
    const uniqueMap = new Map()
    for (const item of arrayA) {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item)
      }
    }
    const uniqueArray = Array.from(uniqueMap.values())
    return uniqueArray
  }
  /**
   * 获取私人FM
   * @returns {array} songs
   */
  async getPersonalFMTracks() {
    const result = await personalFM()
    const songs = result?.data
    return songs
  }
  //api
  async getListDetial(count) {
    console.log(this.list)
    let trackIds = this.list.filter(i=>i.source.type !== 'localgroup').map((i) => i.id)
    let cursor = this.getCursor()
    const detials = (await getSongDetial(trackIds))?.songs
    console.log(trackIds)
    return detials
  }
  async queryPlaylist() {
    const detial = await this.listDetial
    return detial
  }

  //一起听
  async createListentogetherRoom() {
    const status = await getRoomStatus()
    console.log(status)
    if (status.data?.inRoom) {
      alert('end room?')
      await this.endListentogetherRoom(status?.data?.roomInfo?.roomId)
      return
    }
    // const status = await getRoomStatus()
    // if(status.data?.roomInfo?.roomId){
    //   console.log('处于一起听房间，无法创建')
    //   return
    // }
    const createdRoom = await createRoom()
    if (createdRoom?.code === 200) {
      console.log(createdRoom)
      this.listentogether.roomDetial = createdRoom?.data?.roomInfo
      this.listentogether.roomId = this.listentogether.roomDetial?.roomId
      this.listentogether.creatorId = this.listentogether.roomDetial?.creatorId
      this.listentogether.isHost = true
      this.listentogether.isJoined = true
      store.commit('updateListentogetherRoomDetial', this.listentogether.roomDetial)
      console.log()
      this.initListentogether(this.listentogether.roomDetial?.roomId)
      console.log(
        '创建成功',
        this._listentogetherInviteLinkFormatter(
          this.listentogether.roomId,
          this.listentogether.creatorId
        )
      )
    }
  }
  async joinListentogetherRoom(roomId, creatorId, songId) {
    if (this.listentogether.isJoined) {
      return
    }
    const status = await getRoomStatus()
    if (status?.data?.inRoom) {
      //如果在房间 看看是不是自己的房间
      if (status?.data?.roomInfo?.creatorId != profile.value.userId) {
        //是自己不管
        //不是自己询问退出然后结束
        alert('已经在房间了请先退出')
        await this.endListentogetherRoom()
        return
      }
    }
    const check = await checkRoom(roomId)
    console.log(check)
    if (check?.data?.status === 'FULL') {
      console.log('当前已满')
      return
    } else if (check && check?.data?.joinable) {
      console.log('joinable')
      const accept = await acceptRoom(roomId, creatorId)
      if (accept?.code !== 200) {
        return '加入失败'
      } else {
        this.listentogether.roomDetial = accept?.data?.roomInfo
        this.listentogether.roomId = accept?.data?.roomInfo?.roomId
        this.listentogether.creatorId = accept?.data?.roomInfo?.creatorId
        this.listentogether.isHost = false
        this.listentogether.isJoined = true
        this.listentogether.hintText = accept?.data?.hintText
        store.commit('updateListentogetherRoomDetial', this.listentogether.roomDetial)
        if (accept?.data?.type === 'ALREADY_IN_ROOM') {
          console.log('已经在房间了')
        }
        this.initListentogether()
      }
    }
  }
  async listentogetherDataHandler(isinit) {
    const playlist = await getHostPlaylist(this.listentogether.roomId)
    console.log(playlist)
    const command = playlist?.data?.playCommand
    const commandType = command?.commandType
    const targetSongId = command?.targetSongId
    const progress = command?.progress
    const playlistData = playlist?.data?.playlist
    const playmode = playlistData?.playMode
    this.listentogether.playmode = playmode
    //格式化为Nekoplayer Playlist Format
    this.normalList = playlistData?.displayList?.result.map((id) => {
      return {
        id: id,
        source: {
          type: 'listentogether',
          id: this.listentogether.roomId,
          lstmode: 'NORMAL'
        }
      }
    })
    if (playmode === 'RANDOM') {
      this.randomList = playlistData?.randomList?.result.map((id) => {
        return {
          id: id,
          source: {
            type: 'listentogether',
            id: this.listentogether.roomId,
            lstmode: 'RANDOM'
          }
        }
      })
    }
    const isNeedReplace =
      this._list.map((i) => i.id).join('') !== playlistData?.displayList?.result?.join('')
    //歌单替换
    if (playlistData?.replace && isNeedReplace) {
      console.log('换源力')
      if (isinit) {
        this.beforeJoinSaved.list = this._deepClone(this._list)
        this.beforeJoinSaved.shuffle = this._deepClone(this.shuffledList)
      }
      this._list = this.normalList
      playmode === 'RANDOM' && (this.shuffledList = this.randomList)
    }
    //跳转播放进度
    if (isinit) {
      this.audioManager.seek(parseInt(progress) / 1000)
    }
    //指令相应
    if (commandType === 'PAUSE') {
      this.execPause()
    } else if (commandType === 'PLAY') {
      this.execPlay()
    } else if (commandType === 'SEEK') {
      this.audioManager.seek(parseInt(progress) / 1000)
    }

    //播放以及播放判断
    if (this.listentogether.formerSongId !== targetSongId || isinit) {
      this.play(targetSongId, this.listentogether.source)
      this.listentogether.formerSongId = targetSongId
      console.log('房间曲目改变，播放新曲目')
    }
  }

  async listentogetherRoomStatusHandler() {
    const status = await getRoomStatus()
    // const inRoom = status?.data?.inRoom
    // console.log(status)
    // if(!inRoom){
    //   this.endListentogetherRoom()
    // }
    if (!status?.data?.roomInfo) {
      this.endListentogetherRoom()
      return
    }
    const isUserJoined =
      status?.data?.roomInfo?.roomUsers?.length > this.listentogether.roomDetial?.roomUsers?.length

    console.log(
      status?.data?.roomInfo?.roomUsers,
      this.listentogether.roomDetial?.roomUsers,
      isUserJoined
    )
    this.listentogether.roomDetial = status?.data?.roomInfo
    status?.data?.roomInfo?.roomId && (this.listentogether.roomId = status?.data?.roomInfo?.roomId)
    status?.data?.roomInfo?.creatorId &&
      (this.listentogether.creatorId = status?.data?.roomInfo?.creatorId)
    if (isUserJoined && this.isListentogether && this.listentogether.isHost) {
      console.log('postseek')
      this.postPlayCommand('SEEK')
      this.postHeartbeat(this.currentId)
    }
    store.commit('updateListentogetherRoomDetial', this.listentogether.roomDetial)
  }
  async postListogetherData() {
    const displayList = this._list.map((i) => i.id).join(',') || null
    const randomList = this.shuffledList.map((i) => i.id).join(',') || null
    const playmodeMap = {
      loop: 'SINGLE_LOOP',
      list: 'ORDER_LOOP',
      random: 'RANDOM'
    }
    if (displayList && randomList) {
      postPlaylist(
        this.listentogether.roomId,
        this.listentogether.creatorId,
        displayList,
        randomList,
        playmodeMap[this.playmode],
        'REPLACE',
        this.listentogetherClientSeq++
      )
    }
  }
  async postPlayCommand(type) {
    const songId = this.currentId
    const former = this.lastId || -1
    const playStatus = this.audioManager.status || 'PAUSE'
    const command = type === 'SEEK' ? 'SEEK' : this.audioManager.status || 'PAUSE'
    const progress = Math.floor((this.audioManager.currentTime || 0) * 1000)
    songId &&
      postPlayCommand(
        this.listentogether.roomId,
        playStatus,
        progress,
        command,
        former,
        songId,
        this.listentogetherClientSeq++
      )
  }
  async postHeartbeat(songId) {
    const playStatus = this.audioManager.status || 'PAUSE'
    const progress = Math.floor((this.audioManager.currentTime || 0) * 1000)
    if (this.listentogether.roomId && songId) {
      postRoomHeartbeat(this.listentogether.roomId, songId, playStatus, progress)
    }
  }

  initListentogether() {
    this.isListentogether = true
    store.commit('updateListentogetherInRoom', true)
    if (this.listentogether.isHost) {
      const source = {
        type: 'listentogether',
        id: this.listentogether.roomId,
        isHost: true
      }
      this.listentogether.source = source
      this.source = source
      //初次提交一次信息
      this.postListogetherData()
      this.postPlayCommand(null)
      this.postHeartbeat(this.currentId)
      if (this.listentogetherPollingInterval) {
        clearInterval(this.listentogetherPollingInterval)
        this.listentogetherPollingInterval = null
      }
      this.listentogetherPollingInterval = setInterval(() => {
        this.listentogetherRoomStatusHandler()
      }, 1000)
    } else {
      const source = {
        type: 'listentogether',
        id: this.listentogether.roomId,
        isHost: false
      }
      this.listentogether.source = source
      this.source = source

      this.listentogetherDataHandler(true)
      if (this.listentogetherPollingInterval) {
        clearInterval(this.listentogetherPollingInterval)
        this.listentogetherPollingInterval = null
      }
      this.listentogetherPollingInterval = setInterval(() => {
        this.listentogetherDataHandler(false)
        this.listentogetherRoomStatusHandler()
      }, 1000)
    }
  }
  async endListentogetherRoom(roomId) {
    clearInterval(this.listentogetherPollingInterval)
    this.listentogetherPollingInterval = null
    this.isListentogether = false

    const end = await endRoom(roomId || this.listentogether.roomId)
    if (end.code === 200) {
      store.commit('updateListentogetherRoomDetial', {})
      store.commit('updateListentogetherInRoom', false)
      this.listentogether = {
        isHost: false,
        isJoined: false,
        roomId: null,
        creatorId: null,
        roomDetial: {},
        hintText: '',
        formerSongId: 0,
        targetSongId: 0,
        lastProgress: 0
      }
    }
  }
  _listentogetherInviteLinkFormatter(roomId, creatorId, songId = this.currentId, motd = '') {
    return `${motd} https://st.music.163.com/listen-together/share/?songId=${songId}&roomId=${roomId}&inviterId=${creatorId}`
  }
  async syncListentogether() {}
}
