import { store } from '../../store'
import { ref, computed, watch } from 'vue'
const theme = computed({
  get: () => store.state.theme,
  set: ({ key, value }) => {
    store.commit('updateTheme', { key: key, value: value })
  }
})

function rgb2Hsl(rgb) {
  let r = rgb[0] / 255
  let g = rgb[1] / 255
  let b = rgb[2] / 255

  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60
        break
      case g:
        h = ((b - r) / d + 2) * 60
        break
      case b:
        h = ((r - g) / d + 4) * 60
        break
    }
    h = Math.round(h)
    s = Math.round(s * 100)
    l = Math.round(l * 100)
  }

  return [h, s, l]
}
function hsl2Rgb(hsl) {
  // Extract HSL components
  let h = hsl[0] / 360 // Convert hue to 0-1 range
  let s = hsl[1] / 100 // Convert saturation to 0-1 range
  let l = hsl[2] / 100 // Convert lightness to 0-1 range

  let r, g, b

  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  // Convert to 0-255 range and round
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
export function useTheme() {
  const color = theme.value.color
  const font = theme.value.font
  const ui = theme.value.ui
  useUIColor(ui)
  useThemeColor(color)
  useFont(font)
}

export function setTheme({ key, value }) {
  theme.value = { key: key, value: value }
  if (key === 'theme') {
    useThemeColor(value)
  } else if (key === 'font') {
    useFont(value)
  }else if(key === 'ui'){
    useUIColor(value)
  }
  localStorage.setItem('neko_app_theme', JSON.stringify(theme.value))
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
  } else {
    theme.value = { key: 'computedColor', value: color }
  }
}
function useFont(font) {
  let fontImport = document.querySelector('.font-face')
  if (!fontImport) {
    const style = document.createElement('style')
    style.classList.add('font-face')
    document.head.appendChild(style)
    fontImport = style
  }
  fontImport.innerHTML = `
  @font-face {
    font-family: "app-font";
    src: local("${font}");
  }
    `
}
function useThemeColor(colorname) {
  let colorNamespace = colorname.split(':')[0]
  let colorTheme = colorname.split(':')[1]
  if (colorNamespace === 'default') {
    compileColor(colorTheme)
  }
  const root = document.querySelector('html')
  root.dataset.theme = theme.value.computedColor
}

function useUIColor(colorRGBArray = [133, 141, 255]) {
  const hslArray = rgb2Hsl(colorRGBArray)
  const ui = {
    strong: colorRGBArray,
    'strong-light': hsl2Rgb([hslArray[0], hslArray[1] + 4, hslArray[2] + 5]),
    'strong-dark': hsl2Rgb([hslArray[0], hslArray[1] + 3, hslArray[2] - 5]),
    ui:hsl2Rgb([hslArray[0], hslArray[1],10])
  }
  let style = document.querySelector('.ui-color');
  if(!style){
    style = document.createElement('style')
    style.classList.add('ui-color')
  }
  style.innerHTML = `
    :root{
      --strong:rgb(${ui.strong});
      --strong-light:rgb(${ui['strong-light']});
      --strong-dark:rgb(${ui['strong-dark']});
    }
  `
  document.head.appendChild(style)
}
