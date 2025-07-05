import { ref } from 'vue'
import request from '../utils/request'
import { getSongDetial } from './song'
import { sessionCache, sessionGet } from '@/lib/cache/session_cache'
const cookie = localStorage.getItem('neko_user_cookie') || undefined
export function getPlaylistDetial(pid) {
  return request({
    url: `/playlist/detail?id=${pid}`,
  })
}

export async function getPlaylistMusic(pid, count, page) {
  const limit = 15
  const maxPage = Math.ceil(count / limit)
  if (page <= 0) {
    page = 0
  }
  if (page >= maxPage) {
    page = maxPage
  }
  const offset = limit * (page - 1)
  const data = await request({
    url: `/playlist/track/all?id=${pid}&limit=${1000}&offset=${0}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function getPlaylistSongs(id, limit, offset) {
  const data = await request({
    url: `/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function getPlaylistTracks(id,ids = null,cache=false) {
  const namespace = `playlist_tracks_${id}`
  try {
    if(cache){
      console.log("缓存的")
      let cachePlaylistTracks = sessionGet(namespace)
      if(cachePlaylistTracks){return cachePlaylistTracks}
      cachePlaylistTracks = null
    }
    const trackIds = ids || (await getPlaylistDetial(id))?.playlist?.trackIds;
    const dvChunks = chunkArray(trackIds, 100);
    const promises = dvChunks.map((chunk) => {
      const ids = chunk.map((i) => i.id);
      return getSongDetial(ids).then((data) => data?.songs || [])
    });
    const results = await Promise.all(promises);
    const tracks = results.flat();
    if(cache){
      sessionCache(namespace,tracks)
    }
    return tracks;
  } catch (error) {
    console.error('Failed to get playlist tracks:', error);
    throw error; 
  }
}
function chunkArray(array, chunkSize) {
  if (!Array.isArray(array) || !Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error(
      'Invalid input: array must be an array and chunkSize must be a positive integer'
    )
  }
  const result = []
  const length = array.length
  for (let i = 0; i < length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize)
    result.push(chunk)
  }
  return result
}
window.gpd = getPlaylistTracks

export async function getRelatedPlaylist(pid) {
  const data = await request({
    url: `/related/playlist?id=${pid}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export function getPlaylistSquare(cursor = ""){
  return request({
    url:"/playlist/square/block?timestamp=" + Date.now(),
    body:{
      cursor
    }
  })
}

export async function getPlaylistCatlist() {
  const data = await request({
    url: `/playlist/catlist`,
  });
  let cats = {}
  for(let key in data.categories){
    cats[key] = {
        cat:data.categories[key],
        sub:[]
    }
  }
  for(let sub of data.sub){
    cats[sub.category].sub.push(sub)
  }
  let res = []
  for(let key in cats){
    res.push({
      cat:cats[key]?.cat,
      sub:cats[key]?.sub
    })
  }
  return res;
}

export function getCatPlaylist(cat,page = 0,pageSize = 20){
  let offset = page * pageSize
  return request({
    url:"/playlist/category/list?timestamp=" + Date.now(),
    body:{
      cat,
      limit:pageSize,
      offset:offset
    }
  })
}

export function getPersonalizedPlaylistTag(){
  return request({
    url:"/personalized/playlist/tag"
  })
}