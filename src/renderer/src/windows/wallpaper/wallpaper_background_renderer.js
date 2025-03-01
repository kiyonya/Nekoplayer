//绘制函数
let cvs, ctx, candraw
let isInit = false
let colorGroup
let config
import { watch } from "vue"
export function initBackground(cavans,cg,cf) {
  cvs = cavans
  colorGroup = cg
  config = cf
  cvs.width = window.innerWidth * devicePixelRatio
  cvs.height = window.innerHeight * devicePixelRatio
  ctx = cavans.getContext('2d')
  watch(colorGroup, () => {
    initCircles()
  })
  isInit = true
  window.addEventListener('resize', onWindowResize)
  candraw = true
  animate()
  return true
}
export function destoryBackground() {
  candraw = false
  window.removeEventListener('resize', onWindowResize)
}
function getRandom(min, max) {
  return Math.random() * (max - min) + min
}
let circles = []
function initCircles() {
  let d = 10000 * 0.4
  circles = []
  let colors = similarColors(colorGroup.value.mainColor,15).map((rgb) => {
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
  })
  for (let color of colors) {
    let r = window.innerWidth / 6
    let x = getRandom(r, cvs.width - r)
    let y = getRandom(r, cvs.height - r)
    let dx = getRandom(window.innerWidth / -d, window.innerWidth / d)
    let dy = getRandom(window.innerWidth / -d, window.innerWidth / d)
    circles.push({ x, y, dx, dy, r, color })
  }
}
function draw(circle) {
  ctx.beginPath()
  ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false)
  ctx.fillStyle = circle.color
  ctx.fill()
  ctx.closePath()
}
function animate() {
  requestAnimationFrame(animate)
  if (!candraw) {
    return
  }
  ctx.clearRect(0, 0, cvs.width, cvs.height)
  if(config.value.wallpaperBackgroundMode !== 'fog'){
    return
  }
  circles.forEach((c) => {
    if (c.x + c.r > cvs.width || c.x - c.r < 0) {
      c.dx = -c.dx
    }
    if (c.y + c.y > cvs.height || c.y - c.r < 0) {
      c.dy = -c.dy
    }
    c.x += c.dx
    c.y += c.dy
    draw(c)
  })
}
function onWindowResize() {
  cvs.width = window.innerWidth * 1.5
  cvs.height = window.innerHeight * 1.5
  initCircles()
}
function similarColors(rgb, n) {
    const similarColors = [];
    const baseRed = rgb[0];
    const baseGreen = rgb[1];
    const baseBlue = rgb[2];
    const maxDeviation = 10;
    for (let i = 0; i < n; i++) {
        const red = Math.max(0, Math.min(255, baseRed + Math.floor(Math.random() * (2 * maxDeviation + 1) - maxDeviation)));
        const green = Math.max(0, Math.min(255, baseGreen + Math.floor(Math.random() * (2 * maxDeviation + 1) - maxDeviation)));
        const blue = Math.max(0, Math.min(255, baseBlue + Math.floor(Math.random() * (2 * maxDeviation + 1) - maxDeviation)));
 
        similarColors.push([red, green, blue]);
    }
    return similarColors;
}