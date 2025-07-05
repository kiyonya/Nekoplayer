import request from "../utils/request";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

export async function getTopPlaylist(cat, limit = 20, page, order = "hot") {
  let offset = (page - 1) * limit || 0;
  const data = await request({
    url: `/top/playlist?cat=${encodeURI(
      cat
    )}&limit=${limit}&offset=${offset}&order=${order}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getHQPlaylist(cat = "", limit = 20, before) {
  const data = await request({
    url: `/top/playlist/highquality?before=${before}&limit=${limit}&cat=${cat}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}



export async function getToplist() {
  const data = await request({
    url: `/toplist`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}