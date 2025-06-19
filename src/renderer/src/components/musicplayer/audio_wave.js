import { store } from "@/store"
import { computed } from "vue"
const audioVisualizationConfig = computed(()=>{
  return store.state.config.audioVisualizationConfig
})


export class AudioWaveEffect {
  /**
   *
   * @param {CanvasElement} cvs
   */
  constructor(cvs) {
    if(!cvs){return}
    this.cvs = cvs
    this.cvs.width = this.cvs.clientWidth
    this.cvs.height = this.cvs.clientHeight
    this.ctx = cvs.getContext('2d')
    this.color = 'white'
    this.randomData = Uint8Array.from(new Uint8Array(120), (_, k) => k).sort(
      () => Math.random() - 0.5
    )
    this.useRandomConfuse = false
    this.connectionMode = false; // 'neighbor' | 'web' | 'center' | false
    this.waveStyle = "stair"
  }
  _avarage(array) {
    let sum = 0
    for (let i of array) {
      sum += i
    }
    return sum / array.length
  }
  /**
   * @param {Uint8Array} byte
   */
  draw(byte) {
    if (!this.cvs) {
      return
    }
    // this.frequencyStair(byte)
   if(this.waveStyle === "stair"){
    this.frequencyStair(byte)
   }
   else if(this.waveStyle === "particle"){
    this.frequencyParticle(byte)
   }
  }
  setFillColor(rgbArray) {
    this.color = `rgb(${rgbArray})`
  }
  frequencyStair(dataArray) {
    let byteFrequencyData = dataArray.slice(0, 120)
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
    let bData = []
    if (audioVisualizationConfig.value.randomConfuse) {
      this.randomData.forEach((index) => {
        bData.push(byteFrequencyData[index])
      })
    } else {
      bData = byteFrequencyData
    }
    const angle = (Math.PI * 2) / bData.length
    this.ctx.fillStyle = this.color
    this.ctx.save()
    this.ctx.translate(this.cvs.width / 2, this.cvs.height / 2)
    bData.forEach((value, index) => {
      this.ctx.save()
      this.ctx.rotate(angle * index)
      this.ctx.beginPath()
      const h = Math.max(4, (value / 256) * 60) // 确保高度至少为4
      this.ctx.roundRect(-4, 140, 4, h, 4) // 宽度调整为8以适应可能的圆角
      this.ctx.fill()
      this.ctx.restore()
    })
    this.ctx.restore()
  }

  frequencyParticle(dataArray) {
    let byteFrequencyData = dataArray.slice(10, 130);
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

    // 处理数据
    let bData = [];
    this.randomData.forEach((index) => {
        bData.push(byteFrequencyData[index]);
    });
    bData = [...bData, ...bData,...bData]; // 双倍数据点使圆更密集
    const centerX = this.cvs.width / 2;
    const centerY = this.cvs.height / 2;
    const baseRadius = Math.min(centerX, centerY) * 0.75;
    const angleStep = (Math.PI * 2) / bData.length;
    
    // 存储粒子位置用于连线
    const particlePositions = [];
    
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    
    // 首先绘制所有粒子并记录位置
    bData.forEach((value, index) => {
        const angle = angleStep * index;
        const particleSize =1;
        const distance = baseRadius + (value / 256) * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        // 存储位置
        particlePositions.push({ x, y, value });
        
        // 绘制粒子
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, particleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 拖尾效果
        if (this.useTrails) {
            const trailLength = (value / 256) * 20;
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, particleSize + trailLength);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, particleSize + trailLength, 0, Math.PI * 2);
            this.ctx.fill();
        }
    });
    
    // 绘制连线 - 三种可选模式
    if (this.connectionMode === 'neighbor') {
        // 模式1: 连接相邻粒子
        this.ctx.strokeStyle = this.color
        this.ctx.lineWidth = 0.8;
        this.ctx.beginPath();
        
        for (let i = 0; i < particlePositions.length; i++) {
            const nextIdx = (i + 1) % particlePositions.length;
            const p1 = particlePositions[i];
            const p2 = particlePositions[nextIdx];
            
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
        }
        this.ctx.stroke();
    } 
    else if (this.connectionMode === 'web') {
        // 模式2: 网状连接(每个粒子连接多个相邻粒子)
        const connections = 3; // 每个粒子连接的邻居数量
        this.ctx.strokeStyle = this.color
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particlePositions.length; i++) {
            const p1 = particlePositions[i];
            for (let j = 1; j <= connections; j++) {
                const p2 = particlePositions[(i + j) % particlePositions.length];
                
                // 根据频率差异调整连线透明度
                const alpha = 0.15 + (Math.min(p1.value, p2.value) / 256) * 0.3;
                this.ctx.strokeStyle = this.color.replace(')', `, ${alpha})`);
                
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            }
        }
    }
    else if (this.connectionMode === 'center') {
        // 模式3: 所有粒子连接中心点
        this.ctx.strokeStyle = this.color
        this.ctx.lineWidth = 0.8;
        
        particlePositions.forEach(p => {
            const alpha = 0.1 + (p.value / 256) * 0.3;
            this.ctx.strokeStyle = this.color
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0); // 中心点
            this.ctx.lineTo(p.x, p.y);
            this.ctx.stroke();
        });
    }
    
    this.ctx.restore();
}

  _dynamicRangeCompression(dataArray, ratio = 10, threshold = 255) {
    return dataArray.map((value) => {
      if (value > threshold) {
        return threshold + (value - threshold) / ratio
      }
      return value
    })
  }
}
