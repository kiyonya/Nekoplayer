import request from '@/utils/request'
export async function createRoom() {
  return request({
    url: '/listentogether/room/create',
    method: 'post'
  })
}
export async function acceptRoom(roomId, inviterId) {
  return request({
    url: `/listentogether/accept?roomId=${roomId}&inviterId=${inviterId}`,
    method:'post'
  })
}
export async function postPlaylist(roomId, userId, displayList, randomList, playmode,commandType = 'REPLACE',clientSeq) {
  return request({
    url: '/listentogether/sync/list/command',
    method: 'post',
    body: {
      roomId,
      commandType,
      userId,
      version: clientSeq || 1,
      playMode: playmode,
      displayList,
      randomList,
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

export async function getRoomStatus() {
  return request({
    url:'/listentogether/status?timestamp=' + Date.now()
  })
  
}
/**
 * 
 * @param {string} roomId 
 * @param {string | number} songId 
 * @param {'PLAY' | 'PAUSE' | 'SEEK'} playStatus 
 * @param {number} progress 
 * @return {object | number}
 */
export async function postPlayCommand(roomId,playStatus,progress,commandType,formerSongId,targetSongId,clientSeq) {
  return request({
    url:'/listentogether/play/command',
    method:'post',
    body:{
      roomId,
      playStatus,
      progress,
      commandType,
      formerSongId,
      targetSongId,
      clientSeq,
    }
  })
}
export async function endRoom(roomId) {
  return request({
    url: `/listentogether/end?roomId=${roomId}`
  })
} 

export async function postRoomHeartbeat(roomId,songId,playStatus,progress) {
  return request({
    //拼写错误
    url:`/listentogether/heatbeat`,
    method:'post',
    body:{
      roomId,songId,playStatus,progress
    }
  })
}