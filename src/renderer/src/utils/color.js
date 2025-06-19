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

/**
 * 生成指定数量的相似颜色
 * @param {Array} baseColor - 基础RGB颜色，如[255, 120, 50]
 * @param {number} count - 要生成的颜色数量
 * @param {number} diff - 相似度差异值(0-100)，值越小颜色越接近
 * @returns {Array} 返回生成的RGB颜色数组
 */
export function generateSimilarColors(baseColor, count, diff) {
  // 参数验证
  if (!Array.isArray(baseColor) || baseColor.length !== 3 || 
      baseColor.some(c => c < 0 || c > 255)) {
    throw new Error('baseColor必须是有效的RGB数组，如[255, 120, 50]');
  }
  if (typeof count !== 'number' || count < 1) {
    throw new Error('count必须是大于0的数字');
  }
  if (typeof diff !== 'number' || diff < 0 || diff > 100) {
    throw new Error('diff必须是0到100之间的数字');
  }

  // 将diff从百分比转换为实际RGB值范围(0-255)
  const maxDiff = Math.round((diff / 100) * 255);
  const colors = [];

  for (let i = 0; i < count; i++) {
    // 为每个通道生成随机偏移量
    const r = baseColor[0] + getRandomOffset(maxDiff);
    const g = baseColor[1] + getRandomOffset(maxDiff);
    const b = baseColor[2] + getRandomOffset(maxDiff);

    // 确保RGB值在0-255范围内
    colors.push([
      clampValue(r, 0, 255),
      clampValue(g, 0, 255),
      clampValue(b, 0, 255)
    ]);
  }

  return colors;
}

// 生成-到+maxDiff之间的随机偏移量
function getRandomOffset(maxDiff) {
  return Math.floor(Math.random() * (maxDiff * 2 + 1)) - maxDiff;
}

// 确保值在min-max范围内
function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

