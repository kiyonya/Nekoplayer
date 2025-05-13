import { cvs, ctx } from '.'


const randomData = Uint8Array.from(new Uint8Array(300), (_, k) => k).sort(() => Math.random() - 0.5)

export default function useEffect(dataArray) {
  let byteFrequencyData = dataArray.slice(0, sampleCount)
  ctx.clearRect(0, 0, cvs.width, cvs.height)
  let bData = []
  if (randomRender === 'true') {
    randomData.slice(0, sampleCount).forEach((index) => {
      const data = byteFrequencyData[index]
      const _w = ((128 - data) / 256) * balanceWeight
      bData.push(data * (1 + _w))
    })
  } else {
    byteFrequencyData.forEach((data, index) => {
      const _w = ((128 - data) / 256) * balanceWeight
      bData.push(data * (1 + _w))
    })
  }
  const angle = (Math.PI * 2) / bData.length
  const gnt = ctx.createLinearGradient(0, 0, 150, 150)

  gnt.addColorStop(1, drawColor[0])
  gnt.addColorStop(0, drawColor[1])
  ctx.fillStyle = gnt
  ctx.save()
  ctx.translate(cvs.width / 2, cvs.height / 2)
  bData.forEach((value, index) => {
    ctx.save()
    ctx.rotate(angle * index)
    ctx.beginPath()
    const h = Math.max(4, (value / 256) * (100 * hWeight))
    ctx.roundRect(-4, r, 4, h, 4)
    ctx.fill()
    ctx.restore()
  })
  ctx.restore()
}