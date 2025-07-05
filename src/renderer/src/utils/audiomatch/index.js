import { matchAudioFingerprint } from '@/api/song'
import GenerateFP from './afp'
export class SystemAudioFingerprintGenerator {
  constructor() {
    this.isinit = false
    this.audioCtx = new AudioContext({ sampleRate: 8000 })
    this.recoder = null
    this.inputUserMediaSource = null
    this.init()
  }
  async init() {
    if(this.isinit){return}
    const workletUrl = new URL('./recoder_process.js', import.meta.url).href
    await this.audioCtx.audioWorklet.addModule(workletUrl)
    console.log('recoder module loaded')
    this.recoder = new AudioWorkletNode(this.audioCtx, 'recoder')
    this.isinit = true
  }
  async getSystemSource() {
    const sources = await window.electron.ipcRenderer.invoke('audio:getAudioSource')
    return sources
  }
  async startCaptureSystemAudio(duration = 3) {
    if (!this.isinit) {
      await this.init()
    }
    let source
    let systemSource = await this.getSystemSource()
    if (systemSource) {
      source = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        },
        video: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        }
      })
    }
    this.getSystemSource()
    if (this.inputUserMediaSource) {
      this.inputUserMediaSource.disconnect()
    }
    this.inputUserMediaSource = this.audioCtx.createMediaStreamSource(source)
    this.inputUserMediaSource.connect(this.recoder)
    const recording = await this.recoding(duration)
    let sampleBuffer = new Float32Array(recording.subarray(0, duration * 8000))
    let audiofp = await GenerateFP(sampleBuffer)
    source = null
    this.cleanUp()
    return audiofp
  }
  recoding(duration) {
    return new Promise((resolve, reject) => {
      this.recoder.port.postMessage({ message: 'start', duration })
      this.recoder.port.onmessage = (e) => {
        if (e.data.message === 'finished') {
          const recodedBuffer = e.data.recording
          resolve(recodedBuffer)
        }
      }
    })
  }
  cleanUp() {
    if (this.inputUserMediaSource) {
      this.inputUserMediaSource.disconnect()
      this.inputUserMediaSource = null
    }
  }
}
const systemAudioFingerprintGenerator = new SystemAudioFingerprintGenerator()
export async function recognizeSystemAudio(duration = 3) {

  const audioFP = await systemAudioFingerprintGenerator.startCaptureSystemAudio(duration)
  systemAudioFingerprintGenerator.cleanUp()
  const data = await matchAudioFingerprint(duration, audioFP)
  return data
}
