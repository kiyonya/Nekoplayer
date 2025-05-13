const fs = require('fs')
const path = require('path')
const jsmediatags = require('jsmediatags')
function readDirAudioFile(dirpath, filter = ['wav', 'mp3', 'ogg', 'flac']) {
  const exist = fs.existsSync(dirpath)
  if (!exist) {
    return '目录不存在'
  }
  const files = fs.readdirSync(dirpath)
  files.filter((i) => filter.includes(path.extname(i)))
  return files
}
async function getSongsMeta(files) {
  let result = []
  for(let file of files){
    jsmediatags.read(file,{
      onSuccess:(tag)=>{
        result.push(tag)
      }
    })
  }


  //   const file = {
  //     name: meta.common.title || path.basename(song).replace(path.extname(song), ''),
  //     artist: meta.common.artists || [],
  //     cover: meta.common.picture ? meta.common.picture[0] : null,
  //     bitrate: meta.format.bitrate,
  //     sampleRate: meta.format.sampleRate,
  //     album: meta.common.album || '',
  //     path: song,
  //     extname: path.extname(song)
  //   }
  //   return file
  // })
  // const result = await Promise.all(promises)
  return result
}
async function getSongBuffer(path) {
    const exist = fs.existsSync(path)
    if(exist){
        const buffer = fs.readFileSync(path)
        return buffer
    }else{
        return null
    }
    
}
export default {readDirAudioFile,getSongsMeta,getSongBuffer}