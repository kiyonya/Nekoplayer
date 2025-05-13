import temp from '../store/temp'
import { ref, watch } from 'vue'

const audio = temp.audio
const lyricStatus = temp.lyricStatus
const lyricArea = ref([])
let lyricIndex = ref(0)
watch(lyricStatus,()=>{
  lyricArea.value = []
  let area = ['tlyric','romalrc','lrc']
  for(let i of area){
    if(lyricStatus.value[i]){
      lyricArea.value.push(i)
    }
  }

  console.log(lyricArea.value[lyricIndex.value])
  if(!lyricArea.value[lyricIndex.value]){
    console.log("回正")
    
    lyricIndex.value = 0}
})

export function changeLyric(){
  
  if(lyricArea.value.length <= 1){return false}
  
  else{
    console.log("修改")
    if(lyricIndex.value + 1 < lyricArea.value.length ){
      lyricIndex.value += 1
    }
    else{
      lyricIndex.value = 0
    }
  }
  return lyricArea.value[lyricIndex]
}

const handleHighlight = (lyric,currentTime,f = 0) => {
  let index = undefined
  let i = 0
  for (let time of Object.keys(lyric.value)) {
    if (parseInt(time) + f >= currentTime) {
      index = i
      break
    }
    i++
  }
  if (!index) {
    index = 0
  }
  return index - 1 < 0 ? 0 : index -1
}
let lastIndex
const handleScroller = (ctn, lyric, ignore = false) => {
  if (ignore) {
    lastIndex = 0
  }
  if (!lyric || !ctn) {
    return
  }
  let index = handleHighlight(lyric,audio.currentTime)
  if (index == lastIndex && index !== 0) {
    return
  }
  lastIndex = index
  let children = ctn.children
  for (let i of children) {
    if (i.classList.contains('highlight')) {
      i.classList.remove('highlight')
    }
  }
  let focus = children[index]
  if (!focus) {
    return
  }
  focus.classList.add('highlight')

  let offset = focus.clientHeight / 2 + focus.offsetTop - ctn.clientHeight / 2

  ctn.scrollTo({ top: offset, behavior: 'smooth' })
}

export { handleScroller ,lyricArea,lyricIndex,handleHighlight}
