import { ref } from 'vue'
const vw = ref(document.documentElement.clientWidth)
const vh = ref(document.documentElement.clientHeight)
window.addEventListener('resize', () => {
  vw.value = document.documentElement.clientWidth
  vh.value = document.documentElement.clientHeight
})
export function useViewPort() {
  return {
    vw,
    vh
  }
}
