export class LyricScroller {
  constructor(container, option = { highlightClassName: 'highlight' }) {
    this.container = container
    this.lastIndex = 0
    this.index = 0
    this.translate = 0
    this.scrollTranslate = 0
    this.isWheeling = false
    this.wheelTimeout = null
    //运行的贝塞尔曲线方程
    this.cubicBezier = 'cubic-bezier(.43,-0.5,0,1) '
    //过度最长时间 before为前部分，after为后部分
    //highlight为高亮部分
    this.maxTransitionTime = {
      before: 1.2,
      after: 1,
      highlight: 0.4
    }
    //过度时间差
    //在过度时间差内，过度时间会随着距离的增加而增加
    //时间差越大运动会越明显越富有动感
    this.transitionTimeDifferance = 2
    this.option = option
    this.animationRenderDistance = 6
    this.scroll = this._debounce(this._scroll, 0).bind(this)
    this.scrollView = this.scrollView.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this._handleResize = this._handleResize.bind(this)
    this.addEventListeners()
    // this.resizeObserver = new ResizeObserver(this._handleResize)
    // this.resizeObserver.observe(this.container)
  }

  addEventListeners() {
    window.addEventListener('resize', this._handleResize)
    this.container.addEventListener('wheel', this.scrollView, {
      passive: false
    })
    this.container.addEventListener('mouseleave', this.handleMouseLeave)
  }

  scrollView(e) {
    e.preventDefault()

    this.isWheeling = true
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout)
    }
    this.wheelTimeout = setTimeout(() => {
      this._restorePosition()
    }, 5000)

    this.container.onclick = ()=>{
        this.isWheeling = false
        this._restorePosition()
        if(this.wheelTimeout) {
            clearTimeout(this.wheelTimeout)
        }
        this.container.onclick = null
    }
    const deltaY = e.deltaY
    const children = this.container.children

    this.scrollTranslate -= deltaY // 调整滚动速度

    for (let i = 0; i < children.length; i++) {
      const lyric = children[i]
      lyric.style.transform = `translateY(${this.scrollTranslate}px)`
      lyric.style.transition = 'transform 0.1s linear'
    }
  }

  handleMouseLeave() {
    if (this.isWheeling) {
      this._restorePosition()
    }
  }

  _restorePosition() {
    if (!this.isWheeling) return

    this.isWheeling = false
    const children = this.container.children
    for (let i = 0; i < children.length; i++) {
      const lyric = children[i]
      lyric.style.transition = 'transform 0.5s cubic-bezier(.43,-0.5,0,1)'
      lyric.style.transform = `translateY(${this.translate}px)`
    }
    this.scrollTranslate = this.translate
  }
  _handleResize() {
    this._debounce(() => {
      this.scroll(this.index)
    }, 100)()
  }
  _scroll(index) {
    if (this.isWheeling) return
    const children = this.container.children
    if (index < 0 && index >= children.length) return
    if (this.lastIndex === index) return
    this.index = index

    const highlight = children[index]
    for (let i = 0; i < children.length; i++) {
      const lyric = children[i]
      lyric.classList.remove(this.option.highlightClassName)
      lyric.style.transform = 'none'
      lyric.style.transition = '.3s'
      lyric.ontransitionend = null
    }
    highlight.classList.add(this.option.highlightClassName)
    if (Math.abs(this.lastIndex - index) < 5) {
      this.animatedScroll(index)
    } else {
      this.normalScroll(index)
    }
    this.lastIndex = index
  }
  countGap({index,time,delay,next}) {
    const items = this.container.children
    let gapProgress = Math.min(1 - (next - time) / delay, 1)
    items[index].style.setProperty('--count-a', Math.min(gapProgress / 0.33, 1))
    items[index].style.setProperty('--count-b', Math.min(gapProgress / 0.66, 1))
    items[index].style.setProperty('--count-c', Math.min(gapProgress / 0.99, 1))
  }
  normalScroll(index) {
    if (this.isWheeling) return

    const children = this.container.children
    const highlight = children[index]

    if (!highlight) return
    const containerHeight = this.container.clientHeight
    const highlightHeight = highlight.clientHeight
    const highlightOffsetTop = highlight.offsetTop
    const scrollPosition = this._calculateCenterPosition(
      highlightOffsetTop,
      containerHeight,
      highlightHeight
    )
    this.translate = -scrollPosition
    this.scrollTranslate = this.translate
    requestAnimationFrame(() => {
      for (let i = 0; i < children.length; i++) {
        const lyric = children[i]
        lyric.style.transform = `translateY(${this.translate}px)`
        lyric.style.transition = `0.3s ${this.cubicBezier}`
      }
    })
  }

  animatedScroll(index) {
    if (this.isWheeling) return
    const children = this.container.children
    const highlight = children[index]
    if (!highlight) return

    const containerHeight = this.container.clientHeight
    const highlightHeight = highlight.clientHeight
    const highlightOffsetTop = highlight.offsetTop
    const scrollPosition = this._calculateCenterPosition(
      highlightOffsetTop,
      containerHeight,
      highlightHeight
    )
    this.translate = -scrollPosition
    this.scrollTranslate = this.translate

    requestAnimationFrame(() => {
      for (let i = 0; i < children.length; i++) {
        const lyric = children[i]
        const indexDistance = Math.abs(i - index)
        lyric.style.transform = `translateY(${this.translate}px)`

        if (indexDistance >= this.animationRenderDistance) continue

        const transitionTime = this._calculateTransitionTime(
          indexDistance,
          index,
          i,
          this.translate
        )

        lyric.style.transition = `${transitionTime}s ${this.cubicBezier}`

        if (i === index) {
          lyric.style.transition = `${this.maxTransitionTime.highlight}s ${this.cubicBezier}`
        }
      }
    })
  }

  _calculateCenterPosition(offsetTop, containerHeight, elementHeight) {
    return offsetTop - (containerHeight - elementHeight) / 2
  }

  _calculateTransitionTime(distance, currentIndex, targetIndex, transformDistance) {
    return (
      this._lnx(distance) *
      (targetIndex <= currentIndex
        ? transformDistance > 0
          ? this.maxTransitionTime.before
          : this.maxTransitionTime.after
        : transformDistance < 0
          ? this.maxTransitionTime.before
          : this.maxTransitionTime.after)
    )
  }

  _lnx(distance) {
    const normalizedDistance = distance / this.animationRenderDistance
    return Math.log(normalizedDistance + 1) * this.transitionTimeDifferance
  }

  _debounce(func, delay) {
    let timer
    return function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  destroy() {
    window.removeEventListener('resize', this._handleResize)
    this.container.removeEventListener('wheel', this.scrollView)
    this.container.removeEventListener('mouseleave', this.handleMouseLeave)
    // this.resizeObserver.unobserve(this.container)
    // this.resizeObserver.disconnect()

    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout)
    }
  }

  reset() {
    this.index = 0
    this.lastIndex = 0
    this.translate = 0
    this.scrollTranslate = 0
    this.isWheeling = false

    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout)
      this.wheelTimeout = null
    }
    const children = this.container.children
    for (let i = 0; i < children.length; i++) {
      const lyric = children[i]
      lyric.classList.remove(this.option.highlightClassName)
      lyric.style.transform = 'translateY(0px)'
      lyric.style.transition = '.1s'
      lyric.ontransitionend = null
    }
    this.isResetting = true
    setTimeout(() => {
      this.isResetting = false
    }, 500)
  }
}
