import { createRoom, acceptRoom, checkRoom, getHostPlaylist } from '@/api/lt'
import { play } from '@/audioplay/player'

export class ListenTogether {
  constructor() {
    this.roomId
    this.inviterId
    this.roomInfo
  }
  async create() {
    const res = await createRoom()
    if (res?.code === 200) {
      this.roomId = res.data.roomInfo.roomId
      this.inviterId = res.data.roomInfo.creatorId
      this.roomInfo = res.data.roomInfo
      return this.roomInfo
    } else {
      return '创建失败'
    }
  }
  async join(roomId, inviterId) {
    if (this.roomId) {
      return '已经在一个房间内'
    }
    const res = await acceptRoom(roomId, inviterId)
    
    if (res?.code !== 200) {
      return
    }
    const check = await checkRoom(roomId)
    if (check?.code !== 200) {
      return
    }
    this.roomId = roomId
    this.inviterId = inviterId
    const playlist = await getHostPlaylist(roomId)
    console.log(playlist)
  }
}


const LT = new ListenTogether()
export {LT}