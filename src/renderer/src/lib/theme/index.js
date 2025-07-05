import { store } from '../../store'
import { computed } from 'vue'
let fontStyleElement = null
let uiStyleElement = null
const colorSchemeMatcher = window.matchMedia('(prefers-color-scheme: light)')
const theme = computed({
  get: () => store.state.theme,
  set: ({ key, value }) => store.commit('updateTheme', { key, value })
})
function rgb2Hsl([r, g, b]) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break
      case g: h = ((b - r) / d + 2) * 60; break
      case b: h = ((r - g) / d + 4) * 60; break
    }
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

function hsl2Rgb([h, s, l]) {
  h /= 360
  s /= 100
  l /= 100

  if (s === 0) {
    const val = Math.round(l * 255)
    return [val, val, val]
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255)
  ]
}

export function useTheme() {
  const font = theme.value.font || 'default'
  const ui = theme.value.ui || [0,0,0]
  const themeName = theme.value.theme || 'default:follow'
  useUIColor(ui)
  useThemeColor(themeName)
  useFont(font)
}

export function setTheme({ key, value }) {
  theme.value = { key, value }
  
  switch (key) {
    case 'theme': useThemeColor(value); break
    case 'font': useFont(value); break
    case 'ui': useUIColor(value); break
  }
  
  localStorage.setItem('neko_app_theme', JSON.stringify(theme.value))
}

function compileColor(color) {
  const computedColor = color === 'follow' 
    ? (colorSchemeMatcher.matches ? 'light' : 'dark')
    : color
    
  theme.value = { key: 'computedColor', value: computedColor }
}

function useFont(font) {
  if (!fontStyleElement) {
    fontStyleElement = document.createElement('style')
    fontStyleElement.classList.add('font-face')
    document.head.appendChild(fontStyleElement)
  }

  fontStyleElement.textContent = font === 'default'
    ? `@font-face { font-family: "app-font"; src: local("system-ui"), local("-apple-system"), local("BlinkMacSystemFont"), local("Segoe UI"), local("Roboto"), local("Helvetica Neue"), local("Arial"), local("Noto Sans"), local("sans-serif"); }`
    : `@font-face { font-family: "app-font"; src: local("${font}"); }`
}

function useThemeColor(colorName) {
  const [namespace, themeColor] = colorName?.split(':') || []
  if (namespace === 'default') {
    compileColor(themeColor)
  }
  document.documentElement.dataset.theme = theme.value.computedColor
}

function useUIColor(colorRGBArray = [133, 141, 255]) {
  const [h, s, l] = rgb2Hsl(colorRGBArray)
  
  const uiColors = {
    strong: colorRGBArray,
    'strong-light': hsl2Rgb([h, s + 4, l + 5]),
    'strong-dark': hsl2Rgb([h, s + 3, l - 5]),
    ui: hsl2Rgb([h, s, 10])
  }

  if (!uiStyleElement) {
    uiStyleElement = document.createElement('style')
    uiStyleElement.classList.add('ui-color')
    document.head.appendChild(uiStyleElement)
  }

  uiStyleElement.textContent = `
    :root {
      --strong: rgb(${uiColors.strong});
      --strong-light: rgb(${uiColors['strong-light']});
      --strong-dark: rgb(${uiColors['strong-dark']});
    }
  `
}