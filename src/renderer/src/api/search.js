import request from "../utils/request";
export function search(typeid,key,limit = 30,page = 1) {
    let offset = (page - 1) * limit
    return request({
      url: `/search?keywords=${key}&type=${typeid}&limit=${limit}&offset=${offset}`,
      method: "post",
    });
  }
export function searchRecommend(keywords,type = "") {
  return request({
    url: `/search/suggest?keywords=${keywords}&type=${type}`,
    method: "post",
  });
}

export function getHots() {
  return request({
    url: `/search/hot/detail`,
    method: "post",
  });
}
