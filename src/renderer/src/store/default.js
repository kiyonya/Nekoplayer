const defaultPlayerData = {
  list: [],
  order: [],
  mode: 'list',
  randomIndexHistory:[],
  index: 0,
  currentTime: 0
}

const defaultEqualizerData = {
  equalizerFrequency: [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
  equalizerGains: new Array(10).fill(0),
  equalizerQuality: 2,
  equalizerPreset: [
    { name: '自定义', value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: '无', value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: '流行', value: [-1, -1, 0, 2, 4, 4, 2, 1, -1, 1] },
    { name: '舞曲', value: [4, 6, 7, 0, 2, 3, 5, 4, 3, 0] },
    { name: '蓝调', value: [2, 6, 5, 0, -2, -1, 2, 3, 2, 3] },
    { name: '古典', value: [5, 4, 3, 2, -1, -1, 0, 2, 3, 5] },
    { name: '乡村', value: [0, 2, 3, 1, 0, 2, 3, 1, 0, 0] },
    { name: '摇滚', value: [5, 3, 3, 1, 0, -1, 0, 2, 3, 5] },
    { name: 'ACG', value: [4, 6, 4, 0, -1, 2, 5, 1, 2, 4] },
    { name: 'Lo-Fi', value: [-12, -12, -12, -12, -3, 7, 8, 6, 2, -5] },
    { name: '重金属', value: [-2, 5, 4, -2, -2, -2, 2, 3, 1, 4] },
    { name: '国风', value: [4, 2, 2, 0, -1, 4, 5, 1, 1, 3] },
    { name: '说唱', value: [6, 5, 4, -1, -2, 1, 4, 1, 4, 4] },
    { name: '民谣', value: [0, 3, 0, -1, 2, 5, 6, 3, 1, 2] },
    { name: '低音', value: [6, 5, 6, 2, 0, 0, 0, 0, 0, 0] },
    { name: '重低音', value: [6, 6, 8, 2, 0, 0, 0, 0, 0, 0] },
    { name: '低音高音', value: [6, 5, 6, 2, 0, 0, 1, 3, 4, 0] },
    { name: '扬声器', value: [-6, -4, -2, 2, 4, 5, 3, 0, -3, -8] },
    { name: '现场', value: [6, 5, 6, 0, -1, 0, 3, 5, 6, 5] },
    { name: '中音', value: [-2, -3, -3, 0, 1, 5, 3, 2, -1, -2] },
    { name: '柔和', value: [0, 0, 0, 0, 0, 0, 0, -2, -3, 0] },
    { name: '柔和低音', value: [4, 2, 1, 0, 0, 0, 0, -2, -2, -2] },
    { name: '柔和高音', value: [-3, -2, 0, 0, 0, 0, 0, -1, 3, 2] }
  ]
}

const defaultAudioStatus = {
  currentTime:0,
  duration:0,
  volume:1,
  status:"pause",
}

const defaultConfig = {
    audioQuaility:"lossless",
    enalbeEqualizer:true,

  //允许联网匹配
    useMatchLocalFileOnNcm:true,
    //允许本地缓存歌词
    useCacheLocalMusicLyric:true,
    //允许读取本地歌词
    useLocalCacheLyric:true,

    //使用均衡器
    useEQ:true,

    //播放页背景模式
    musicPlayerBackgroundMode:'dynamic',
    //播放页歌词模糊
    musicPlayerLyricBlur:true,
    //播放页歌词辉光
    musicPlayerLyricGlow:true,
    enableDynamicCover:true,
    //快捷键
    shortcut:{
      playAndPause:{app:['space'],global:['ctrl','alt','space'],name:'播放/暂停'},
      previous:{app:['left'],global:['ctrl','alt','left'],name:'上一首'},
      next:{app:['right'],global:['ctrl','alt','down'],name:'下一首'},
      volumeIncrease:{app:['up'],global:['ctrl','alt','up'],name:'音量加'},
      volumeDecrease:{app:['down'],global:['ctrl','alt','down'],name:'音量减'},
      playlistBar:{app:['p'],global:['ctrl','alt','p'],name:'播放列表'},
      like:{app:['ctrl','l'],global:['ctrl','alt','l'],name:'喜欢'},
    },
    useGlobalShortcut:true,
    allowSMTC:true,
    allowScrobble:true,
    shortcutDefault:{
      playAndPause:{app:['space'],global:['ctrl','alt','space'],name:'播放/暂停'},
      previous:{app:['left'],global:['ctrl','alt','left'],name:'上一首'},
      next:{app:['right'],global:['ctrl','alt','down'],name:'下一首'},
      volumeIncrease:{app:['up'],global:['ctrl','alt','up'],name:'音量加'},
      volumeDecrease:{app:['down'],global:['ctrl','alt','down'],name:'音量减'},
      playlistBar:{app:['p'],global:['ctrl','alt','p'],name:'播放列表'},
      like:{app:['ctrl','l'],global:['ctrl','alt','l'],name:'喜欢'},
    },
    //缓存
    allowCache:true,
    cacheConfig:{
      path:null,
      maxsize:2048,
    },
    //下载
    downloadPath:null,
    downloadQuality:'lossless',
    downloadNamingMethods:['s-ar','s','s-al'],
    downloadNamingMethod:'s-ar',
    downloadProcessCount:1,
    //扩展：音乐桌面
    wallpaper:{
      wallpaperBackgroundMode:'fog',
      wallpaperCustomType:'none',
      wallpaperCustomPath:null,
      showTime:'HH:MM',
      showDate:'Day|MM.DD',
    },

    //工具
    //下载器
    toolDownloaderSavePath:''
}









export { defaultPlayerData,defaultEqualizerData,defaultConfig,defaultAudioStatus }
