import request from "../utils/request";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

export async function getAlbum(alid) {
  const data = await request({
    url: `/album?id=${alid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getAlbumDynamic(alid) {
  const data = await request({
    url: `/album/detail/dynamic?id=${alid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}
