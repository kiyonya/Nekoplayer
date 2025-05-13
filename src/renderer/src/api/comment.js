import request from "@/utils/request"
/**
 * 
 * @param {number} id 
 * @param {number} type 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台节目 5: 视频 6: 动态 7: 电台 
 * @param {number} pageNo 1
 * @param {number} pageSize 20
 * @param {number} sortType 1
 * @param {number} cursor 
 */
export async function getComment(id,type = 0,pageNo = 1,pageSize = 20,sortType = 1,cursor) {
    const body = {id,type,pageNo,pageSize,sortType,cursor}
    return request({
        url:"/comment/new",
        body:body,
    })
}
/**
 * 
 * @param {number} id 
 * @param {number} type 
 * @param {number} parentCommentId 
 * @param {number} limit 
 * @param {number} time 
 * @returns 
 */
export async function getFloorComment(id,type = 0,parentCommentId,limit = 20,time) {
    return request({
        url:"/comment/floor",
        body:{
            id,type,parentCommentId,limit,time
        }
    })
}