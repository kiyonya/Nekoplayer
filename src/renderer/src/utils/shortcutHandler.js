export class ShortcutHandler {
  constructor( waitTime = 300) {
    this.keys = new Set()
    this.callback = null
    this.waitTime = waitTime
    this.timer = null
    this.ref = void 0
  }
  static alias = {
    ' ': 'space',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Control:'ctrl',
    ArrowUp:'up',
    ArrowDown:'down'
  }
  handleKeyDown(e) {
    //e.preventDefault()
    this.keys.add(e.key)
    this.resetTimer()
  }
  resetTimer() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      const aliases = ShortcutHandler.alias
      const activeKeys = Array.from(this.keys).map((key) => aliases[key] || key)
      this.callback(activeKeys)
      this.keys.clear()
    }, this.waitTime)
  }
  unlisten() {
    this.ref.removeEventListener('keydown', this.handleKeyDown.bind(this))
  }
  listen(e,callback,passive = false){
    this.ref = e
    this.callback = callback
    if (typeof this.callback !== 'function') {
      throw new Error('callback必须是函数否则让你飞起来')
    }
    this.ref.addEventListener('keydown', this.handleKeyDown.bind(this),passive)
  }
}
