

export default {
  setAppInfo(state,value){
    state.appInfo = value
  },
  isLogin(state,value){
    state.isLogin = value
  },
  setDeviceScreenSize(state,value){
    state.deviceScreenSize = value
  },
  updatePlayerData(state, { key, value }) {
    state.playerData[key] = value
  },
  updateMusicInfo(state,value){
    state.musicInfo = value
  },
  updateLyric(state,value){
    state.lyric = value
  },
  updateNowPlaylingSource(state,value){
    state.nowPlayingSource = value
  },
  updateNowPlayingDynamicCover(state,value){
    state.nowPlayingDynamicCover = value
  },
  updatePersonalFM(state,value){
    state.personalFM = value
  },
  updateAudioState(state,{key,value}){
    state.audioState[key] = value
  },
  updatePlayerState(state,{key,value}){
    state.playerState[key] = value
  },
  commitLikeList(state,value){
    state.likeList = value
  },
  changeLikeList(state,action,id){
    if(action === "add"){
      state.likeList.add(id)
    }
    else if(action === "del"){
      state.likeList.delete(id)
    }
  },
  updateMusicResource(state,value){
    state.musicResource = value
  },
  updateAudioStatus(state,{key,value}){
    state.audioStatus[key] = value
  },

  showPlayer(state,value){
    state.showPlayer = value
  },
  showPlaylistBar(state,value){
    state.showPlaylistBar = value
  },
  showEqualizer(state,value){
    if(typeof value !== 'boolean'){return}
    state.showEqualizer = value
  },
  showLoginWindow(state,value){
    state.showLoginWindow = value
  },
  updateLocalMusicPath(state,value){
    state.localMusicPath = value  
  },

  updateCookie(state,value){
    state.cookie = value;
  },
  updateProfile(state,value){
    state.profile = value
    //localStorage.setItem("neko_user_profile",JSON.stringify(value))
  },
  updateLoginStatus(state,value){
    state.loginStatus = value
    //localStorage.setItem('loginStatus',JSON.stringify(value))
  },
  updateTheme(state,{key,value}){
    state.theme[key] = value
  },
  updateEqualizerGains(state,value){
    state.equalizerData.equalizerGains = value
  },
  updateEqualizerQuality(state,value){
    state.equalizerData.equalizerQuality = value
  },
  config(state,{key,value}){
    state.config[key] = value
  },
  updateShortcut(state,{key,type,value}){
    state.config.shortcut[key][type] = value
  },
  updateWallpaper(state,{key,value}){
    state.config.wallpaper[key] = value
  },
  updateUserPlaylist(state,value){
    state.userPlaylist = value
  },
  saveScroll(state,key){
    state.viewScrollY[key] = state.scrollY || 0
    state.scrollY = 0
    return state.viewScrollY[key]
  },
  updateScroll(state,value){
    state.scrollY = value
  },
  updateBloomColor(state,value){
    state.bloomColor = value
  },
}
