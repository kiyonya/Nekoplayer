import { defaultAudioStatus, defaultConfig, defaultEqualizerData, defaultPlayerData } from './default'

export default {
  appInfo:{},
  isLogin:false,
  equalizerData: JSON.parse(localStorage.getItem('neko_equalizerData')) || defaultEqualizerData,
  config: JSON.parse(localStorage.getItem('neko_config')) || defaultConfig,
  audioStatus:JSON.parse(localStorage.getItem('neko_audioStatus')) || defaultAudioStatus,
  localMusicPath:JSON.parse(localStorage.getItem('neko_localMusicPath')) ,
  theme:JSON.parse(localStorage.getItem('neko_app_theme')) || 
  {
    color:"default:follow",
    computedColor:'light',
    backgroundMode:'none',
    backgroundImage:null,
    backgroundImageFit:'cover',
    backgroundImageOpacity:0.3,
    backgroundImageBlur:0,
    
    backgroundImageBrightness:1,
    backgroundImageSaturate:1,
    bloomColor:undefined,
    font:'system-ui'
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
  listentogetherRoomDetial:{}
}
