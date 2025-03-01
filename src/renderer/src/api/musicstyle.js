import request from "../utils/request";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

export async function initMusicstyle() {
  const musicStyleList = [];
  const data = await request({
    url: "/style/list",
  });
  for (const u of data.data) {
    musicStyleList.push({
      id: u.tagId,
      name: u.tagName,
      enName: u.enName,
      colorDeep: u.colorDeep,
      colorShallow: u.colorShallow,
    });
  }
  return musicStyleList;
}

export async function getPreference() {
  const data = await request({
    url: `/style/preference`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  const res = data.data.tagPreferenceVos;
  let tagPreferenceId = data.data.tagPreferenceVos.map((x) => {
    return x.tagId;
  });
  for (let tag of data.data.tags) {
    let index = tagPreferenceId.indexOf(tag.tagId);
    res[index].childrenTags = tag.childrenTags || null;
    res[index].colorShallow = tag.colorShallow;
  }
  console.log(res);
  return res;
}

export async function getStyleSongs(id, sort, cursor = 0) {
  const data = await request({
    url: `/style/song?tagId=${id}&sort=${sort || 0}&cursor=${cursor}&size=9`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getStyleDetial(id) {
  const data = await request({
    url: `/style/detail?tagId=${id}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getStylePlaylist(id,  cursor = 0) {
  const data = await request({
    url: `/style/playlist?tagId=${id}&cursor=${cursor}&size=12`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getStyleAlbum(id,cursor,sort = 0) {
  const data = await request({
    url: `/style/album?tagId=${id}&cursor=${cursor}&sort=${sort}&size=12`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getStyleArtist(id,cursor) {
  const data = await request({
    url: `/style/artist?tagId=${id}&cursor=${cursor}&size=6`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}