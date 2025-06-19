import Mousetrap from "mousetrap";
import { store } from "@/store";
import { computed } from "vue";
import { player } from "@/main";
import { showMessageNotification } from "@/components/notification/use_notification";
const hotKey = computed(()=>{
    return store.state.config.hotKey
})
export async function registeAppHotkey() {
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