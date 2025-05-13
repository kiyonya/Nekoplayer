import request from "../utils/request";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

export async function search(typeid,key,limit = 30,page = 1) {
    let offset = (page - 1) * limit
    const data = await request({
      url: `/search?keywords=${key}&type=${typeid}&limit=${limit}&offset=${offset}`,
      method: "post",
      body: {
        cookie: cookie,
      },
    });
    return data;
  }

export async function searchRecommend(keywords,type = "") {
  const data = await request({
    url: `/search/suggest?keywords=${keywords}&type=${type}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getHots() {
  const data = await request({
    url: `/search/hot/detail`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}
