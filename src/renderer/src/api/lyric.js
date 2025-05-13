import request from '@/utils/request'
export async function getLyricText(id) {
  return request({
    url: `/lyric?id=${id}`
  })
}
export async function getLyric(id) {
  const data = await getLyricText(id)
  let types = ['lrc', 'tlyric', 'romalrc']
  let lyric = {}
  for (let type of types) {
    if (data[type]?.lyric) {
      lyric[type] = resolver(data[type]?.lyric)
    }
  }
  const combinatedLyric = combinate(lyric)
  const result = findGap(combinatedLyric)
  return result
}
function resolver(lrcTypeString) {
  let lyric = []
  lrcTypeString = lrcTypeString.split('\n')
  lrcTypeString.forEach((lrc) => {
    const match = lrc.match(/\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/)
    if (match) {
      handleLyric(match)
    }
    else {
      const match = lrc.match(/\[(\d{2}):(\d{2}):(\d{2})\](.*)$/)
      if(match){
        handleLyric(match)
      }
    }
    
  })

  function handleLyric(match){
    const [full, minute, second, milisecond, text] = match
      const id = [minute, second, milisecond].join('-')
      const regex = /^([（(].*[）)])$/
      if (regex.test(text)) {
        lyric.push({ id, minute, second, milisecond, text:text.slice(1, -1), subLyric: true })
      } else {
        lyric.push({ id, minute, second, milisecond, text })
      }
  }

  return lyric
}
function combinate(lrcGroup) {
  const { lrc, tlyric = null, romalrc = null } = lrcGroup
  const lyric = {}
  lrc.forEach((i) => (lyric[i?.id] = i))
  tlyric &&
    tlyric.forEach((i) => {
      if (lyric[i?.id]) {
        lyric[i?.id].tlyric = i?.text
      }
    })
  romalrc &&
    romalrc.forEach((i) => {
      if (lyric[i?.id]) {
        lyric[i?.id].romalrc = i?.text
      }
    })
  let result = []
  for (let id in lyric) {
    const lrc = lyric[id]
    lrc.timestamp = +(+lrc?.minute * 60 + +lrc?.second + +lrc?.milisecond / 1000).toFixed(5)
    result.push(lrc)
  }
  return result
}
function findGap(lyric) {
  for (let i = 0; i < lyric.length; i++) {
    let current = lyric[i]
    let next = lyric[i + 1]
    if (next && !current.text) {
      if (next.timestamp - current.timestamp > 8) {
        lyric[i] = {
          text: '',
          gap: true,
          timestamp: current.timestamp,
          delay: next.timestamp - current.timestamp,
          next: next.timestamp
        }
      } else {
        lyric.splice(i, 1)
      }
    }
  }
  return lyric
  // const gap = lyric.reduce((result, current, index, array) => {
  //     if (index < array.length - 1) {
  //         const next = array[index + 1];

  //         if (next.timestamp - current.timestamp > 15) {
  //             console.log(next.timestamp , current.timestamp)
  //             result.push({index,next,current});
  //         }
  //     }
  //     return result;
  // }, []);
  // for(let g of gap){
  //     let timestamp = g?.next.timestamp - 5
  //     if(g.index + 1 < lyric.length - 1){
  //         lyric.splice(g.index + 1,0,{text:'',gap:true,timestamp,duration:5})
  //     }
  // }
  // return lyric
}
export function computedHighlight(lyric, time) {
  let highlightSentence = lyric
    .filter((item) => item.timestamp < time)
    .reduce(
      (prev, curr) => {
        return prev.timestamp > curr.timestamp ? prev : curr
      },
      { beforeLoad:true }
    )
  let index = lyric.findIndex((i) => i.timestamp === highlightSentence.timestamp)
  return { index, highlightSentence }
}
