import ColorThief from "colorthief"
export function resize(url, pixel,returnDefaultWhenInvalidURL = false) {
  if (!url && returnDefaultWhenInvalidURL) {
    return "http://p3.music.126.net/C6Vro2l0BH59Wka9gOaC6w==/109951171180358170.jpg?param=100y100&type=webp"
  }
  if (url?.startsWith('blob:')) {
    return url
  }
  else if(url?.startsWith("http")){
    return url + `?param=${pixel}y${pixel}&type=webp`
  }
  else{
    return null
  }
  
}

export function base64ToBlob(base64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(base64Data.split(',')[1]) // 去掉前缀，并解码
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)
    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, {
    type: contentType || base64Data.split(',')[0].split(':')[1].split(';')[0]
  })
  return blob
}

function generateSimilarColor(rgb) {
  // 生成一个随机的微调值（范围在 -20 到 20 之间）
  const randomOffset = () => Math.floor(Math.random() * 41) - 10;

  // 对 RGB 的每个分量进行微调，并确保值在 0-255 之间
  const newR = Math.min(Math.max(rgb[0] + randomOffset(), 0), 255);
  const newG = Math.min(Math.max(rgb[1] + randomOffset(), 0), 255);
  const newB = Math.min(Math.max(rgb[2] + randomOffset(), 0), 255);

  return [newR, newG, newB];
}

function rgbToCSS(rgb) {
  // 将 RGB 数组转换为 CSS 颜色字符串
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function createLinearGradient(d = "45deg",rgb) {
  // 生成相近的颜色
  const similarColor = generateSimilarColor(rgb);

  // 将原始颜色和相近颜色转换为 CSS 格式
  const color1 = rgbToCSS(rgb);
  const color2 = rgbToCSS(similarColor);

  // 返回 linear-gradient 格式的字符串
  return `linear-gradient(${d}, ${color1}, ${color2})`;
}

export async function getMainColorFromImg(img){
  const cf = new ColorThief()
  const main = await cf.getColor(img,5)
  return main
}