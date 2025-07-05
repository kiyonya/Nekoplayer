import Mousetrap from "mousetrap";
import { store } from "@/store";
import { computed } from "vue";
import { player } from "@/main";
import { showMessageNotification } from "@/components/notification/use_notification";
const hotKey = computed({
    get:()=>store.state.config.hotKey,
    set:(v)=>store.commit("config",{key:'hotKey',value:v})
})
export async function registeAppHotkey() {
    Mousetrap.reset()
    for(let key of Object.keys(hotKey.value)){
        let value = hotKey.value[key]
        if(value?.app){
            Mousetrap.bind(value?.app,(e)=>{
                handleKey(key)
                return false
            })
        }
    }
}

function handleKey(action){
    if(action === "playlistBar"){
        store.commit("showPlaylistBar")
    }
    else if(action === "next"){
        player.next()
        showMessageNotification("下一首",500)
    }
    else if(action === "previous"){
        player.previous()
         showMessageNotification("上一首",500)
    }
    else if(action === "volumeIncrease"){
        player.setVolume(player.audioManager.audio.volume + 0.1)
    }
    else if(action === "volumeDecrease"){
        player.setVolume(player.audioManager.audio.volume - 0.1)
    }
    else if(action === "playAndPause"){
        player.playOrPause()
    }
    else if(action === 'like'){
        console.log("like is building")
    }
    else if(action === 'eq'){
        store.commit("showEqualizer")
    }
    else if(action === 'player'){
        store.commit("showPlayer")
    }
    else if(action === 'mute'){
        player.toggleMute()
    }
}

export function registeGlobalHotKey(){
    let keys = JSON.parse(JSON.stringify(hotKey.value))
    
    window.electron.ipcRenderer.invoke("app:registeGlobalShortcut",keys)
    
}
window.electron.ipcRenderer.on("key:action",(_,a)=>{
    handleKey(a)
})

export function restoreHotKey(){
    hotKey.value = {playAndPause: { app: 'space', global: 'ctrl+alt+space', name: '播放/暂停' },
    previous: { app: 'left', global: 'ctrl+alt+left', name: '上一首' },
    next: { app: 'right', global: 'ctrl+alt+right', name: '下一首' },
    volumeIncrease: { app: 'up', global: 'ctrl+alt+up', name: '音量加' },
    volumeDecrease: { app: 'down', global: 'ctrl+alt+down', name: '音量减' },
    playlistBar: { app: 'b', global: 'ctrl+alt+p', name: '播放列表' },
    like: { app: 'ctrl+l', global: 'ctrl+alt+l', name: '喜欢' },
    eq: { app: 'ctrl+e', global: 'ctrl+alt+e', name: '均衡器' },
    player: { app: 'p', global: 'ctrl+alt+p', name: '播放页' },
    mute: { app: 'm', global: 'ctrl+alt+m', name: '静音' }}
    registeAppHotkey()
    registeGlobalHotKey()
}