
import { ref } from "vue";
import { getUserPlaylist,getUserCollectedMV,getUserCollectedAlbums,getUserRecentListen, getUserRecentListenList, getUserRecentPlaySongs } from "../../api/user";
const playlistCreate = ref([])
const playlistCollect = ref([])
const albums = ref([])
const mvs = ref([])
const recent = ref([])
const loaded = ref(false)
const recentAll = ref([])
export {playlistCollect,playlistCreate,albums,mvs,recent,recentAll,loaded}
export async function load(uid) {
    if(loaded.value){return}
    getUserPlaylist(uid).then(data=>{
        playlistCollect.value = data?.collect
        playlistCreate.value = data?.create
    })
    getUserCollectedAlbums().then(data=>{albums.value = data})
    getUserCollectedMV().then(data=>{mvs.value = data})
    getUserRecentListen(uid,1).then(data=>{
        recent.value = data?.weekData
    })
    getUserRecentPlaySongs(100).then(data=>recentAll.value = data?.data?.list)
    loaded.value = true
} 