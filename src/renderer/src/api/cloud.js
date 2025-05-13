import request from "../utils/request";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

export async function userCloud(page = 1, limit = 30) {
  let offset = (page - 1) * limit || 0;
  const data = await request({
    url: `/user/cloud?limit=${limit}&offset=${offset}&timestamp=${Date.now()}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function cloudFileDetial(cfid) {
  const data = await request({
    url: `/user/cloud/detail?id=${cfid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

