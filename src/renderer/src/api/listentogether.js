import request from "../utils/request";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;
/**
 * 创建房间
 * @returns 
 */
export async function createRoom() {
  const data = await request({
    url: `/listentogether/room/create`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}
/**
 * 检查房间状态
 * @param {*} roomId 
 * @returns 
 */
export async function checkRoom(roomId) {
    const data = await request({
        url: `listentogether/room/check?roomId=${roomId}`,
        method: "post",
        body: {
          cookie: cookie,
        },
      });
      return data;
}