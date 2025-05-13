import request from '../utils/request'
const cookie = localStorage.getItem('neko_user_cookie') || undefined
export async function getSongDetial(id) {
  const data = await request({
    url: `/song/detail?ids=${id}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function getSongUrl(id, quality) {
  const data = await request({
    url: `/song/url/v1?id=${id}&level=${quality}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data.data[0]
}

export async function checkMusicStatus(id) {
  const data = await request({
    url: `/check/music?id=${id}`
  })
  if (data.success) {
    return true
  }
  return false
}

export async function getSongChorus(id) {
  const data = await request({
    url: `/song/chorus?id=${id}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data.chorus[0]
}

export async function scrobble(id,sourceId,time) {
  const data = await request({
    url: `/scrobble?id=${id}&sourceid=${sourceId}&time=${time}&timestamp=${Date.now()}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function getDynamicCover(id) {
  const data = await request({
    url: `/song/dynamic/cover?id=${id}`,
    method: 'post',
  })
  return data
}


export async function matchSongsOnNcm(songs) {
  return request({
    url:"/search/match",
    body:{
      songs
    },
  })
}