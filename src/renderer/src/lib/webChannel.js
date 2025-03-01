export class webChannel {
  constructor(channelName) {
    this.channelName = channelName
    this.channel = new BroadcastChannel(this.channelName)
    this.handler = {}
  }
  send(event, data, callback) {
    this.channel.postMessage(
      JSON.stringify({
        head: event,
        time: Date.now(),
        data: data || ''
      })
    )
    if (callback && typeof callback === 'function') {
      callback(event)
    }
  }
  listen() {
    this.channel.addEventListener('message', this.handleEvent.bind(this))
  }
  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback must function')
    }
    this.handler[event] = callback
  }
  handleEvent(e) {
    const msg = JSON.parse(e.data)
    const event = msg.head || ''
    const data = msg.data
    const time = msg.time
    let callback = this.handler[event]
    if (callback) {
      callback(data, time)
    }
  }
  unlisten() {
    this.channel.removeEventListener('message', this.handleEvent.bind(this))
    this.channel.close()
  }
}
