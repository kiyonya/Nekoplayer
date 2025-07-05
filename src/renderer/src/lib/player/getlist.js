
import { getProgramDetail } from "@/api/program";
import { getSongDetial } from "@/api/song";
import { localMusic, player } from "@/main";

function getDetail(ids) {
    return getSongDetial(ids.join(","));
}

const cacheMap = new Map();
const pendingRequests = new Map(); // Track pending requests by ID

/**
 * Processes a list of songs, fetches details in batches, and caches the results
 * @param {Array} listArray - Array of song objects (must have id and source.type properties)
 * @param {Number} batchSize - Batch size for network requests (default: 20)
 * @returns {Promise<Map>} - Returns the cacheMap with all fetched details
 */

/**
 * 
 * @param {Array} listIds 
 */
export async function getList(listIds){
    
    let time = Date.now()
    const uncached = listIds.filter(i=>!cacheMap.has(i.id))
    const ncmSongs = uncached.filter(i => i?.source?.type !== "localgroup").map(i => i.id);
    const localSongs = uncached.filter(i => i?.source?.type === "localgroup").map(i => i.id);
    const voiceSongs = uncached.filter(i=>i?.source?.type === "voicelist").map(i=>i.id)
    ncmSongs.length > 0 && await processNcmSongs(ncmSongs, 100, time);
    localSongs.length > 0 && await processLocalSongs(localSongs, time);
    voiceSongs.length > 0 && await processNcmVoice(voiceSongs,1)
    let result = []
    for(let id of listIds.map(i=>i.id)){
        result.push(cacheMap.get(id))
    }

    if(cacheMap.size > 200){
        cacheMap.clear()
    }

    return result
}

async function processNcmSongs(ids, batchSize = 100, timestamp) {
    for(let i = 0;i < ids.length;i += batchSize){
        const batch = ids.slice(i,i+batchSize)
        const detials = (await getDetail(batch))?.songs || []
        for(let song of detials){
            cacheMap.set(song?.id,song)
        }
    }
}
async function processNcmVoice(ids,batchSize = 1) {
    ids = ids.map(id=>getProgramDetail(id))
    let datas = (await Promise.all(ids)).map(i=>{
        return {
            name:i?.program?.mainSong?.name,
            al: {
                picUrl:i?.program?.coverUrl
            },
            ar: i?.program?.mainSong?.artists,
            local:false,
            voice:true,
            id:i?.program?.id
        }
    })
    for(let song of datas){
        cacheMap.set(song?.id,song)
    }
}
async function processLocalSongs(ids, timestamp) {
    
    if (ids.length === 0) return;
    const localMap = new Map();
    for (const md5 of ids) {
        const quick = player.quickPlayAudios?.[md5];
        if (quick) {
            const cover = URL.createObjectURL(new Blob([quick?.cover],{type:"image/jpg"}))
            localMap.set(md5, {
                ...quick,
                cover
            });
        }
    }
    const remainingIds = ids.filter(md5 => !localMap.has(md5));
    if (remainingIds.length > 0) {
        try {
            const localData = await localMusic.getSongsDataByMd5(remainingIds);
            console.log(localData)
            for (const item of localData) {
                if (item?.md5 && !localMap.has(item.md5)) {
                    localMap.set(item.md5, item.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch local songs:', error);
        }
    }
    console.log(localMap)
    for (const [md5, data] of localMap) {
        cacheMap.set(md5, { ...data, time: timestamp });
    }
}
