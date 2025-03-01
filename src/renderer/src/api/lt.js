import request from '@/utils/request'
export async function createRoom() {
  return request({
    url: '/listentogether/room/create',
    method: 'get'
  })
}
export async function acceptRoom(roomId, inviterId) {
  return request({
    url: `/listentogether/accept?roomId=${roomId}&inviterId=${inviterId}`
  })
}
export async function setHostPlaylist(roomId, userId, displayList, randomList, playmode) {
  return request({
    url: '/listentogether/sync/list/command',
    method: 'post',
    data: {
      roomId,
      commandType: 'REPLACE',
      userId,
      version: 1,
      playMode: playmode,
      displayList,
      randomList
    }
  })
}
export async function getHostPlaylist(roomId) {
  return request({
    url: `/listentogether/sync/playlist/get?roomId=${roomId}`
  })
}

export async function checkRoom(roomId) {
    return request({
        url: `/listentogether/room/check?roomId=${roomId}`
      })
}