import { onMounted, onUnmounted, ref } from 'vue'

export default function useContextMenu(containerRef,mode) {
  const showMenu = ref(false)
  const x = ref(0)
  const y = ref(0)
  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    showMenu.value = true
    x.value = e.clientX
    y.value = e.clientY
  }

  const closeMenu = () => {
    showMenu.value = false
  }

  onMounted(() => {
    if (!containerRef.value) {
      return
    }
    const div = containerRef.value.parentNode
    div.focus()
    if(mode === 'contextmenu'){div.addEventListener('contextmenu', handleContextMenu, true)}
    else if(mode === 'click'){div.addEventListener('click', handleContextMenu, true)}
    window.addEventListener('click', closeMenu, true)
    window.addEventListener('contextmenu', closeMenu, true)
  })

  onUnmounted(() => {
    if (!containerRef.value) {
      return
    }
    const div = containerRef.value.parentNode
    if(mode === 'contextmenu'){div.removeEventListener('contextmenu', handleContextMenu, true)}
    else if(mode === 'click'){div.removeEventListener('click', handleContextMenu, true)}
    window.removeEventListener('click', closeMenu, true)
    window.removeEventListener('contextmenu', closeMenu, true)
  })
  return {
    showMenu,
    x,
    y,
  }
}
