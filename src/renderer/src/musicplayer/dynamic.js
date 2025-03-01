let isInit = false
let cvs
let ctx
let candraw = false
import { watch,computed } from 'vue'
let colorGroup;
import { store } from '../store'
const backgroundMode = computed(()=>{
  return store.state.config.musicPlayerBackgroundMode
})
export function initDynamic(cavans,color) {
  colorGroup = color
  cvs = cavans
  cvs.width = window.innerWidth * devicePixelRatio
  cvs.height = window.innerHeight * devicePixelRatio
  ctx = cavans.getContext('2d')
  watch(colorGroup,()=>{initCircles()})
  isInit = true
  window.addEventListener('resize', resize)
  candraw = true
  animate()
  return true
}
export function destoryDynamic() {
  candraw = false
  window.removeEventListener('resize', resize)
}
function getRandom(min, max) {
  return Math.random() * (max - min) + min
}

let circles = []
function initCircles() {
  let d = 10000 * 0.7
  circles = []
  let colors = colorGroup.value.colors.slice(0,7).map(rgb=>{return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`})
  for (let color of colors) {
    let r = window.innerWidth / 4
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
    
  if (!candraw || backgroundMode.value !== 'dynamic') {
    return
  }
  ctx.clearRect(0, 0, cvs.width, cvs.height)
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

function resize() {
  cvs.width = window.innerWidth * 1.5
  cvs.height = window.innerHeight * 1.5
  initCircles()
}
