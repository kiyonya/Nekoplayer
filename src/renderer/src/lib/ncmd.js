import { getSongDetial, getSongUrl } from "@/api/song";
import { store } from "@/store";
import { computed } from "vue";
const downloadPath = computed(() => store.state.config.downloadPath);
const downloadQuality = computed(() => store.state.config.downloadQuality);
const downloadNamingMethod = computed(() => store.state.config.downloadNamingMethod);

const { FileDownloader } = require("@/utils/downloader");

const filedownloader = new FileDownloader(5);

export async function ncmDownload(id,quality = 'standard'){
    const song = (await getSongDetial(id))?.data?.songs[0];
    const track = await getSongUrl(id,quality);
    const url = track.url;
    console.log(track,downloadPath)
    const namingMethod = downloadNamingMethod.value;
    const savePath = downloadPath.value;
    let name;
    if(namingMethod === 's-ar'){
        name = `${song.name}-${song.ar.map(ar=>ar.name).join(',')}`;
    }
    else if(namingMethod === 's'){
        name = song.name;
    }
    else if(namingMethod === 's-al'){
        name = `${song.name}-${song.al.name}`;
    }
   

}
