//import request from '@/utils/request'
import request from '../utils/request'
const cookie = localStorage.getItem('neko_user_cookie') || undefined
export async function newPlaylist(name, type = 'NORMAL', pravicy = 0) {
  const data = await request(
    {
      path: '/playlist/create',
      params: {
        name: name,
        type: type,
        pravicy: pravicy
      }
    },
    { useTimestamp: false }
  )
  console.log(data)
}

export async function newPlaylist_old(name, type, pravicy) {
  const data = await request({
    url: `/playlist/create?name=Hello`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  console.log(data)
}

export async function matchSong({title,album,artist,duration,md5}) {
  const data = await request({
    url: `/search/match?title=${title}&album=${album}&artist=${artist}&duration=${duration}&md5=${md5}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function importPlaylist({mode,enc,name,fav}) {
  const data = await request({
    url: `/playlist/import/name/task/create?${mode}=${enc}&playlistName=${name}&importStarPlaylist=${fav}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function checkImportTask(taskid) {
  const data = await request({
    url: `/playlist/import/task/status?id=${taskid}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}