import { ref } from 'vue'
let currentMatching = ref('')
let total = ref(0)
let processed = ref(0)
async function searchNcmApi(qqSongTag) {
  total.value = qqSongTag.length
  processed.value = 0
  let matchedCount = 0
  let dismatchedCount = 0
  let matchResult = []
  for (let i of qqSongTag) {
    try {
      currentMatching.value = i.name
      let url = `http://localhost:11451/search?keywords=${encodeURI(i.name + i.singer[0]?.name)}&type=1&limit=3&timestamp=${Date.now()}`
      let data = await fetch(url)
      let searchResult = (await data.json())?.result.songs
      let ismatched
      for (const resSong of searchResult) {
        ismatched = matcher(resSong, {
          refname: i.orig || i.name,
          album: i.album,
          artist: i.singer
        })
        if (ismatched) {
          matchResult.push({
            QQ: i,
            Ncm: { id: resSong.id, name: resSong.name, artist: resSong.artist },
            match: true
          })
          matchedCount++
          break
        }
      }
      if (!ismatched) {
        matchResult.push({
          QQ: i,
          Ncm: {
            id: searchResult[0].id,
            name: searchResult[0].name,
            artist: searchResult[0].artist
          },
          match: false
        })
        dismatchedCount++
      }
      processed.value++
    } catch (error) {}
  }
  currentMatching.value = undefined
  return { matchResult, matchedCount, dismatchedCount }
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

export { currentMatching, total, processed, searchNcmApi }
