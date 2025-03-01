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
const dexie = require('dexie')
const path = require('path')
const config = computed(() => {
  return store.state.config
})
const useEQ = computed({
  get:()=>store.state.config.useEQ
})
const equalizer = computed({
  get:()=>store.state.equalizerData
})
export default class Player {
  constructor() {
    this.AUDIO = null
    this.audioManager = new AudioManager()
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
    this.source = { type: '', id: 114514 }
    this.oldSource = undefined
    this.currentMusicInfo = {}
    this.currentId = 0
    this.lastId = 0
    this.nextId = 0
    this.autoplay = true
    this.quality = 'standard'
    this.duration = 0
    this.currentTime = 0
    this.lyric = {}
    this.personalFMInit = false
    this.currentPersonalFMTrack = {}
    this.currentPersonalFMId = 0
    this.nextPersonalFMTrack = {}
    this.personalFMList = []
    this.isPersonalFM = false
    this.INIT()

    window.prr = this.changePlaymode.bind(this)
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
  get currentNormalList(){
    return this._list
  }
  get currentShuffedList(){
    return this.shuffledList
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
    this.lastId = this.currentId
    this.currentId = id
    if (source.type === 'local') {
      fileToMD5(id).then((md5) => {
        this.playLocalMusic(id, md5)
      })
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
  insertPlaylistCandy(playlistId,source){
    getPlaylistDetial(playlistId,true).then(detial=>{
      const trackIds = detial.playlist.trackIds.map((track) => {
        return { id: track.id, source }
      })
      this.playInsertTracks(null,trackIds,source)
    })
  }
  insertAlbumCandy(albumId,source){
    getAlbum(albumId).then((data) => {
      let trackIds = data?.songs.map((i) => {
        return { id: i.id, source }
      })
      this.playInsertTracks(null,trackIds,source)
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
    getLyric(id).then(data=>store.commit("updateLyric",data))
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
  playMusicOnNcm(id) {
    this._updateLyric([])
    this.getAudioSourceFromNcm(id).then((url) => {
      this.replaceTrack(id, url, this.autoplay)
    })
    nekoLyricObjectGenerator(id).then((lyric) => {
      this._updateLyric(lyric)
    })
    getLyric(id).then(data=>store.commit("updateLyric",data))
    getSongDetial(id).then((data) => {
      const detial = data?.songs[0]
      console.log(detial)
      this.updateNowPlaying({
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
        format: {}
      })
    })
    getDynamicCover(id).then((data) => {
      this.updateDynamicCover(data?.data)
    })
  }
  replaceTrack(id, file, autoplay = true) {
    this.audioManager.loadFromUrl(file,autoplay)
  }
  /**
   * @param {array} mapListIds
   * @param {Object} source
   */
  changePlaylist(mapListIds, source, playfirst = false) {
    this.list = mapListIds
    if (this.isNeedReplaceSource(source)) {
      this.source = source
      showSideNotification('播放器通知', '当前播放列表已被修改', 2000, (close) => {
        close()
      })
    }
    this.listDetialCached = false
    this.updateNowPlayingSource(source)
    this.shufflePlaylist()
    this.updatePlaylist(this.list)
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
    if (this.isPersonalFM) {
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
  }
  execPause() {
    this.audioManager.pause()
  }
  setVolume(i){
    this.audioManager.setVolume(i)
  }
  mute(){
    this.audioManager.mute()
  }
  unmute(){
    this.audioManager.unmute()
  }
  toggleMute(){
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
    return null
  }
  playOrPause() {
    this.audioManager.togglePlayPause()
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
    this.audioManager.on('volumechange',this.onVolumeChange.bind(this))
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
    store.commit('updateAudioState', { key: 'ct', value: currentTime })
  }
  onCanplay() {
    const duration = this.audioManager.durationSync // ss
    this.duration = duration
    store.commit('updateAudioState', { key: 'dt', value: duration })
  }
  onPause() {
    store.commit('updateAudioState', { key: 'state', value: 'pause' })
  }
  onPlay() {
    store.commit('updateAudioState', { key: 'state', value: 'play' })
  }
  onVolumeChange() {
    store.commit('updateAudioState', { key: 'volume', value: this.audioManager.volume })
  }
  async getAudioSourceFromNcm(id) {
    if (this.isLogin()) {
      const track = await getSongUrl(id, this.quality)
      if (!track) return null
      if (!track.url) return null
      if (track.freeTrialInfo !== null) return null
      return track.url.replace(/^http:/, 'https:')
    } else {
      return `https://music.163.com/song/media/outer/url?id=${id}`
    }
  }

  /**
   * 播放本地音乐
   * @param {string} file 本地音乐文件路径
   * @param {fileMD5<string>} md5
   * @returns {promise<void>}
   */
  async playLocalMusic(file, md5) {
    //播放
    this.AUDIO.src = file
    //----------
    const filename = path.basename(file)
    const meta = await musicMeta.parseFile(file)
    //允许联网匹配才会有match数据
    const match = config.value.useMatchLocalFileOnNcm
      ? await this._matchLocalMusic(md5, meta)
      : undefined
    if (match) {
      //仍然保持本地播放和本地属性
      match.ncmid = match.id
      match.id = file
      match.artist = match.artists
      match.ncmmatch = true
      //保持原封面 除非没有
      match.cover = meta.common?.picture
        ? this._blobImg(meta.common.picture[0])
        : match.album.picUrl
      ;(match.type = 'local'), (match.local = true), (match.format = meta.format), (match.md5 = md5)
      musicInfo.value = match
      return match
    } else {
      const info = {
        id: file,
        name: meta.common.title || filename,
        tns: undefined,
        alia: undefined,
        artist: meta.common?.artists
          ? meta.common.artists.map((ar) => {
              return { id: -1, name: ar }
            })
          : [],
        cover: meta.common?.picture ? this._blobImg(meta.common.picture[0]) : '',
        duration: audio.duration,
        mv: null,
        expectQuality: 'loacl',
        type: 'local',
        local: true,
        format: meta.format,
        md5: md5
      }
      this.updateNowPlaying(info)
    }
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
  initAudioEffect(){
    watch(equalizer,()=>{
            this.audioManager.biquadFilterGroup.update(equalizer.value.equalizerFrequency,equalizer.value.equalizerGains,equalizer.value.equalizerQuality)
    },{deep:true})
    
    watch(useEQ,()=>{
        if(useEQ.value){
          this.audioManager.biquadFilterGroup.enable()
        }
        else{
          this.audioManager.biquadFilterGroup.disable()
        }
    })
  }
  updateMediaSession(info) {
    console.log(info)
    const meta = {
      title: info.name,
      artist: info.artist.map((a) => a.name).join(','),
      album: info.album.name,
      artwork: [
        {
          src: info.cover + '?param=224y224',
          type: 'image/jpg',
          sizes: '224x224'
        },
        {
          src: info.cover + '?param=512y512',
          type: 'image/jpg',
          sizes: '512x512'
        }
      ],
      length: info.duration,
      trackId: info.id
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
    let trackIds = this.list.map((i) => i.id)
    let cursor = this.getCursor()
    const detials = (await getSongDetial(trackIds))?.songs
    console.log(trackIds)
    return detials
  }
  async queryPlaylist() {
    const detial = await this.listDetial
    return detial
  }
  cacheAudioFile(id, url) {
    cacheAudioFromUrl(id, url, this.quality)
  }
  readAudioFromCache(id, quality) {
    return readAudioCacheFile(id, quality)
  }
}
