import { computed, watch } from "vue"
import { store } from "@/store"
import { webChannel } from "../webChannel"
const musicInfo = computed(()=>{
    return store.state.musicInfo
})
const wallpaperConfig = computed(()=>{
    return store.state.config.wallpaper
})
export async function initWallpaperApi() {
    const channel = new webChannel('wallpaper')
    channel.listen()
    channel.on('wallpaper:queryMusicInfo',(data,time)=>{
        channel.send('audio:musicInfo',musicInfo.value)
    })
    watch(musicInfo,()=>{
        channel.send('audio:musicInfo',musicInfo.value)
    })
    watch(wallpaperConfig,()=>{
        channel.send('wallpaper:configchange',wallpaperConfig.value)
    },{deep:true})
}