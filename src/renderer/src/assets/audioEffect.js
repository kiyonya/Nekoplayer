let isInit = false;
const audioCtx = new AudioContext();
let source, analyser;
let dataArray = new Uint8Array(120).fill(0);
let randomData = Uint8Array.from(new Uint8Array(120), (_, k) => k).sort(
  () => Math.random() - 0.5
);
let effectCtx;
/**
 *
 * @param {HTMLElement} element
 * @param {CanvasPath} cvs
 */

export function init(element, cvs) {
  //初始化cvs
  effectCtx = cvs.getContext("2d");
  cvs.width = 300 * devicePixelRatio;
  cvs.height = 300 * devicePixelRatio;

  draw(true);

  element.addEventListener("play", _init);
  function _init() {
    if (isInit) {
      return;
    }
    const _s = audioCtx.createMediaElementSource(element);
    source = _s;
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    isInit = true;

    draw(false);
  }
}

//请求一次音频分析数据
function _requestData() {
  analyser.getByteFrequencyData(dataArray);
}
//绘制函数
export function draw(isFirstDraw = false) {
  if (!isInit) {
    return;
  }
  window.requestAnimationFrame(draw);
  if (isFirstDraw) {
    _render(new Uint8Array(120).fill(0));
  } else {
    //进行一次分析
    console.log('frane')
    _requestData();
    console.log(dataArray)
    //进行绘制
    _render(dataArray);
    //请求
   
  }
  //渲染函数
  function _render(dataArray) {
    let byteFrequencyData = dataArray.slice(0, 120);
    effectCtx.clearRect(0, 0, effectCtx.width, effectCtx.height);
    const bData = [];
    randomData.forEach((index) => {
      bData.push(byteFrequencyData[index]);
    });
    const angle = (Math.PI * 2) / bData.length;
    effectCtx.fillStyle = "fff";
    effectCtx.save();
    effectCtx.translate(effectCtx.width / 2, effectCtx.height / 2);

    bData.forEach((value, index) => {
      effectCtx.save();
      effectCtx.rotate(angle * index);
      effectCtx.beginPath();
      const h = Math.max(4, (value / 256) * 60); // 确保高度至少为4
      effectCtx.roundRect(-4, 140, 4, h, 4); // 宽度调整为8以适应可能的圆角
      effectCtx.fill();
      effectCtx.restore();
    });

    effectCtx.restore();
  }
}
