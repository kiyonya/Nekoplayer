import ColorThief from 'colorthief'
/**
 *
 * @param {Array} rgb
 * @returns
 */
export function rgb2Hsl(rgb) {
  // 确保输入的rgb数组包含三个元素，并且每个元素都在0到255之间
  if (rgb.length !== 3 || rgb.some((value) => value < 0 || value > 255)) {
    throw new Error('Invalid RGB value')
  }
  // 将RGB值归一化到0到1之间
  const r = rgb[0] / 255
  const g = rgb[1] / 255
  const b = rgb[2] / 255
  // 计算最大和最小颜色值
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  // 计算亮度（L）
  let l = (max + min) / 2
  // 计算饱和度（S）
  let s = 0
  if (max !== min) {
    s = l <= 0.5 ? delta / (max + min) : delta / (2 - max - min)
  }
  // 计算色调（H）
  let h = 0
  if (delta !== 0) {
    if (r === max) {
      h = ((g - b) / delta) % 6
    } else if (g === max) {
      h = (b - r) / delta + 2
    } else if (b === max) {
      h = (r - g) / delta + 4
    }
    h = Math.round(h * 60) // 转换为0-360度
    if (h < 0) {
      h += 360
    }
  }
  return [parseFloat(h), parseFloat(s), parseFloat(l)]
}

/**
 *
 * @param {Element} img
 */
export async function getMainColorFromImage(img) {
    const colorThief = new ColorThief()
    const color = await colorThief.getColor(img)
    return color
}
