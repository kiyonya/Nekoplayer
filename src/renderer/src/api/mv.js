import request from "../utils/request";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

export async function getMvUrl(id, r = 1080) {
  const data = await request({
    url: `/mv/url?id=${id}&r=${r}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getMvDetial(id) {
  const data = await request({
    url: `/mv/detail?mvid=${id}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}
