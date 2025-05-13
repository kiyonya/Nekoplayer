import { search} from 'NeteaseCloudMusicApi'

const jsdom = require('jsdom')
const axios = require('axios')
const os = require('os')
const { JSDOM } = jsdom

function _getBillboardPage(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0',
          'Content-Type': 'text/html; charset=UTF-8',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
        },
        timeout: 20000
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject()
        }
      })
  })
}
function _setParams(base, params) {
  let i = 0
  for (let key in params) {
    if (!params[key]) {
      continue
    }
    if (i === 0) {
      base += `?${key}=${params[key]}`
    } else {
      base += `&${key}=${params[key]}`
    }
    i++
  }
  return base
}
async function _matchNCM(info) {
  let match = (
    await search({
      keywords: info.name + ' ' + info.artist,
      type: 1,
      limit: 3
    })
  ).body?.result?.songs
  return {
    ...info,
    match
  }
}
export async function getBillboardVOCALOIDSongs(
  year = null,
  month = null,
  day = null,
  imgresolution = 500
) {
  _matchNCM()
  const pageURL = _setParams(' https://billboard-japan.com/charts/detail', {
    a: 'niconico',
    year,
    month,
    day
  })
  const origin = new URL(pageURL).origin
  const data = await _getBillboardPage(pageURL)
  const dom = new JSDOM(data.toString())
  const ranks = dom.window.document.querySelector('tbody').querySelectorAll('tr')
  let billrank = []
  for (let r of ranks) {
    const rank = r.querySelector('.rank').innerHTML
    const last = r.querySelector('.last').innerHTML.replace("前回：","")
    const name = r.querySelector('a').innerHTML.trim()
    const url = r.querySelector('a').href
    let artistString = r.querySelector('.artist_name').innerHTML
    let artist
    if (artistString.startsWith('<a')) {
      artist = artistString.match(/<a[^>]*>([^<]+)<\/a>/)[1]
    } else {
      artist = artistString
    }
    const cover = (origin + r.querySelector('img').src).replace(
      /\/(\d+x)(?=_image)/,
      `/${imgresolution}x`
    )
    const chartsIn = r.querySelector('.charts_in').innerHTML
    const rankChange = last ? rank - last : null
    const rankChangeType = rankChange ? (rankChange > 0 ? 'increase' : 'decrease') : null
    
    billrank.push({ name, artist, cover, url, rank, last, chartsIn,rankChangeType,rankChange })
  }
  billrank = Promise.all(billrank.map((i) => _matchNCM(i)))
  return billrank
}
