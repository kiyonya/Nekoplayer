
const headers = {
  Referer: 'https://y.qq.com/portal/player.html',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
}
async function getQQPlaylist(id) {
  const url = `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=${id}&format=jsonp&g_tk=5381&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0`
  const res = await fetch(url, {
    method: 'get',
    headers: headers
  })
  let data = await res.text()
  data = data.substring(13, data.length - 1)
  const jsonResponse = JSON.parse(data)
  return jsonResponse
}
async function datahandler(data) {
  console.log(data)
  const playlist = data.cdlist[0].songlist
  console.log(playlist)
  const res = []
  for (let song of playlist) {
    res.push({
      name: song.songname,
      orig: song.songorig,
      singer: song.singer,
      album: song.albumname,
      data:song
    })
  }
  console.log(res)
  return res
}

async function serchNcmApi(proc) {
  let matchedCount = 0
  let dismatchedCount = 0

  let matchResult = []
  for (let i of proc) {
    console.log('==================')
    console.log('尝试搜索', i.name)
    let url = `http://localhost:11451/search?keywords=${encodeURI(i.name + i.singer[0]?.name)}&type=1&limit=3&timestamp=${Date.now()}`
    let data = await fetch(url)
    let searchResult = (await data.json())?.result.songs

    let ismatched
    for (const resSong of searchResult) {
      ismatched = matcher(resSong, { refname: i.orig || i.name, album: i.album, artist: i.singer })
      if (ismatched) {
        matchResult.push({
          QQ: i,
          Ncm: resSong,
          msg: '已匹配',
          match: true
        })
        matchedCount++
        break
      }
    }
    if (!ismatched) {
      matchResult.push({
        QQ: i,
        Ncm: searchResult[0],
        msg: '未匹配,找到最相近的',
        match: false
      })
      dismatchedCount++
    }
    console.log('==================')
    console.log('匹配结果：', ismatched)
  }
  console.log(matchResult)
  console.log(`匹配到了${matchedCount}首，未匹配${dismatchedCount}首`)
  return matchResult
}

function matcher(data, { refname, album, artist }) {
  //先匹配歌名
  const isNameMatch =
    data.name == refname || data.name.includes(refname) || refname.includes(data.name)
  const isAlbumMatch =
    data.album.name == album || data.album.name.includes(album) || album.includes(data.album.name)
  const artistNameGroup = data.artists.map((ar) => {
    return ar.name
  })

  let isArtistMatch = false
  ar: for (let i of artist) {
    let name = i.name
    for (let ncmArtistName of artistNameGroup) {
      if (ncmArtistName == name || ncmArtistName.includes(name) || name.includes(ncmArtistName)) {
        isArtistMatch = true
        break ar
      }
    }
  }

  return isNameMatch && isArtistMatch
}

export async function main() {
  let id = 1431344459
  let data = await getQQPlaylist(id)
  let proc = await datahandler(data)
  let matchResult = await serchNcmApi(proc)
  console.log(matchResult)
}

