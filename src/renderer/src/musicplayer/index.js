import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import temp from '../store/temp'
import { handleScroller } from './lyric'
import { store } from '../store'
import { getColor } from '../components/musicplayer/color'
import { destoryDynamic, initDynamic } from './dynamic'
import { getSongChorus } from '../api/song'
const audio = temp.audio
const musicId = computed({
  get: () => store.state.musicInfo.id
})
const musicInfo = computed({
  get: () => store.state.musicInfo
})
let colorGroup = ref({
  mainColor: [0, 0, 0]
})
let chrous = ref([])
export { colorGroup,chrous }
export function useMusicPlayer({ lyricContainer, lyric, cover, dynamic }) {
  const useLyric = () => {
    handleScroller(lyricContainer.value, lyric)
  }
  const handleColor = async (event) => {
    
    let img = event.target
    colorGroup.value = await getColor(img)
  }

  onMounted(() => {
    audio.addEventListener('timeupdate', useLyric)
    handleScroller(lyricContainer.value, lyric, true)
    watch(musicId, async () => {
      lyricContainer.value.scrollTop = 0
      cover.value.classList.add('change-disc')
      setTimeout(() => {
        cover.value.classList.remove('change-disc')
      }, 200)
      chrous.value = []
      let mid = musicInfo.value.local ? musicInfo.value.ncmid : musicId.value
      let cd = await getSongChorus(mid)
      let startTime = cd?.startTime / 1000
      let endTime = cd?.endTime / 1000
      if(startTime && endTime){
        chrous.value = [startTime]
      }
    })


    cover.value.addEventListener('load', handleColor)
    initDynamic(dynamic.value)
  })

  onUnmounted(() => {
    audio.removeEventListener('timeupdate', useLyric)
    destoryDynamic()
  })

  return { colorGroup }
}
