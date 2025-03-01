export function formatSecond(seconds) {
  if(seconds){seconds = seconds.toFixed(0)}
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return minutes.toString().padStart(2,'0') + ":" + remainingSeconds.toString().padStart(2,'0');
}

export function getDate(timestamp) {
  const dates = new Date(timestamp);
  return `${dates.getFullYear()}年${dates.getMonth() + 1}月${dates.getDate()}日`;
}

export function mmss(milliseconds) {  
  let seconds = Math.floor(milliseconds / 1000);  
  let minutes = Math.floor(seconds / 60);  
  seconds = seconds % 60;  
  minutes = minutes.toString().padStart(2, '0');  
  seconds = seconds.toString().padStart(2, '0');  
  return `${minutes}:${seconds}`;  
}  

export function formatDuration(seconds) {  
   // 将秒数转换为小时  
   const h = Math.floor(seconds / 3600);  
   // 剩余的秒数（去掉已经转换为小时的部分）  
   const remainingSeconds = seconds % 3600;  
   // 将剩余的秒数转换为分钟  
   const m = Math.floor(remainingSeconds / 60);  
   // 剩余的秒数（去掉已经转换为分钟的部分）  
   const s = remainingSeconds % 60;  
   
   // 使用padStart确保小时、分钟和秒都是两位数  
   const paddedH = h.toString().padStart(2, '0');  
   const paddedM = m.toString().padStart(2, '0');  
   const paddedS = s.toString().padStart(2, '0');  
   
   // 格式化输出  
   return `总时长：${paddedH}小时${paddedM}分钟${paddedS}秒`; 
}  