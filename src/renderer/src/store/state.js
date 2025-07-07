import { defaultAudioStatus, defaultConfig, defaultEqualizerData, defaultPlayerData } from './default'

export default {
  standBy:false,
  appInfo:{
    version:"0.9.1",
    dev:true
  },
  isLogin:false,
  online:false,
  equalizerData: JSON.parse(localStorage.getItem('neko_equalizerData')) || defaultEqualizerData,
  config:{...defaultConfig,... JSON.parse(localStorage.getItem('neko_config')) || {}},
  audioStatus:JSON.parse(localStorage.getItem('neko_audioStatus')) || defaultAudioStatus,
  localMusicPath:JSON.parse(localStorage.getItem('neko_localMusicPath')) ,
  theme:
  {
    theme:"default:follow",
    color:"default:follow",
    computedColor:'light',
    backgroundMode:'none',
    backgroundImage:null,
    backgroundImageFit:'cover',
    backgroundImageOpacity:0.3,
    backgroundImageBlur:0,
    ui:[133, 141, 255],
    backgroundImageBrightness:1,
    backgroundImageSaturate:1,
    backgroundImageScale:1,
    backgroundVideo:null,
    backgroundVideoScale:1,
    backgroundVideoMute:true,
    backgroundVideoFit:"cover",
    backgroundVideoOpacity:0.6,
    bloomColor:undefined,
    font:'default',
    ...JSON.parse(localStorage.getItem('neko_app_theme')) || {}
  },
  profile:{},
  loginStatus:parseInt(localStorage.getItem('loginStatus') || 1),
  musicInfo: {
    id: 0,
    name: '',
    tns: [],
    alia: [],
    cover: '',
    artist: [],
    album: {},
    duration: 0,
    mv: 0
  },
  nowPlayingDynamicCover:{},
  personalFM:{},
  audioState:{
    ct:0,
    dt:0,
    state:'pause',
    volume:1
  },
  playerState:{
    list:[],
    mode:'list'
  },
  nowPlayingSource:{},
  musicResource: {},
  likeList:new Set(),
  userPlaylist:{},
  deviceScreenSize:0,
  showPlayer:false,
  showPlaylistBar:false,
  showEqualizer:false,
  showLoginWindow:false,
  lyric:[],
  bloomColor:[],
  inListentogetherRoom:false,
  listentogetherRoomDetial:{},
  hotkyDefault:{
    
    playAndPause: { app: 'space', global: 'ctrl+alt+space', name: '播放/暂停' },
    previous: { app: 'left', global: 'ctrl+alt+left', name: '上一首' },
    next: { app: 'right', global: 'ctrl+alt+right', name: '下一首' },
    volumeIncrease: { app: 'up', global: 'ctrl+alt+up', name: '音量加' },
    volumeDecrease: { app: 'down', global: 'ctrl+alt+down', name: '音量减' },
    playlistBar: { app: 'b', global: 'ctrl+alt+p', name: '播放列表' },
    like: { app: 'ctrl+l', global: 'ctrl+alt+l', name: '喜欢' },
    eq: { app: 'ctrl+e', global: 'ctrl+alt+e', name: '均衡器' },
    player: { app: 'p', global: 'ctrl+alt+p', name: '播放页' },
    mute: { app: 'm', global: 'ctrl+alt+m', name: '静音' }
    
  }
}
