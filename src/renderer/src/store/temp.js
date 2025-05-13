
import { base64ToBlob, defaultImg } from '../utils/imageProcess'
import { ref } from 'vue'
const createAudioElement = () => {
  //创建audio元素
  const audio = document.createElement('audio')
  audio.autoplay = true
  audio.crossOrigin = 'anonymous'
  return audio
}
const temp = {
  online:ref(false),
  musicResource: ref({}),
  lyric: ref([]),
  lyricStatus:ref({

  }),
  audio: createAudioElement(),
  defaultCover:URL.createObjectURL(base64ToBlob(defaultImg)),
  showMusicPlayer:ref(false),

  showEqualizer:ref(false),
  likelist:null
}
export default temp
