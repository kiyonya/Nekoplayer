import temp from '../store/temp'
import request from './request'
const cookie = localStorage.getItem('neko_user_cookie') || undefined

import { ref } from 'vue'
const lyricInfo = ref({
  lyricUser: {},
  transUser: {}
})
export { lyricInfo }
export async function getLrc(id) {
  const data = await request({
    url: `/lyric?id=${id}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

async function getTextLrc(id) {
  const data = await request({
    url: `/lyric/new?id=${id}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  console.log(data)
  return data
}

export async function nekoLyricObjectGenerator(id) {
  const data = await getLrc(id)
  console.log(data)
  getLyricStatus(data)
  let timeline = {}
  if (data.pureMusic) {
    return { 1: { lrc: '纯音乐，请欣赏' } }
  }
  if (data.sgc) {
    return {
      0: {
        lrc: data.lrc.lyric
          .split('\n')
          .filter((s) => {
            return s && s.trim()
          })
          .join('')
      }
    }
  }
  for (let type of ['lrc', 'tlyric', 'romalrc', 'klyric']) {
    if (data[type] && data[type].lyric) {
      await parseTimeline(timeline, type, data[type].lyric)
    }
  }
  return timeline
}
async function parseTimeline(timeline, type, data) {
  for (const lyric of data.split('\n')) {
    const lyricSplitedArray = lyric.split(']')
    const time = intTime(lyricSplitedArray[0].slice(1))
    const text = lyricSplitedArray[1]
    if (text) {
      timeline[time]
        ? (timeline[time][type] = text.trim())
        : (timeline[time] = { [type]: text.trim() })
    }
  }
  return timeline
}
function intTime(time) {
  if (!time) {
    return
  }
  return +time.split(':')[0] * 60 + +time.split(':')[1].split('.')[0]
}

export function getLyricStatus(lyric) {
  const lyricType = ['lrc', 'tlyric', 'romalrc', 'klyric']
  const res = {}
  for (let key of lyricType) {
    res[key] = false
    if (lyric.pureMusic) {
      res.lrc = true
      break
    }
    if (lyric[key]?.lyric) {
      res[key] = true
    }
  }
  temp.lyricStatus.value = res
  return res
}

export function parseLrc(data) {
  function _parseTime(a) {
    for (let i = 0; i < a.length; i++) {
      a[i].time = parseInt(a[i].time.split(':')[0]) * 60 + Math.floor(a[i].time.split(':')[1])
    }
    return a
  }
  if (data.pureMusic) {
    return _parseTime(_devLrc(data.lrc))
  }
  function _devLrc(index) {
    if (!index.lyric) return false
    let text = index.lyric
    let res = []
    let lrc = text.split('\n')
    for (let i of lrc) {
      let iA = i.split(']')
      if (iA[1]) {
        res.push({ time: iA[0].substring(1), text1: iA[1].trim() })
      }
    }
    return res
  }
  let arr = []
  let lyric = _devLrc(data.lrc)
  let tnsLyric = _devLrc(data.tlyric)
  let roma = _devLrc(data.romalrc)
  if (lyric) {
    arr.push(lyric)
  }
  if (tnsLyric) {
    arr.push(tnsLyric)
  }
  if (roma) {
    arr.push(roma)
  }
  function _mix(arrays) {
    const result = {}
    arrays[0].forEach((item) => {
      const time = item.time
      result[time] = { time, text1: item.text1 }
      for (let i = 1; i < arrays.length; i++) {
        const otherArray = arrays[i]
        const match = otherArray.find((otherItem) => otherItem.time === time)
        if (match) {
          result[time][`text${i + 1}`] = match.text1
        }
      }
    })
    return Object.values(result)
  }
  console.log(_parseTime(_mix(arr)))
  return _parseTime(_mix(arr))
}

const kanaDict = {
  a: 'あ',
  i: 'い',
  u: 'う',
  e: 'え',
  o: 'お',
  ka: 'か',
  ki: 'き',
  ku: 'く',
  ke: 'け',
  ko: 'こ',
  sa: 'さ',
  shi: 'し',
  su: 'す',
  se: 'せ',
  so: 'そ',
  ta: 'た',
  chi: 'ち',
  tsu: 'つ',
  te: 'て',
  to: 'と',
  na: 'な',
  ni: 'に',
  nu: 'ぬ',
  ne: 'ね',
  no: 'の',
  ha: 'は',
  hi: 'ひ',
  fu: 'ふ',
  he: 'へ',
  ho: 'ほ',
  ma: 'ま',
  mi: 'み',
  mu: 'む',
  me: 'め',
  mo: 'も',
  ya: 'や',
  yu: 'ゆ',
  yo: 'よ',
  ra: 'ら',
  ri: 'り',
  ru: 'る',
  re: 'れ',
  ro: 'ろ',
  wa: 'わ',
  wo: 'を',
  n: 'ん',
  ga: 'が',
  gi: 'ぎ',
  gu: 'ぐ',
  ge: 'げ',
  go: 'ご',
  za: 'ざ',
  ji: 'じ',
  zu: 'ず',
  ze: 'ぜ',
  zo: 'ぞ',
  da: 'だ',
  di: 'ぢ',
  du: 'づ',
  de: 'で',
  do: 'ど',
  ba: 'ば',
  bi: 'び',
  bu: 'ぶ',
  be: 'べ',
  bo: 'ぼ',
  pa: 'ぱ',
  pi: 'ぴ',
  pu: 'ぷ',
  pe: 'ぺ',
  po: 'ぽ',
  kya: 'きゃ',
  kyu: 'きゅ',
  kyo: 'きょ',
  gya: 'ぎゃ',
  gyu: 'ぎゅ',
  gyo: 'ぎょ',
  sha: 'しゃ',
  shu: 'しゅ',
  sho: 'しょ',
  ja: 'じゃ',
  ju: 'じゅ',
  jo: 'じょ',
  cha: 'ちゃ',
  chu: 'ちゅ',
  cho: 'ちょ',
  tsa: 'つゃ',
  tsu: 'つゅ',
  tso: 'つょ',
  nya: 'にゃ',
  nyu: 'にゅ',
  nyo: 'にょ',
  hya: 'ひゃ',
  hyu: 'ひゅ',
  hyo: 'ひょ',
  bya: 'びゃ',
  byu: 'びゅ',
  byo: 'びょ',
  pya: 'ぴゃ',
  pyu: 'ぴゅ',
  pyo: 'ぴょ',
  tte: 'って',
  tta: 'った'
}
/**
 *
 * @param {String} str
 */
export function kana(str) {
  if (!str) {
    return ''
  }
  const list = str.split(' ')
  const result = []
  for (let kana of list) {
    result.push(kanaDict[kana.toLowerCase()] || kana)
  }
  return result.join('')
}
