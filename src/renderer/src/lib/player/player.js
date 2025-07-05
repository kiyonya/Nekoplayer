import { matchSong } from '@/api/edit'
import { getDynamicCover, getSongDetial, getSongUrl, scrobble } from '@/api/song'
import { store } from '@/store'
import { computed, watch } from 'vue'
import { getPlaylistDetial} from '@/api/playlist'
import { getAlbum } from '@/api/album'
import { getArtistBriefAndSongs, getArtistDetial } from '@/api/artist'
import { getDailySong, personalFM } from '@/api/recommend'
import { showConfirmDialog, showSideNotification } from '@/components/notification/use_notification'
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
import path from 'path-browserify'
import { getDjRadioAllVoiceId, getProgramDetail } from '@/api/program'
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
const quality = computed(() => {
  return store.state.config.audioQuality
})
export default class Player {
  constructor() {
    this.AUDIO = null
    this.events = {}
    this.audioManager = new AudioManager()
    this.audioCacheDB = new Dexie('audioCacheDB')
    this.audioCacheDB.version(1).stores({
      audioCache: 'resource,linkpath',
      lyricCache: 'resource,lyric',
      musicDetialCache: 'resource,detial,coverpath'
    })
    this.playmode = 'list'
    this.useShuffle = false
    this.volume = 1
    this.volumeBeforeMute = 1
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
    this.initplay = false
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
      lastProgress: 0,
      progress: undefined
    }
    this.quickPlayAudios = {}
    this.listentogetherClientSeq = 1
    this.listentogetherServerSeq = Date.now()
    this.beforeJoinSaved = {
      shuffle: [],
      list: [],
      index: 0
    }
    this.listentogetherActionFreeze = false
    this.listentogetherActionFreezeInterval = null
    this.listentogetherPollingInterval = null
    this.listentogetherPlaymode = 'ORDER_LOOP'
    this.INIT()
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
  clearAudioCache() {
    this.audioCacheDB.audioCache.clear()
    this.audioCacheDB.lyricCache.clear()
    this.audioCacheDB.musicDetialCache.clear()
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
    if (source?.type === 'localgroup') {
      this.playLocalMusic(id)
    } else if (source?.type === 'pfm') {
      getSongDetial(id).then((data) => {
        data = data?.songs?.[0] || {}
        this.updatePersonalFM({ ...data, album: data?.al, artists: data?.ar })
        data = null
      })
      this.playMusicOnNcm(id)
    } else if (source?.type === 'voicelist') {
      //写到这
      ////////
      this.playVoiceOnNcm(id)
    } else {
      this.playMusicOnNcm(id)
      if (config.value.allowScrobble) {
        this.scrobbleTrack(id, source)
      }
    }
    this.savePlayerState()

    //上传一次列表给主进程
    let cur = this.getCursor(id)
    window.electron.ipcRenderer.send("player:list",this.list.slice(cur,cur+20))
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
  playPersonalFM(first = true) {
    this.isPersonalFM = true
    if (this.personalFMList && this.personalFMList.length > 1) {
      this.list = this.personalFMList.map((i) => {
        return {
          id: i.id,
          source: {
            id: null,
            type: 'pfm'
          }
        }
      })
      this.play(this.list[0].id, this.list[0].source)
    } else {
      this.nextFM()
    }
  }
  playVoiceList(start, mapListIds, source, playfirst = false) {
    const { id } = source
    if (mapListIds) {
      this.changePlaylist(mapListIds, source, playfirst)
    } else {
      getDjRadioAllVoiceId(id).then((ids) => {
        ids = ids.map((i) => {
          return {
            id: i.programId,
            source
          }
        })
        this.changePlaylist(ids, source, playfirst)
      })
    }
    if (start) {
      this.play(start, source, false)
    }
  }

  automap(list, source) {
    return list.map((i) => {
      return { id: i.id, source }
    })
  }
  nextFM() {
    if (!this.isPersonalFM) {
      return
    }
    let cursor = this.getCursor()
    if (this.list.length - cursor <= 5) {
      this.getPersonalFMTracks().then((songs) => {
        for (const i of songs) {
          const isRepeat = this.personalFMList.findIndex((t) => t.id === i.id)
          if (isRepeat < 0) {
            this.list.push({
              id: i.id,
              source: {
                id: null,
                type: 'pfm'
              }
            })
          }
        }
      })
    }

    if (this.personalFMList.length <= 0) {
      showSideNotification('私人FM', '太快啦~还没有获得新的FM', 2000, (close) => {
        close()
      })
      return
    }
    let nextTrack
    if (cursor < this.list.length - 1) {
      nextTrack = this.list[cursor + 1]
    } else {
      nextTrack = this.list[0]
    }
    this.play(nextTrack.id, nextTrack.source, false)
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
  async playMusicOnNcm(id,opt = { listogetherCommandReciver: false }) {
    this.lastId = this.currentId
    this.currentId = id
    if (this.isListentogether && !opt.listogetherCommandReciver) {
      this.postPlayCommand(this.autoplay ? 'PLAY' : 'PAUSE')
      this.postHeartbeat(id)
    }
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
      this.updateNowPlaying(detial)
      //听歌打卡
      
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
      expectQuality: quality.value,
      type: 'net',
      local: false,
      format: {},
      ...etc
    }
  }
  async playVoiceOnNcm(programId) {
    this.lastId = this.currentId
    this.currentId = programId
    store.commit('updateLyric', [])
    this.getSongDetialFromNcm(programId, true).then((data) => {
      let sid = data?.mainSongId
      this.updateNowPlaying(data)
      this.getAudioSourceFromNcm(sid).then((url) => {
        this.replaceTrack(programId, url, this.autoplay)
      })
    })
  }
  async getSongDetialFromNcm(id, isProgram = false) {
    return new Promise(async (resolve, reject) => {
      const cache = await this.audioCacheDB.musicDetialCache.get({ resource: id })

      if (cache && config.value.enableCache) {
        const detial = JSON.parse(cache.detial)
        const coverid = `cover-${id}`
        const readResult = await window.api.readBuffer(coverid, config.value.cachePath)
        if (readResult.exists) {
          const blob = new Blob([readResult?.buffer])
          const objurl = URL.createObjectURL(blob)
          resolve({ ...detial, cover: objurl })
        } else {
          resolve(detial)
        }
      } else {
        if (isProgram) {
          getProgramDetail(id).then((data) => {
            let detail = data?.program?.mainSong
            let fd = {
              name: detail?.name,
              id: id,
              cover: data?.program?.coverUrl,
              artist: detail?.artists,
              album: detail?.album,
              duration: detail?.duration,
              tns: null,
              alias: null,
              mv: null,
              expectQuality: quality.value,
              type: 'voice',
              local: false,
              mainSongId: detail?.id,
              format: {}
            }
            this.cacheMusicDetial(id, fd)
            resolve(fd)
          })
        } else {
          getSongDetial(id).then((data) => {
            const detial = data?.songs[0]
            const fod = this.formatDetial(id, detial)
            this.cacheMusicDetial(id, fod)
            resolve(fod)
          })
        }
      }
    })
  }
  async cacheMusicDetial(id, detial) {
    if (!config.value.enableCache) {
      return
    }
    const coverUrl = detial?.cover
    const fileid = `cover-${id}`
    const cacheResult = await window.electron.ipcRenderer.invoke('tool:downloadFileTo', {
      url: coverUrl + '?param=500y500',
      filepath: config.value.cachePath,
      filename: fileid + '.cb'
    })
    if (cacheResult?.success) {
      this.audioCacheDB.musicDetialCache.put({
        resource: id,
        detial: JSON.stringify(detial),
        coverpath: cacheResult?.path
      })
    }
  }
  replaceTrack(id, file, autoplay = true) {
    if (this.initplay) {
      autoplay = false
      this.initplay = false
    }
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

      this.isPersonalFM = false
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
  clearPlaylist() {
    let now = this.list.filter((i) => i.id == this.currentId)
    this.list = [...now]
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
          const trackIds = data?.data?.dailySongs
          this.list = trackIds.map((track) => {
            return { id: track.id, source }
          })
          resolve(this.list)
        })
      }
    })
  }
  async scrobbleTrack(id, source) {
    if (!['playlist', 'album'].includes(source?.type)) {
      return
    }
    const scrobbleResult = await scrobble(id, source?.id, '')
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
    this.play(nextTrack.id, nextTrack.source, false)
  }
  previous() {
    let cursor = this.getCursor()
    let previousTrack
    if (cursor > 0) {
      previousTrack = this.list[cursor - 1]
    } else {
      previousTrack = this.list[this.list.length - 1]
    }
    this.play(previousTrack.id, previousTrack.source, false)
  }
  execPlay(opt = {}) {
    this.audioManager.play()
    if (this.isListentogether && !opt.listentogetherCommandRecieve) {
      this.postPlayCommand('PLAY')
    }
  }
  execPause(opt = {}) {
    this.audioManager.pause()
    if (this.isListentogether && !opt.listentogetherCommandRecieve) {
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
  seek(time = null, opt = {}) {
    if (!time) {
      return null
    }
    if (time > this.duration) {
      time = this.duration
    }
    this.audioManager.seek(time)
    if (this.isListentogether && !opt.listentogetherCommandRecieve) {
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
    if (this.isPersonalFM) {
      return
    }
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
    if (this.isListentogether) {
      this.postListogetherData()
    }
    //通知ipc
    window.electron.ipcRenderer.send("player:playmodechange",this.playmode)
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
    //当前播放的信息发给主进程进行保存
    window.electron.ipcRenderer.send('player:nowplaying', this.currentMusicInfo)
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
    window.electron.ipcRenderer.send("player:trackend")
  }
  onTimeupdate() {
    const currentTime = this.audioManager.currentTime //ss
    this.currentTime = currentTime
    window.electron.ipcRenderer.send('player:timeupdate', currentTime)
    store.commit('updateAudioState', { key: 'ct', value: currentTime })
  }
  onCanplay() {
    const duration = this.audioManager.durationSync // ss
    this.duration = duration
    store.commit('updateAudioState', { key: 'dt', value: duration })
    window.electron.ipcRenderer.send("player:canplay",duration)
  }
  onPause() {
    store.commit('updateAudioState', { key: 'state', value: 'pause' })
    window.electron.ipcRenderer.send('player:pause')
  }
  onPlay() {
    store.commit('updateAudioState', { key: 'state', value: 'play' })
    window.electron.ipcRenderer.send('player:play')
  }
  onVolumeChange() {
    store.commit('updateAudioState', { key: 'volume', value: this.audioManager.volume })
    window.electron.ipcRenderer.send('player:volumechange',this.audioManager.volume)
  }
  async getAudioSourceFromNcm(id) {
    const cache = await this.readAudioFromCache(id, quality.value)
    if (cache) {
      return cache
    } else if (this.isLogin()) {
      const track = await getSongUrl(id, quality.value)
      if (!track) return null
      if (!track.url) return null
      if (track.freeTrialInfo !== null) return null
      this.cacheAudioBuffer(id, quality.value, track.url.replace(/^http:/, 'https:'))
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
      const resource = `audio-${id}-${quality}.cb`

      const cache = await window.electron.ipcRenderer.invoke('tool:downloadFileTo', {
        url,
        filepath: config.value.cachePath,
        filename: resource
      })
    } catch (error) {}
  }
  async readAudioFromCache(id, quality) {
    const resource = `audio-${id}-${quality}`
    const filepath = path.join(config.value.cachePath, resource + '.cb')
    const exist = await window.api.fileExist(filepath)
    if (exist) {
      return filepath
    } else {
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

    let path, data
    if (!localSongData) {
      if (this.quickPlayAudios[md5]) {
        path = this.quickPlayAudios[md5]?.path
        data = this.quickPlayAudios[md5]
      }
    } else {
      path = localSongData?.path
      data = localSongData?.data
    }

    if (!path || !data) {
      return
    }
    const exist = await window.api.fileExist(path)
    if (exist) {
      this.replaceTrack(md5, path, this.autoplay)
    }
    this.updateNowPlaying(data)
    if (data?.matched) {
      getDynamicCover(data?.id).then((data) => {
        this.updateDynamicCover(data?.data)
      })
    } else {
      this.updateDynamicCover(null)
    }
    const lyric = await localMusic.getLocalLyric(md5)
    if (lyric) {
      this.lyric = lyric
      store.commit('updateLyric', this.lyric)
      localMusic.setLocalLyric(md5, this.lyric)
      this.sendLyric(this.lyric)
    } else {
      if (data?.matched) {
        const lyric = await getLyric(data.id)
        this.lyric = lyric
        store.commit('updateLyric', this.lyric)
        localMusic.setLocalLyric(md5, this.lyric)
        this.sendLyric(this.lyric)
      } else {
        this.lyric = []
        store.commit('updateLyric', this.lyric)
        localMusic.setLocalLyric(md5, this.lyric)
        this.sendLyric(this.lyric)
      }
    }
  }
  async playLocalList(start, mapListIds, source) {
    this.changePlaylist(mapListIds, source, false)
    if (start) {
      this.playLocalMusic(start)
    }
  }
  /**
   *
   * @param {Array<FILEPATH>} files
   */
  async quickPlayAudioFiles(files) {
    const details = await localMusic.getLocalMusicMatchedDetial(files)
    const itemsArray = Object.values(details)
    for (const d of itemsArray) {
      this.quickPlayAudios[d?.md5] = d
    }
    this.playInsertTracks(
      itemsArray[0].md5,
      itemsArray.map((i) => {
        return {
          id: i.md5,
          source: {
            id: Date.now(),
            type: 'localgroup'
          }
        }
      }),
      {
        id: Date.now(),
        type: 'localgroup'
      }
    )
  }
  sendLyric(lyric) {
    window.electron.ipcRenderer.send("player:updatelyric",lyric || [])
  }
  /**
   * 更新音乐的信息
   * @param {object} info
   */
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
    this.readPlayerState()
    this.initMeidaSession()
    this.eventListen()
    this.initAudioEffect()
    this.initIpc()
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
  initMeidaSession() {
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
    window.electron.ipcRenderer.on('player:playsong', (e, id,source) => {
      this.play(id,source)
    })
    window.electron.ipcRenderer.on('player:seek', (e, currentTime) => {
      this.seek(currentTime)
    })
    window.electron.ipcRenderer.on('player:next', (e) => {
      this.next()
    })
    window.electron.ipcRenderer.on('player:previous', (e) => {
      this.previous()
    })
    window.electron.ipcRenderer.on('player:toggleplay', (e) => {
      this.playOrPause()
    })
    window.electron.ipcRenderer.on('player:playmode', (e, mode) => {
      this.changePlaymode(mode)
    })
    window.electron.ipcRenderer.on("player:changevolume",(e,v)=>{
      this.setVolume(v)
    })
  }
  updateMediaSession(info) {
    const meta = {
      title: info?.name,
      artist: info?.artist?.map((a) => a.name).join(','),
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
    let trackIds = this.list.filter((i) => i.source.type !== 'localgroup').map((i) => i.id)
    let cursor = this.getCursor()
    const detials = (await getSongDetial(trackIds))?.songs
    return detials
  }
  async queryPlaylist() {
    const detial = await this.listDetial
    return detial
  }

  //一起听
  async createListentogetherRoom() {
    const _createRoom = async () => {
      const createdRoom = await createRoom()
      if (createdRoom?.code === 200) {
        this.listentogether.roomDetial = createdRoom?.data?.roomInfo
        this.listentogether.roomId = this.listentogether.roomDetial?.roomId
        this.listentogether.creatorId = this.listentogether.roomDetial?.creatorId
        this.listentogether.isHost = true
        this.listentogether.isJoined = true
        store.commit('updateListentogetherRoomDetial', this.listentogether.roomDetial)
        this.initListentogether(this.listentogether.roomDetial?.roomId)
      }
    }
    const status = await getRoomStatus()
    if (status.data?.inRoom) {
      const choice = await showConfirmDialog(
        '当前正在一起听',
        '您可以选择恢复之前的一起听或者结束后新建',
        [
          {
            label: '结束一起听',
            act: 'end'
          },
          {
            label: '恢复一起听',
            act: 'recover',
            style: 'strong'
          }
        ]
      )
      if (choice === 'canceled') {
        return
      } else if (choice === 'recover') {
        const ishost = status.data?.roomInfo?.creatorId == profile.value.userId
        this.listentogether.roomDetial = status?.data?.roomInfo
        this.listentogether.roomId = this.listentogether.roomDetial?.roomId
        this.listentogether.creatorId = this.listentogether.roomDetial?.creatorId
        this.listentogether.isHost = ishost
        this.listentogether.isJoined = true
        store.commit('updateListentogetherRoomDetial', this.listentogether.roomDetial)
        this.initListentogether(this.listentogether.roomDetial?.roomId)
        return
      } else if (choice === 'end') {
        await this.endListentogetherRoom(status?.data?.roomInfo?.roomId)
        await _createRoom()
      }
    } else {
      await _createRoom()
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
    if (check?.data?.status === 'FULL') {
      return
    } else if (check && check?.data?.joinable) {
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
        }
        this.initListentogether()
      }
    }
  }
  async listentogetherDataHandler(isinit) {
    const playlist = await getHostPlaylist(this.listentogether.roomId)

    const clientSeq = playlist?.data?.playCommand?.clientSeq
    const serverSeq = playlist?.data?.playCommand?.serverSeq
    if (this.listentogetherActionFreeze) {
      return
    }

    if (
      (serverSeq > this.listentogetherServerSeq && clientSeq > this.listentogetherClientSeq) ||
      isinit
    ) {
      this.listentogetherClientSeq = clientSeq
      this.listentogetherServerSeq = Date.now()
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
      if (isNeedReplace || isinit) {
        if (isinit) {
          this.beforeJoinSaved.list = this._deepClone(this._list)
          this.beforeJoinSaved.shuffle = this._deepClone(this.shuffledList)
        }
        this._list = this.normalList
        playmode === 'RANDOM' && (this.shuffledList = this.randomList)
      }
      //跳转播放进度
      if (isinit) {
        this.seek(parseInt(progress) / 1000)
      }
      //指令相应
      if (commandType === 'PAUSE') {
        this.execPause({ listentogetherCommandRecieve: true })
      } else if (commandType === 'PLAY') {
        this.execPlay({ listentogetherCommandRecieve: true })
      } else if (commandType === 'SEEK') {
        this.seek(parseInt(progress) / 1000, { listentogetherCommandRecieve: true })
      }
      if (this.listentogether.progress !== progress) {
        this.seek(parseInt(progress) / 1000, { listentogetherCommandRecieve: true })
        this.listentogether.progress = progress
      }

      //播放以及播放判断
      if (this.listentogether.formerSongId !== targetSongId || isinit) {
        this.playMusicOnNcm(targetSongId, { listogetherCommandReciver: true })
        // this.play(targetSongId, this.listentogether.source)
        this.listentogether.formerSongId = targetSongId
      }
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

    // console.log(
    //   status?.data?.roomInfo?.roomUsers,
    //   this.listentogether.roomDetial?.roomUsers,
    //   isUserJoined
    // )
    this.listentogether.roomDetial = status?.data?.roomInfo
    status?.data?.roomInfo?.roomId && (this.listentogether.roomId = status?.data?.roomInfo?.roomId)
    status?.data?.roomInfo?.creatorId &&
      (this.listentogether.creatorId = status?.data?.roomInfo?.creatorId)
    if (isUserJoined && this.isListentogether && this.listentogether.isHost) {
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
        this.listentogetherClientSeq
      )

      clearInterval(this.listentogetherActionFreezeInterval)
      this.listentogetherActionFreeze = true
      this.listentogetherActionFreezeInterval = setInterval(() => {
        this.listentogetherActionFreeze = false
      }, 1200)
    }
  }
  async postPlayCommand(type) {
    const songId = this.currentId
    const former = this.lastId || -1
    const playStatus = this.audioManager.status || 'PLAY'
    const command = type ? type : this.audioManager.status
    const progress = Math.floor((this.audioManager.currentTime || 0) * 1000)
    songId &&
      postPlayCommand(
        this.listentogether.roomId,
        playStatus,
        progress,
        command,
        former,
        songId,
        this.listentogetherClientSeq
      )
    if (songId) {
      clearInterval(this.listentogetherActionFreezeInterval)
      this.listentogetherActionFreeze = true
      this.listentogetherActionFreezeInterval = setInterval(() => {
        this.listentogetherActionFreeze = false
      }, 1200)
    }
  }
  async postHeartbeat(songId) {
    const playStatus = this.audioManager.status || 'PLAY'
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
      this.listentogetherDataHandler(true)
      if (this.listentogetherPollingInterval) {
        clearInterval(this.listentogetherPollingInterval)
        this.listentogetherPollingInterval = null
      }
      this.listentogetherPollingInterval = setInterval(() => {
        this.listentogetherDataHandler(false)
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
      this.listentogetherClientSeq = 1
      this.listentogetherServerSeq = Date.now()
      this.listentogetherActionFreeze = false
      this.listentogetherActionFreezeInterval = null
    }
  }
  _listentogetherInviteLinkFormatter(roomId, creatorId, songId = this.currentId, motd = '') {
    return `${motd} https://st.music.163.com/listen-together/share/?songId=${songId}&roomId=${roomId}&inviterId=${creatorId}`
  }

  //保存期
  async savePlayerState() {
    if (!config.value?.savePlaylist) {
      localStorage.setItem('neko_player_state', JSON.stringify({}))
      return
    }
    let playerSave = {
      list: this.list,
      mode: this.playmode,
      current: this.currentId,
      cur: this.getCursor()
    }
    localStorage.setItem('neko_player_state', JSON.stringify(playerSave))
  }

  async readPlayerState() {
    if (!config.value?.savePlaylist) {
      this.initplay = false
      return
    }
    let state = JSON.parse(localStorage.getItem('neko_player_state'))
    if (state) {
      this.list = state?.list || []
      state.mode && this.changePlaymode(state?.mode)
      this.currentId = state?.current || 0

      if (state.cur !== undefined) {
        let audio = this.list[state.cur]
        console.log(audio)
        this.initplay = true
        if (audio && audio?.id && audio?.source) {
          this.play(audio?.id, audio?.source)
        }
      }
    }
  }
}
/**
 * 
 __   __  _______  ___      ___      _______ 
|  | |  ||       ||   |    |   |    |       |
|  |_|  ||    ___||   |    |   |    |   _   |
|       ||   |___ |   |    |   |    |  | |  |
|       ||    ___||   |___ |   |___ |  |_|  |
|   _   ||   |___ |       ||       ||       |
|__| |__||_______||_______||_______||_______|

⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠿⠟⠿⢿⣿⣿⣯⠓⠀⠀⠀⠀⠀⢀⣠⣾⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⡿⡎⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠡⠄⠈⠁⠀⠀⠀⣠⣶⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⡍⠿⢧⡘⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣿⣿⡿⠟⠉⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠂⠸⣧⣼⣧⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⠴⠾⠟⠛⠉⠉⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⣤⢰⣾⡷⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣷⢟⡄⢀⣀⠀⠀
⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⢯⠟⢸⣿⣷⣦
⠆⠀⠀⢀⣴⣾⣷⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡜⣿⣿⡆⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡞⢀⣿⣿⣿⣿
⡖⢀⣴⣿⣿⡿⠃⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢹⣿⣿⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠘⣿⣧⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢠⣾⣿⣿⣿⣿
⣻⣿⣿⣿⠏⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠸⣿⣏⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡛⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢉⣿⣿⣿⣿
⣿⣿⣿⡏⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⣿⣿⣿⣿⡿⢁⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠹⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣾⣿⣿
⣿⣿⡿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⠃⣼⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠛⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿
⣿⡿⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣿⠇⣸⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⡇⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⢻⣿⣿⣎⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿
⣿⠁⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⡟⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⣶⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣷⡄⢻⣿⣿⣿⣟⣿⣛⣿⣟⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠈
⣿⣤⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⡆⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠰⣯⠷⣌⣿⣿⣿⣿⣿⣿⣾⣿⣿⣎⢻⣿⣿⣿⡛⢿⣯⠻⣿⣿⣿⣆⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢹⠃⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⡀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢿⣿⡦⠻⣷⣭⣎⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣻⣿⣿⡆⠉⠁⠘⢿⣿⣿⡆⢳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢘⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣷⡌⢿⣿⣿⣿⣽⣿⣞⢿⣿⣿⣦⠙⢿⣦⡘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣴⣤⡈⢿⣿⣿⠈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠿⠿⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣌⣿⣿⡏⢹⣿⣿⣧⣹⢞⣿⣷⣦⣹⣷⡜⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡈⢻⣿⡇⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣤⣀⣀⣀⣀⣀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣼⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⠿⠦⠀⠀⠈⠻⠉⢿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⢿⣷⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢟⡃⢀⣠⣴⣶⣶⣶⣶⣶⣶⣦⣴⣤⣾⣿⣿⣿⣿⠸⣿⣿⢻⣿⣿⣿⣿⡆⢸⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣿⡟⣱⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠛⠻⠀⠙⠛⠀⠀⠈⠉⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⠏⣾⣿⣿⣿⣿⣿⣾⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⡿⢋⣼⣿⣿⣿⡟⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⢿⣿⣿⣷⢔⣠⣶⣾⣿⣿⣿⣿⣿⣿⣶⣦⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢋⠉⠉⠉⠉⠉⠉⠉⠁⢼⢏⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⡀⠀⠀⠀⠀⠀⠀
⡿⠋⣠⣾⣿⣿⣿⡿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠈⠉⠀⠀⠀⠀⠀⠀⠀⣀⡀⡾⢉⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢠⡇⠀⠀⠀⠀⠀⠀
⣠⣼⣷⣶⣿⣿⡟⣵⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣈⠻⣿⣿⣿⡿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣤⣤⣤⣤⣤⣴⣶⣶⣿⠿⢁⣤⣾⡿⠿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣿⣿⡟⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⠠⡛⠀⠿⠟⠁⠀⠀⠀⠀⠀⢀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣋⡤⠰⣛⣏⣠⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⠇⠀⠀⠀⠀⠀⠀
⣿⣿⣿⠿⠋⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡎⣿⣿⣿⠀⣦⡀⠀⠀⠀⢀⣀⣤⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠿⠋⠁⠄⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢹⣿⡇⠀⡟⠙⠖⠲⠂⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⡯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⢁⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠆⠈⠀⣼⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢿⡇⢸⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⠟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠈⠃⡌⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡙⠿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣼⣿⣿⣿⣿⣿⠁⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢋⣿⡏⠙⠆⠙⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⢻⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣿⣿⣿⣿⣿⡇⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⢀⣤⡄⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢛⣩⣴⣾⣿⣿⡇⠀⣤⣤⠆⣀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣠⣷⢸⣿⣿⣿⣿⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⡇⠛⠛⢆⡀⠀⠻⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⣉⣥⣶⣿⣿⣿⣿⣿⣿⣇⠀⠃⣀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢋⣿⠃⠀⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⡾⣿⣿⡏⣿⣿⠁⠀⠀⠀⠀⠘⣿⡏⢮⠻⢿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⠿⢿⡿⢟⣛⣯⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠋⢁⣴⣿⡏⠀⣼⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣿⣿⡇⣿⣿⢰⣿⡟⠀⠀⠀⣄⠀⠀⠘⢷⡄⠀⠀⠙⢿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⣹⣦⣍⣉⠉⠉⠉⠉⠁⠀⠀⣶⡿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠀⠀⠀⣀⣀
⣿⣿⣿⣿⣷⣾⣿⠇⠀⢠⣾⣿⣤⡀⠀⠀⠹⣶⣄⠀⠀⠉⠃⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⢁⣰⣾⣯⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠈⢱⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀⣴⡿⠃⠀⢀⣴⣿⣿
⣿⣿⣿⣿⡇⠛⠃⠀⠀⠞⠛⢿⣿⣧⠆⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣦⠀⣿⣿⣿⣿⣿⣿⣿⠟⠛⢁⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠉⠁⠀⠀⠀⠀⠀⢀⣦⡀⠈⠉⠀⠀⠘⠛⢻⣿⣿
⣿⠿⠛⣋⣤⡤⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢤⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⠀⠀⠀⢀⣶⠀⠀⠀⠀⠀⡀⠘⣯⣴⣿⣿⡿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⠀⠀⠀⠸⣿⣿
⣤⣶⣿⣿⠏⠁⠂⢀⣀⣤⣶⡆⠀⠀⠀⠐⠊⣁⣤⡀⠀⠀⠀⠀⠀⣠⡖⠀⠀⠀⠀⠀⠀⠀⠀⠰⠿⠿⠿⠀⠀⠀⢀⣤⣖⢀⣀⣀⣴⣷⠀⠹⡿⢏⣹⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣤⣤⣀⣀⣠⣄⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿
⣿⣿⣿⡏⣠⣴⣾⣿⣿⡿⠋⠀⠀⣀⣤⣶⣿⠿⠋⠀⠀⠀⣀⣴⣿⣿⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣶⣾⣿⣿⣶⡿⠃⠙⠛⠻⠿⠿⠸⠒⢀⣰⠈⠑⠿⠿⠿⠛⠛⠛⠉⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢀⣤⣾⡿⠟⣋⣡⣤⣠⣤⣶⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠐⠀⠀⠀⠀⠀⠀⠀⡀⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿
 */
