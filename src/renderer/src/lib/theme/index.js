import { store } from '../../store'
import { ref, computed, watch } from 'vue'
const theme = computed({
  get: () => store.state.theme,
  set: ({ key, value }) => {
    store.commit('updateTheme', { key: key, value: value })
  }
})

export function useTheme() {
  const color = theme.value.color
  const font = theme.value.font
  useColor(color)
  useFont(font)
}

export function setTheme({ key, value }) {
  theme.value = { key: key, value: value }
  if (key === 'color') {
    useColor(value)
  }
  else if(key === 'font'){
    useFont(value)
  }
  localStorage.setItem('neko_app_theme',JSON.stringify(theme.value))
  console.log("主题已保存")
}

function compileColor(color) {
  if (color === 'follow') {
    const mediaMatcher = window.matchMedia('(prefers-color-scheme: light)')
    if (mediaMatcher.matches) {
      //更新计算后的展示颜色
      theme.value = { key: 'computedColor', value: 'light' }
    } else {
      theme.value = { key: 'computedColor', value: 'dark' }
    }
    console.log(theme)
  } else {
    theme.value = { key: 'computedColor', value: color }
  }
  
}
function useFont(font){
  let fontImport = document.querySelector(".font-face")
  if(!fontImport){
    const style = document.createElement('style')
    style.classList.add('font-face')
    document.head.appendChild(style)
    fontImport = style
  }
  fontImport.innerHTML = 
  `
  @font-face {
    font-family: "app-font";
    src: local("${font}");
  }
    `
}
function useColor(colorname){
  let colorNamespace = colorname.split(':')[0]
  let colorTheme = colorname.split(':')[1]
  if(colorNamespace === 'default'){
    compileColor(colorTheme)
  }
  const root = document.querySelector('html')
  root.dataset.theme = theme.value.computedColor
}