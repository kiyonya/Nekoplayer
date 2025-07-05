import request from '@/utils/request'
export function getRecommendProgram(page = 0, pageSize = 20) {
  const offset = page * pageSize
  return request({
    url: '/program/recommend',
    body: {
      limit: pageSize,
      offset
    }
  })
}
export async function getVoiceHomepage(blockCodeOrderList, refresh = true) {
  return request({
    url: `/voice/homepage/block/page?timestamp=${Date.now()}`
  })
}
export function getDjRadioDetail(rid) {
  return request({
    url: '/dj/detail?rid=' + rid
  })
}
export function getDjRadioProgram(rid, page = 0, pageSize = 20) {
  const offset = page * pageSize
  return request({
    url: `/dj/program?rid=${rid}&limit=${pageSize}&offset=${offset}`
  })
}
export function getProgramDetail(id) {
  return request({
    url: `/dj/program/detail?id=${id}`
  })
}
export function getVoiceList(id) {
  return request({
    url: `/voicelist/list?voiceListId=${id}`
  })
}
export async function getDjRadioAllVoiceId(id) {
  let page = 0
  let pageSize = 50
  let programs = []
  let data = await getDjRadioProgram(id, page, pageSize)
  programs.push(...data?.programs)
  if (!data.more) {
    return programs.map((i) =>{
      return {
        programId: i.id,
        songId: i?.mainSong?.id
      }
    })
  } else {
    let lastCount = data?.count - pageSize
    let pages = []
    let pageCount = Math.ceil(lastCount / pageSize)
    for (let i = 0; i < pageCount; i++) {
      pages.push(i + 1)
    }
    pages = pages.map((page) => getDjRadioProgram(id, page, pageSize))

    let last = await Promise.all(pages)

    last.forEach((i) => {
      programs.push(...i?.programs)
    })
    return programs.map((i) =>{
      return {
        programId: i.id,
        songId: i?.mainSong?.id
      }
    })
  }
}
