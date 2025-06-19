import request from '../utils/request'
const cookie = localStorage.getItem('neko_user_cookie') || undefined

export async function getUserPlaylist(uid) {
  const data = await request({
    url: `/user/playlist?uid=${uid}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  const playlist = {
    create: [],
    collect: []
  }
  for (let p of data.playlist) {
    if (p?.creator?.userId == uid) {
      playlist.create.push(p)
    } else {
      playlist.collect.push(p)
    }
  }
  return playlist
}

export async function getUserCollectedAlbums() {
  const data = await request({
    url: `/album/sublist`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function getUserCollectedMV() {
  const data = await request({
    url: `/mv/sublist`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function getUserRecentListen(uid, type = 1) {
  const data = await request({
    url: `/user/record?uid=${uid}&type=${type}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}
///likelist?uid=32953014

export async function getUserLikes(uid) {
  const data = await request({
    url: `/likelist?uid=${uid}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}
//
export async function getUserRecentListenList() {
  const data = await request({
    url: `/recent/listen/list`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}
///record/recent/song?limit=1
export async function getUserRecentPlaySongs(limit = 100) {
  const data = await request({
    url: `/record/recent/song?limit=${limit}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}



export async function getUserEvent(uid, limit = 30, lasttime = -1) {
  return request({
    url: `/user/event?uid=${uid}&limit=${limit}&lasttime=${lasttime}`
  })
}

export async function isMutualfollow(uid) {
  return request({
    url: `/user/mutualfollow/get?uid=${uid}`
  })
}

export async function getUserMedal(uid) {
  return request({
    url: `/user/medal?uid=${uid}`
  })
}

export async function getUserSocialStatus(uid) {
  return request({
    url: `/user/social/status?uid=${uid}`
  })
}

export async function getUserSocialStatusSupportList() {
  return request({
    url: '/user/social/status/support'
  })
}
export async function getUserDetial(uid) {
  return request({
    url:`/user/detail?uid=${uid}`
  })
}