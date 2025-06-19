import { isRef } from "vue";

export function joinArtist(array) {
  let s = [];
  for (let item in array) {
    s.push(array[item].name);
  }
  return s.join(" / ");
}
/**
 * 格式化播放量
 * 1w以内返回原数 1w~10**8返回万 ++返回亿
 * @param {number} number
 * @returns {string}
 */
export function formatNumber(number) {
  if (number < 10 ** 4) {
    return number.toString();
  } else if (number >= 10 ** 4 && number < 10 ** 8) {
    return (number / 10 ** 4).toFixed(1) + "万";
  } else if (number >= 10 ** 8) {
    return (number / 10 ** 8).toFixed(1) + "亿";
  }
}

export function formatBytes(number) {
  if (number > 1024 ** 3) {
    return Math.round(number / 1024 ** 3) + "GB";
  } else if (number > 1024 ** 2) {
    return Math.round(number / 1024 ** 2) + "MB";
  } else return Math.round(number / 1024) + "KB";
}

let ob = new IntersectionObserver((entries) => {
  setTimeout(() => {
    entries.forEach((item) => {
      if (item.isIntersecting) {
        item.target.src = item.target.dataset.src;
        item.target.style.opacity = 1
        ob.unobserve(item.target);
      }
    });
  }, 0);
});
export { ob };

export function imgUrlDecoder(url) {
  const urlObj = new URL(url);
  console.log(urlObj.search);
  return urlObj.protocol + "//" + urlObj.host + urlObj.pathname;
}

export function downloader(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = () => {
    if (xhr.status === 200) {
      const link = document.createElement("a");
      link.download = "filename"
      link.href = URL.createObjectURL(xhr.response);
      link.click();
    }
  };
  xhr.onprogress = (event) => {
    console.log(Math.round(event.loaded / event.total) + "%" + "\t");
  };
  xhr.send();
}

/**
 * 切换函数
 * @param {Boolean} item 
 */
export function toggle(item){
  console.log(item)
  if(isRef(item)){
    item.value = !item.value
  }
  else{
    item = !item
  }
}

export function s2mmss(seconds) {
  const intSeconds = Math.floor(seconds);
  const decimalSeconds = seconds - intSeconds;
  const minutes = Math.floor(intSeconds / 60);
  const remainingSeconds = intSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
