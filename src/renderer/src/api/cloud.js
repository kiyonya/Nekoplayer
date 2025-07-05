import request from "../utils/request";

export function getCloud(page = 0,limit = 30){
  let offset = page * limit
  return request({
    url:`/user/cloud?offset=${offset}&limit=${limit}`
  })
}
