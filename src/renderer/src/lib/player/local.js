import { matchSongsOnNcm } from '@/api/song'
import { showMessageNotification } from '@/components/notification/use_notification'
import Dexie from 'dexie'
const { createHash, randomUUID } = require('crypto')

export class LocalMusic {
  constructor() {
    this.localDB = new Dexie('localMusic')
    this.localDB.version(1).stores({
      group: 'groupId,detail,songs,cover',
      lyric: 'md5,lyric',
      songsData: 'md5,path,data'
    })
    this.localDB.open().catch((err) => {
      console.error('Failed to open database:', err)
    })
  }

  async createGroup(createOpt) {
    const { name, star = false, groupCover = null } = createOpt
    const groupId = randomUUID()
    const data = {
      groupId,
      detail: {
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        star
      },
      songs: [],
      cover: groupCover
    }
    await this.localDB.table('group').add(data)
    return {
      ...data,
      songCount: 0
    }
  }

  async deleteGroup(groupId) {
    await this.localDB.table('group').where('groupId').equals(groupId).delete()
  }

  async getGroups() {
    const groups = await this.localDB.table('group').toArray()
    return groups.map((group) => ({
      groupId: group.groupId,
      detail: group.detail,
      cover: group.cover,
      songCount: group.songs.length
    }))
  }

  async getGroupDetail(groupId) {
    return await this.localDB.table('group').where('groupId').equals(groupId).first()
  }

  async openGroup(groupId) {
    const group = await this.localDB.table('group').where('groupId').equals(groupId).first()
    return {
      detail: group?.detail || {},
      songs: group?.songs || [],
      id: groupId,
      songCount: group?.songs.length,
      cover: group?.cover || null
    }
  }
  /**
   *
   * @param {string} groupId
   * @param {Buffer} cover
   */
  async updateGroupCover(groupId, songMd5, custom = false) {
    const song = await this.localDB.table('songsData').where('md5').equals(songMd5).first()

    if (song?.data?.cover) {
      let coverUnit8Array = null
      if (typeof song?.data?.cover === 'string') {

        const blob = await fetch(song.data?.cover).then((res) => res.blob())
        coverUnit8Array = new Uint8Array(await blob.arrayBuffer())
      } else {
        coverUnit8Array = song?.data?.cover
      }

      await this.localDB
        .table('group')
        .where('groupId')
        .equals(groupId)
        .modify((group) => {
          group.cover = coverUnit8Array || null
          group.detail.updatedAt = Date.now()
        })

      return coverUnit8Array
    }
  }
  async addSong(songpath, groupId) {
    await this.localDB
      .table('group')
      .where('groupId')
      .equals(groupId)
      .modify((group) => {
        if (!group.songs.includes(songpath)) {
          group.songs.push(songpath)
          group.detail.updatedAt = Date.now()
        }
      })
  }

  async addDir(dirpath, groupId) {
    // In a real implementation, you would scan the directory for music files
    // This is a placeholder for that functionality
    const mockFilesFromDir = [
      `${dirpath}/song1.mp3`,
      `${dirpath}/song2.mp3`,
      `${dirpath}/song3.mp3`
    ]

    await this.localDB
      .table('group')
      .where('groupId')
      .equals(groupId)
      .modify((group) => {
        mockFilesFromDir.forEach((file) => {
          if (!group.songs.includes(file)) {
            group.songs.push(file)
          }
        })
        group.detail.updatedAt = Date.now()
      })
  }

  async deleteSong(md5, groupId) {
    await this.localDB
      .table('group')
      .where('groupId')
      .equals(groupId)
      .modify((group) => {
        group.songs = group.songs.filter((song) => song !== md5)
        group.detail.updatedAt = Date.now()
      })

    return await this.openGroup(groupId)
  }
  async deleteSongs(md5s, groupId) {
    await this.localDB
      .table('group')
      .where('groupId')
      .equals(groupId)
      .modify((group) => {
        group.songs = group.songs.filter((song) => !md5s.includes(song))
        group.detail.updatedAt = Date.now()
      })

    return await this.openGroup(groupId)
  }

  deleteSongFile(songpath,md5,groupId) {
    return new Promise((resolve, reject) => {
      window.api
        .deleteFile(songpath)
        .then(async () => {
          await this.deleteSong(md5, groupId)
          resolve(await this.openGroup(groupId))
        })
        .catch((error) => reject(error))
    })
  }
  async cacheLyric(md5, lyric) {
    await this.localDB.table('cacheLyric').put({
      md5,
      lyric,
      cachedAt: Date.now()
    })
  }

  async getCachedLyric(md5) {
    const entry = await this.localDB.table('cacheLyric').where('md5').equals(md5).first()
    return entry?.lyric
  }

  async getAllSongs() {
    return await this.localDB
      .table('group')
      .toArray()
      .then((groups) => {
        return groups.reduce((acc, group) => {
          acc.push(
            ...group.songs.map((song) => ({
              song,
              groupId: group.groupId,
              groupName: group.detail.name
            }))
          )
          return acc
        }, [])
      })
  }

