import request from "../utils/request";
import { getSongDetial } from "./song";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;
export async function getArtistDetial(arid) {
  const data = await request({
    url: `/artist/detail?id=${arid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getArtistBriefAndSongs(arid) {
  const data = await request({
    url: `/artists?id=${arid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getArtistAlbums(arid,page = 1,limit=30) {
  let offset = (page - 1) * limit || 0
  const data = await request({
    url: `/artist/album?id=${arid}&limit=${limit}&offset=${offset}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getSongDetial_Array(array) {
  const data = await request({
    url: `/song/detail?ids=${array.join(',')}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getMvs(arid,page = 1,limit=30) {
  let offset = (page - 1) * limit || 0
  const data = await request({
    url: `/artist/mv?id=${arid}&limit=${limit}&offset=${offset}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getMvPreview(mvid,r=240) {
  const data = await request({
    url: `/mv/url?id=${mvid}&r=${r}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getSimiArtist(arid) {
  const data = await request({
    url: `/simi/artist?id=${arid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getDesc(arid) {
  const data = await request({
    url: `/artist/desc?id=${arid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getArtistSongs(id) {
  return new Promise(async (resolve ,reject)=>{
    request({
      url:`/artists?id=${id}`
    }).then(data=>{
      const ids = data?.hotSongs?.map(i=>i.id)
      getSongDetial(ids).then(data=>{
        resolve(data?.songs || [])
      })
    }).catch(err=>reject(err))
  })
}