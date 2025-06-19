import { computed } from "vue";
import request from "../utils/request";
import { store } from "@/store";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;
const useCookies = computed(()=>{
  return store.state.config.useCookiesForPersonalRecommend
})
console.log(useCookies)
const radio = [
  3136952023, 5320167908, 5300458264, 5362359247, 5327906368, 5341776086,
];
export async function getSimiSong(id) {
  const data = await request({
    url: `/simi/song?id=${id}`,
    method: "post",
    nocookie:!useCookies.value
  });
  return data;
}
export async function getDailySong() {
  const data = await request({
    url: `/recommend/songs`,
    method: "post",
    nocookie:!useCookies.value
  });
  return data;
}
export async function getRecentLike() {
  const data = await request({
    url: `/recent/listen/list`,
    method: "post",
  });
  return data;
}
export async function getRadio() {
  let res = [];
  for (let id of radio) {
    const data = await request({
      url: `/playlist/detail?id=${id}`,
      method: "post",
      nocookie:!useCookies.value
    });
    data.playlist.tracks = data.playlist.tracks.splice(0, 3);
    res.push(data.playlist);
  }
  return res;
}
export async function getRecommendPlaylist() {
  
  const data = await request({
    url: `/personalized?limit=25`,
    method: "post",
    nocookie:!useCookies.value
  });
  
  return data;
  
}

export async function getNewAlbum(area) {
  const data = await request({
    url: `/album/new?limit=12&area=${area.toUpperCase()}`,
    method: "post",
    nocookie:!useCookies.value
  });
  return data;
}

export async function personalFM(mode = "DEFAULT",submode = "") {
  const data = await request({
    url: `/personal/fm/mode?mode=${mode}&submode=${submode}&timestamp=${Date.now()}`,
    method: "post",
  });
  return data
}

export async function getToplistDetial() {
  const data = await request({
    url: `/toplist/detail`,
    method: "post",
    nocookie:!useCookies.value
  });
  return data;
}
///starpick/comments/summary
export async function getStarpickComments() {
  const data = await request({
    url: `/starpick/comments/summary`,
    method: "post",
    nocookie:!useCookies.value
  });
  return data;
}

export async function getDragonBall() {
  return request({
    url:'/homepage/dragon/ball'
  })
}

/**
 * 
 * @param {"HOMEPAGE_BLOCK_STYLE_RCMD" | "HOMEPAGE_BLOCK_RED_SIMILAR_SONG" | "HOMEPAGE_MUSIC_PODCAST_RCMD_BLOCK" | "HOMEPAGE_BLOCK_OLD_SUBSCRIBE_ARTIST_NEW"  | Array} blockCodeOrderList
 * @param {number<int>} offset 
 * @param {boolean<false>} refresh 
 * @returns 
 */
export async function getHomepageBlock(blockCodeOrderList,offset = 0,refresh = true) {
  const cursor = {
    blockCodeOrderList:Array.isArray(blockCodeOrderList) ? blockCodeOrderList : [blockCodeOrderList]
  }
  return request({
    url:`/homepage/block/page?timestamp=${Date.now()}`,
    nocookie:!useCookies.value,
    body:{
      cursor:blockCodeOrderList ? JSON.stringify(cursor) : '',
      refresh
    }
    
  })
}


export async function getUserStylePreference() {
  return request({
    url:'/style/preference'
    
  })
}
/**
 * 
 * @param {number} limit 
 * @param {number} before 
 * @returns 
 */
export function getUserSubArtistsNewAlbum(limit = 1,before = ""){
  return request({
    url:"/artist/new/song",
    body:{
      limit,before
    }
  })
}