  async clearAllGroups() {
    await this.localDB.table('group').clear()
  }

  async importDir(groupId, dirpath,drfile = null) {
    let result = null
    if(!drfile && dirpath){
      result = await window.api.readDir(dirpath, ['.mp3', '.flac', '.wav'], true)
    }
    if (result?.success || drfile) {
      const files = drfile || result.files || []
      let meta = await window.api.audioMetaReader(files)
      meta = meta.filter((i) => i.success)
      let metaMd5Index = {}
      meta.forEach((i) => {
        metaMd5Index[i.hash] = i
      })

      const matchList = meta.map((i) => {
        return {
          title: i?.meta.title || '',
          artist: i?.meta?.artist || '',
          album: i?.meta?.album || '',
          duration: i?.meta?.duration || 0,
          persistId: i.hash
        }
      })

      const matches = await matchSongsOnNcm(matchList)
      let matchMd5Index = {}
      for (let i in matches?.result?.ids) {
        matchMd5Index[matches?.result?.ids[i]] = matches?.result?.songs[i]
      }
      let importResult = {}
      // for(let i in matches?.result?.ids){
      //   const rawMeta = metaMd5Index[matches?.result?.ids[i]]?.meta
      //   const matchMeta = matches?.result?.songs[i]
      //   const meta = {
      //   }
      // }

      //     name: meta?.title || path.split('\\').pop().split('.').slice(0, -1).join('.'),
      //     id: md5,
      //     md5: md5,
      //     cover: localMusic.pictureHandler(meta.picture),
      //     artist: [],
      //     album: null,
      //     duration: meta?.duration,
      //     tns: null,
      //     alias: null,
      //     mv: null,
      //     expectQuality: null,
      //     type: 'local',
      //     local: true,
      //     reason: null,
      //     format: {},
      //     file: meta.path,
      //     bitrate: meta?.bitrate,
      //     match: false
      //

      const matchedMd5 = Object.keys(matchMd5Index)
      for (let md5 of Object.keys(metaMd5Index)) {
        const path = metaMd5Index[md5].path
        const size = metaMd5Index[md5].size
        const time = metaMd5Index[md5].time
        if (matchedMd5.includes(md5)) {
          //成功匹配
          const matchedMeta = matchMd5Index[md5]
          const rawMata = metaMd5Index[md5]?.meta
          importResult[md5] = {
            name: matchedMeta?.name,
            artist: matchedMeta?.artists,
            album: { ...matchedMeta?.album, matched: true },
            path,
            id: matchedMeta?.id,
            md5,
            tns: matchedMeta?.tns || null,
            alias: matchedMeta?.alias || null,
            type: 'local',
            local: true,
            duration: rawMata?.duration,
            mv: matchedMeta?.mv,
            matched: true,
            file: path,
            size,
            time,
            cover: rawMata.picture ? rawMata.picture[0].data : matchedMeta?.album?.picUrl,
            codec:rawMata?.codec,
            bitrate: rawMata?.bitrate,
            lossless: rawMata?.lossless,
          }
        } else {
          //没有匹配
          const rawMata = metaMd5Index[md5]?.meta
          importResult[md5] = {
            name: rawMata?.title || path.split('\\').pop().split('.').slice(0, -1).join('.'),
            artist: rawMata?.artists
              ? rawMata?.artists.map((i) => {
                  return { name: i, matched: false, id: null }
                })
              : [{ name: '未知', matched: false, id: null }],
            album: { name: rawMata?.album, matched: false, id: null, picUrl: null },
            path,
            id: md5,
            md5,
            tns: null,
            alias: null,
            type: 'local',
            local: true,
            duration: rawMata?.duration,
            mv: null,
            matched: false,
            file: path,
            size,
            time,
            cover: rawMata.picture ? rawMata.picture[0].data : null,
            codec:rawMata?.codec,
            bitrate: rawMata?.bitrate,
            lossless: rawMata?.lossless,
          }
        }
      }

      await this.localDB.songsData.bulkPut(
        Object.values(importResult).map((data) => {
          return {
            md5: data?.md5,
            path: data?.path,
            data
          }
        })
      )

      await this.localDB
        .table('group')
        .where('groupId')
        .equals(groupId)
        .modify((group) => {
          for (let md5 of Object.keys(importResult)) {
            if (!group.songs.includes(md5)) {
              group.songs.push(md5)
            }
          }
        })

      return importResult
    }
  }

