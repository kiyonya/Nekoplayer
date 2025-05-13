export class AudioManager {
  constructor() {
    this.audio = new Audio()
    this.audio.crossOrigin = 'anonymous'
    this.events = {}
    this.isinit = false
    this.volumeBeforeMute = 1
    this.biquadFilterDefaultFrequency = [
      32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
    ]
    this.biquadFilterDefaultGain = new Array(10).fill(0)
    this.biquadFilterDefaultQuality = 3
    this.audio.addEventListener('play', () => {
      if (this.isinit) {
        return
      }
      this.audioContext = new AudioContext()
      this.source = this.audioContext.createMediaElementSource(this.audio)
      this.biquadFilterGroup = new BiquadFilterGroup(
        this.audioContext,
        this.biquadFilterDefaultFrequency,
        this.biquadFilterDefaultGain,
        this.biquadFilterDefaultQuality,
        'peaking'
      )
      this.frequencyAnalyser = new FrequencyAnalyser(
        this.audioContext,
        256
      )
      this.source.connect(this.biquadFilterGroup.input)
      this.biquadFilterGroup.output.connect(this.frequencyAnalyser.input)
      this.frequencyAnalyser.output.connect(this.audioContext.destination)
      this.isinit = true
    })
  }
  get currentTime() {
    return this.audio.currentTime
  }
  get duration() {
    return new Promise(resolve => {
      if (this.audio.duration) {
        resolve(this.audio.duration)
      } else {
        this.audio.oncanplay = () => {
          resolve(this.audio.duration)
        }
      }
    })
  }
  get durationSync() {
    return this.audio?.duration
  }
  get sampleRate() {
    return this.audioContext?.sampleRate
  }
  get filter(){
    return this.biquadFilterGroup
  }
  get volume(){
    return this.audio.volume
  }
  get status(){
    if(this.audio.paused){
      return 'PAUSE'
    }
    else{
      return 'PLAY'
    }
  }
  loadFromUrl(src, autoplay) {
    this.audioContext
    this.audio.src = src
    this.audio.load()
    if (autoplay) {
      this.play()
    }
  }
  play() {
    if (this.audio.paused) {
      this.audio.play()
    }
  }
  pause() {
    if (this.audio.played) {
      this.audio.pause()
    }
  }
  togglePlayPause() {
    if (this.audio.paused) {
      this.play()
    } else {
      this.pause()
    }
  }
  setVolume(volume) {
    this.audio.volume = volume
  }
  mute(){
    if(this.audio.volume > 0){
      this.volumeBeforeMute = this.audio.volume
      this.audio.volume = 0
    }
  }
  unmute(){
    if(this.audio.volume <= 0){
      this.audio.volume = this.volumeBeforeMute
      this.volumeBeforeMute = 1
    }
  }
  toggleMute(){
    if(this.audio.volume > 0){this.mute()}
    else{this.unmute()}
  }
  seek(time) {
    this.audio.currentTime = time
  }
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
    this.audio.addEventListener(event, callback)
  }
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(
        cb => cb !== callback
      )
      this.audio.removeEventListener(event, callback)
    }
  }
  trigger(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
  destroy() {
    this.audio.pause()
    this.audio.src = ''
    this.audio.remove()
    this.events = {}
  }
  rate(value = 1) {
    this.audio.playbackRate = value
  }
  exposeAudioElement() {
    return this.audio
  }
  enableFilter(){
    this.biquadFilterGroup.enable()
  }
  disableFilter(){
    this.biquadFilterGroup.disable()
  }
}
export class BiquadFilterGroup {
  /**
   *
   * @param {AudioContext} baseAudioContext
   * @param {Array<number>} frequencies
   * @param {Array<number>} gains
   * @param {Number} quality
   * @param {string} type
   */
  constructor(
    baseAudioContext,
    frequencies,
    gains,
    quality,
    type = 'peaking'
  ) {
    //bind
    this.update = this._debounce(this.update.bind(this), 100)
    this.biquadFilterGroup = []
    this.len = frequencies.length
    this.outputGainNode = baseAudioContext.createGain()
    this.inputGainNode = baseAudioContext.createGain()
    this.outputGainNode.gain.value = 1
    this.inputGainNode.gain.value = 1
    for (let i = 0; i < frequencies.length; i++) {
      const biquadFilter = baseAudioContext.createBiquadFilter()
      biquadFilter.frequency.value = frequencies[i]
      biquadFilter.gain.value = gains[i]
      biquadFilter.Q.value = quality
      biquadFilter.type = type
      this.biquadFilterGroup.push(biquadFilter)
    }
    for (let i = 0; i < this.len - 1; i++) {
      this.biquadFilterGroup[i].connect(this.biquadFilterGroup[i + 1])
    }
    this.inputGainNode.connect(this.biquadFilterGroup[0])
    this.biquadFilterGroup[this.len - 1].connect(this.outputGainNode)
    this.input = this.inputGainNode
    this.output = this.outputGainNode

  }
  setInputGain(value = 1) {
    this.inputGainNode.gain.value = value
    return this.inputGainNode
  }
  setOutputGain(value = 1) {
    this.outputGainNode.gain.value = value
    return this.outputGainNode
  }
  enable() {
    this.inputGainNode.disconnect()
    this.biquadFilterGroup[this.len - 1].disconnect()
    this.inputGainNode.connect(this.biquadFilterGroup[0])
    this.biquadFilterGroup[this.len - 1].connect(this.outputGainNode)
  }
  disable() {
    this.inputGainNode.disconnect()
    this.biquadFilterGroup[this.len - 1].disconnect()
    this.inputGainNode.connect(this.outputGainNode)
  }
  /**
   *
   * @param {Array<Number>} frequencies
   * @param {Array<Number>} gains
   * @param {Number} quality
   * @returns
   */
  update(frequencies, gains, quality) {
    frequencies = frequencies.slice(0, this.biquadFilterGroup.length)
    gains = gains.slice(0, this.biquadFilterGroup.length)
    for (let i = 0; i < this.biquadFilterGroup.length; i++) {
      this.biquadFilterGroup[i].frequency.value = +frequencies[i]
      this.biquadFilterGroup[i].gain.value = +gains[i]
      this.biquadFilterGroup[i].Q.value = +quality
    }
    return this.biquadFilterGroup
  }
  _debounce(func, delay, immediate) {
    let timer
    return function () {
      if (timer) clearTimeout(timer)
      if (immediate) {
        let firstRun = !timer
        timer = setTimeout(() => {
          timer = null
        }, delay)
        if (firstRun) {
          func.apply(this, arguments)
        }
      } else {
        timer = setTimeout(() => {
          func.apply(this, arguments)
        }, delay)
      }
    }
  }
}
export class FrequencyAnalyser {
  /**
   * @param {AudioContext} baseAudioContext
   * @param {Number} fttsize
   */
  constructor(baseAudioContext, fttsize = 256) {
    this.audioContext = baseAudioContext
    this.fttsize = fttsize
    this.anyalyser = this.audioContext.createAnalyser()
    this.anyalyser.fftSize = this.fttsize
    this.dataArray = new Uint8Array(this.anyalyser.frequencyBinCount)
    this.input = this.anyalyser
    this.output = this.anyalyser
  }
  getByteFrequencyData() {
    this.anyalyser.getByteFrequencyData(this.dataArray)
    return this.dataArray
  }
}
