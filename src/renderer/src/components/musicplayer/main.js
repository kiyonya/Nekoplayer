import { generateSimilarColors } from '@/utils/color'
import ColorThief from 'colorthief'
let lastCoverSrc = null
let lastColorSave = []
export class LyricController {
  constructor(lyricContainer) {
    this.translate = 0
    this.k = 0.2
    this.base = 0.2
    this.lyricContainer = lyricContainer
    this.index
    this.lastIndex
    this.isLocating = true
    this.threehold = 10
    window.addEventListener('resize', this.resize.bind(this))
  }
  scroll(index, dir, skip = false, sublyric = false, et = 0) {
    index = index + 1
    const items = Array.from(this.lyricContainer.children)
    if (index > items.length - 1) {
      return
    }
    if (this.lastIndex === index && !skip) {
      return
    }
    let indexGap = Math.abs(this.lastIndex - index)
    if (indexGap > 2) {
      this.isLocating = true
    }
    this.lastIndex = this.index
    this.index = index
    items.forEach((e) => {
      if (e.classList.contains('highlight')) {
        e.classList.remove('highlight')
      }
      if (dir === 0) {
        e.style.transition = 'none'
      } else {
        e.style.transition = this.k + 's'
      }
    })
    const focus = items[index]
    focus.classList.add('highlight')
    if (sublyric && items[index - 1]) {
      items[index - 1].classList.add('highlight')
    }
    const lastfocus = items[this.lastIndex]
    let lastOffset = this.getOffset(lastfocus)
    let offset = this.getOffset(focus)
    let delta = offset - lastOffset
    this.translate += delta
    let before = items.slice(0, index).reverse()
    let after = items.slice(index, items.length)

    for (let i = 0; i < before.length; i++) {
      let delay
      if (i < this.threehold / 2) {
        delay = i * this.k * 1.2
      }
      if (dir === 0) {
        delay = 0
      }
      before[i].style.transform = `translateY(-${this.translate + et}px)`
      if (delay && !this.isLocating) {
        before[i].style.transition = `${delay}s cubic-bezier(.33,0,.22,1)`
      }
    }

    for (let i = 0; i < after.length; i++) {
      let delay
      if (i < this.threehold / 2) {
        delay = i * this.k + 0.45
      }
      if (dir === 0) {
        delay = 0
      }
      after[i].style.transform = `translateY(-${this.translate + et}px)`
      if (delay && !this.isLocating) {
        after[i].style.transition = `${delay}s cubic-bezier(.33,0,.22,1)`
      }
    }
    this.isLocating = false
  }
  countGap(highlight, time) {
    const items = Array.from(this.lyricContainer.children)
    let index = highlight?.index + 1
    let duration = highlight?.highlightSentence?.delay
    let next = highlight?.highlightSentence?.next
    let gapProgress = Math.min(1 - (next - time) / duration, 1)
    items[index].style.setProperty('--count-a', Math.min(gapProgress / 0.33, 1))
    items[index].style.setProperty('--count-b', Math.min(gapProgress / 0.66, 1))
    items[index].style.setProperty('--count-c', Math.min(gapProgress / 0.99, 1))
  }
  getOffset(focus) {
    if (!focus) {
      return 0
    }
    return Math.max(
      focus.clientHeight / 2 + focus.offsetTop - this.lyricContainer.clientHeight / 2,
      0
    )
  }
  start() {
    this.index = 0
    const items = Array.from(this.lyricContainer.children)
    this.translate = this.getOffset(items[this.index])
    items.forEach((e) => {
      if (e.classList.contains('highlight')) {
        e.classList.remove('highlight')
      }
      e.style.transition = this.k + 's'
      e.style.transform = `translateY(-${this.translate}px)`
    })
    this.lastIndex = Infinity
  }
  end() {
    const items = Array.from(this.lyricContainer.children)
    this.translate = this.getOffset(items[items.length - 1])
    this.scroll(items.length - 1, 0)
  }
  resize() {
    const items = Array.from(this.lyricContainer.children)
    this.translate = this.getOffset(items[this.index || 0])
    this.scroll(this.index - 1 <= 0 ? 0 : this.index - 1, 0, true)
  }
  unmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }
  notransition(index) {
    const items = Array.from(this.lyricContainer.children)
    this.translate = this.getOffset(items[index])
    this.scroll(index, 0)
  }
  textclip(sentenceIndex, wordIndex = null, wordpass = null, iswfw = false) {
    this.lyricContainer.querySelectorAll('.passed').forEach((i) => {
      i.removeAttribute('style')
      i.classList.remove('passed')
    })
    this.lyricContainer.querySelectorAll('.passing').forEach((i) => {
      i.classList.remove('passing')
    })
    const items = Array.from(this.lyricContainer.children)
    const highlightSentence = items[sentenceIndex]
    const textNodes = Array.from(highlightSentence.querySelector('.lrc').children)
    if (!iswfw) {
      textNodes.forEach((e) => {
        e.classList.add('passed')
      })
      return
    }
    const highlightText = textNodes[wordIndex]
    const before = textNodes.slice(0, wordIndex)
    for (let pass of before) {
      pass.classList.add('passed')
    }
    highlightText.classList.add('passing')
    if (wordpass < 1) {
      highlightText.style.backgroundSize = `${Math.min(wordpass, 1) * 100}% 100%`
    } else {
      highlightText.removeAttribute('style')
    }
  }
}
export function colorDeriveFromImg(img, count = 10, dya = 2) {
  const cf = new ColorThief()
  const preMatch = cf.getPalette(img, count)
  const main = cf.getColor(img)
  const filtered = filter(preMatch)
  const raw = filtered.length <= 0 ? [main] : filtered
  let result = []
  if (raw.length >= dya) {
    raw.slice(0, dya).forEach((i) => {
      result.push(...addRandom(i, Math.floor(count / dya)))
    })
  } else {
    result = addRandom(raw[0], count)
  }
  result.sort((a, b) => {
    let [ah, as, al] = rgbToHsl(a)
    let [bh, bs, bl] = rgbToHsl(b)
    return bl - al
  })
  return result
  function addRandom(base, count = 10, threehold = 10) {
    const result = [base]
    let [r, g, b] = base
    for (let i = 0; i < count; i++) {
      result.push([salt(r), salt(g), salt(b)])
    }
    function salt(i) {
      return Math.max(
        Math.min(Math.floor(i + Math.random() * (threehold + threehold) - threehold), 255),
        0
      )
    }
    return result
  }
  function rgbToHsl(r, g, b) {
    ;(r /= 255), (g /= 255), (b /= 255)
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h,
      s,
      l = (max + min) / 2
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    return [h, s, l]
  }
  function filter(rgbArray) {
    return rgbArray.filter((color) => {
      const [r, g, b] = color
      const [h, s, l] = rgbToHsl(r, g, b)
      return s > 0.3 && l > 0.4 && l < 0.7
    })
  }
}
export class DynamicBackground {
  constructor(canvas) {
    this.cvs = canvas;
    this.cvs.width = window.innerWidth * devicePixelRatio;
    this.cvs.height = window.innerHeight * devicePixelRatio;
    this.ctx = this.cvs.getContext('2d');
    
    // 离屏Canvas
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.cvs.width;
    this.offscreenCanvas.height = this.cvs.height;
    this.offscreenCtx = this.offscreenCanvas.getContext('2d');
    
    this.circles = [];
    this.colors = lastColorSave || [];
    this.animationId = null;
    this.lastFrameTime = 0;
    this.candraw = false;
    this.exit = false;
    this.resizeHandler = this._debounce(this.resize.bind(this), 200);
    window.addEventListener('resize', this.resizeHandler);
  }
  start() {
    // this.candraw = true;
    this.animate();
  }
  pause() {
    this.candraw = false;
  }
  unmount() {
    this.exit = true;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resizeHandler);
    this.candraw = false;
  }

  async setColors(color) {
    this.colors = generateSimilarColors(color,7,5);
    await this.initCircles();
  }

  async initCircles() {
    let d = 500;
    this.circles = [];
    let colors = this.colors.map((rgb) => `rgb(${rgb})`);
    
    // 分批创建圆圈
    const batchSize = 2;
    for (let i = 0; i < colors.length; i += batchSize) {
      await new Promise(resolve => {
        requestIdleCallback((idle) => {
          for (let j = 0; j < batchSize && i + j < colors.length; j++) {
            let r = window.innerWidth / 4;
            let x = this._getRandom(r, this.cvs.width - r);
            let y = this._getRandom(r, this.cvs.height - r);
            let dx = this._getRandom(window.innerWidth / -d, window.innerWidth / d);
            let dy = this._getRandom(window.innerWidth / -d, window.innerWidth / d);
            this.circles.push({ x, y, dx, dy, r, color: colors[i + j] });
          }
          resolve();
        });
      })
      this.cvs.style.opacity = 1;
    }
  }

  animate() {
    if (this.exit) return;
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    if (!this.candraw) return;
    // 控制帧率
    const now = performance.now();
    if (now - this.lastFrameTime < 48) return; 
    this.lastFrameTime = now;
    
    // 使用离屏Canvas绘制
    this.offscreenCtx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    
    for (const c of this.circles) {
      // 边界检查
      if (c.x + c.r > this.cvs.width || c.x - c.r < 0) c.dx = -c.dx;
      if (c.y + c.r > this.cvs.height || c.y - c.r < 0) c.dy = -c.dy;
      
      // 更新位置
      c.x += c.dx;
      c.y += c.dy;
      
      // 绘制到离屏Canvas
      this.offscreenCtx.beginPath();
      this.offscreenCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      this.offscreenCtx.fillStyle = c.color;
      this.offscreenCtx.fill();
    }
    
    // 一次性绘制到主Canvas
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
  }

  resize() {
    this.cvs.width = window.innerWidth * 1.5;
    this.cvs.height = window.innerHeight * 1.5;
    this.offscreenCanvas.width = this.cvs.width;
    this.offscreenCanvas.height = this.cvs.height;
    this.initCircles();
  }

  _getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  _debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
}
export class AudioWaveDrawer {
  constructor(canvas) {
    this.cvs = canvas
    this.ctx = canvas.getContext('2d')
  }
  /**
   *
   * @param {Uint8Array} dataArray
   */
  renderFrame(dataArray) {
    dataArray = dataArray.slice(0, 48).reverse()
    const { width, height } = this.cvs
    this.ctx.clearRect(0, 0, width, height)
    const len = dataArray.length
    const barWidth = width / len
    this.ctx.fillStyle = '#fff'
    for (let i = 0; i < len; i++) {
      const data = dataArray[i]
      const barHeight = Math.max((data / 255) * height, barWidth)
      const x = i * barWidth
      const y = height - barHeight
      this.drawRoundedRect(x, y, barWidth * 0.5, barHeight, barWidth / 2)
    }
  }
  drawRoundedRect(x, y, width, height, radius) {
    this.ctx.beginPath()
    this.ctx.moveTo(x + radius, y)
    this.ctx.lineTo(x + width - radius, y)
    this.ctx.arcTo(x + width, y, x + width, y + radius, radius)
    this.ctx.lineTo(x + width, y + height - radius)
    this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
    this.ctx.lineTo(x + radius, y + height)
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius)
    this.ctx.lineTo(x, y + radius)
    this.ctx.arcTo(x, y, x + radius, y, radius)
    this.ctx.closePath()
    this.ctx.fill()
  }
}