  async importFiles(groupId, files) {
    const result = await this.importDir(groupId,null,files)
    return result
  }
  async getSongsDataByMd5(md5 = []) {
    const songs = await this.localDB.table('songsData').where('md5').anyOf(md5).toArray()
    songs.forEach((i) => {
      if (i.data.cover && typeof i.data.cover !== 'string') {
        const blob = new Blob([i.data.cover], { type: 'image/jpeg' })
        i.data.cover = URL.createObjectURL(blob)
      }
    })
    return songs
  }
  /**
   * 
   * @param {Array} files 
   */
  async checkFileExists(songs){
    const map = new Map()
    for(let i of songs){
      map.set(i.path,i.md5)
    }
    const loss = await window.api.fileExists(songs.map(i=>i.path))
    if(!loss){return null}
    const lossMd5 = []
    for(let path of loss){
      lossMd5.push({
        path,
        md5:map.get(path)
      })
    }
    return lossMd5
  }
  async getAudioMd5(path) {
    return await window.api.getMd5(path)
  }
  async matchLocalSongOnNcm({ name, artist, album, duration, path, md5 }) {
    const match = await matchSongsOnNcm({
      title: name,
      album,
      artist,
      duration,
      md5
    })
    if (match?.result?.songs?.[0]) {
      return { ...match?.result?.songs?.[0], md5 }
    } else {
      return null
    }
  }

  async getLocalLyric(md5) {
    const lyric = await this.localDB.table('lyric').where('md5').equals(md5).first()
    if (lyric) {
      return lyric.lyric
    } else {
      return null
    }
  }

  async setLocalLyric(md5, lyric) {
    await this.localDB.table('lyric').put({
      md5,
      lyric,
      cachedAt: Date.now()
    })
  }

  pictureHandler(p) {
    if (!p) {
      return null
    } else {
      const blob = new Blob([p?.[0]?.data], { type: 'image/jpeg' })
      return URL.createObjectURL(blob)
    }
  }

  async setLocalLyricFromFile(md5,nlofile = null){
    const file = nlofile || (await window.api.dialogOpenFile())[0]
    if(file){
        const buffer = await window.api.readFileBuffer(file)
        if(buffer.exists){
            const bf = Buffer.from(buffer.buffer)
            try{
                const obj = JSON.parse(bf.toString())
                await this.setLocalLyric(md5,obj).then(()=>{
                  showMessageNotification("歌词已设置",1000)
                })
            }catch(e){}
        }
    }
  }
  /**
   * 
   * @param {Array<String>} files 
   * @returns {Promise<Array<object>> }
   */
  async getLocalMusicMatchedDetial(files){
     let meta = await window.api.audioMetaReader(files)
     meta = meta.filter((i) => i.success)
      let metaMd5Index = {}
      meta.forEach((i) => {
        metaMd5Index[i.hash] = i
      })

      const matchList = meta.map((i) => {
        return {
          title: i?.meta.title || '',
          artist: i?.meta?.artist || '',
          album: i?.meta?.album || '',
          duration: i?.meta?.duration || 0,
          persistId: i.hash
        }
      })

      const matches = await matchSongsOnNcm(matchList)
      let matchMd5Index = {}
      for (let i in matches?.result?.ids) {
        matchMd5Index[matches?.result?.ids[i]] = matches?.result?.songs[i]
      }
      let result = {}
      const matchedMd5 = Object.keys(matchMd5Index)
      for (let md5 of Object.keys(metaMd5Index)) {
        const path = metaMd5Index[md5].path
        const size = metaMd5Index[md5].size
        const time = metaMd5Index[md5].time
        if (matchedMd5.includes(md5)) {
          //成功匹配
          const matchedMeta = matchMd5Index[md5]
          const rawMata = metaMd5Index[md5]?.meta
          result[md5] = {
            name: matchedMeta?.name,
            artist: matchedMeta?.artists,
            album: { ...matchedMeta?.album, matched: true },
            path,
            id: matchedMeta?.id,
            md5,
            tns: matchedMeta?.tns || null,
            alias: matchedMeta?.alias || null,
            type: 'local',
            local: true,
            duration: rawMata?.duration,
            mv: matchedMeta?.mv,
            matched: true,
            file: path,
            size,
            time,
            cover: rawMata.picture ? rawMata.picture[0].data : matchedMeta?.album?.picUrl,
            codec:rawMata?.codec,
            bitrate: rawMata?.bitrate,
            lossless: rawMata?.lossless,
          }
        } else {
          //没有匹配
          const rawMata = metaMd5Index[md5]?.meta
          result[md5] = {
            name: rawMata?.title || path.split('\\').pop().split('.').slice(0, -1).join('.'),
            artist: rawMata?.artists
              ? rawMata?.artists.map((i) => {
                  return { name: i, matched: false, id: null }
                })
              : [{ name: '未知', matched: false, id: null }],
            album: { name: rawMata?.album, matched: false, id: null, picUrl: null },
            path,
            id: md5,
            md5,
            tns: null,
            alias: null,
            type: 'local',
            local: true,
            duration: rawMata?.duration,
            mv: null,
            matched: false,
            file: path,
            size,
            time,
            cover: rawMata.picture ? rawMata.picture[0].data : null,
            codec:rawMata?.codec,
            bitrate: rawMata?.bitrate,
            lossless: rawMata?.lossless,
          }
        }
      }
      return result
  }
}
