const cacheMap = new Map();
const cleanupInterval = 30 * 1000; // 1分钟
function cleanupExpired() {
    const now = Date.now();
    for (const [key, entry] of cacheMap.entries()) {
        if (now - entry.time > entry.ttl) {
            cacheMap.delete(key);
        }
    }
}
setInterval(cleanupExpired, cleanupInterval);
export async function cachePlaylistIds(id, ids,detail) {
    const now = Date.now();
    cacheMap.set(id, {
        ttl: ids.length > 1000 ?  60 * 1000 :  30 * 1000,
        time: now,
        data: ids,
        detail
    });
    return true;
}

export async function getPlaylistIds(id) {
    if (!cacheMap.has(id)) return null;
    const entry = cacheMap.get(id);
    if (Date.now() - entry.time > entry.ttl) {
        cacheMap.delete(id);
        return null;
    }
    return {trackIds:entry.data,detail:entry.detail} || {trackIds:null,detail:null};
}

export async function clearPlaylistIds(id){
    if(!cacheMap.has(id)){
        return
    }
    cacheMap.delete(id)
    return true
}

export function clearPlaylistCache(){
    cacheMap.clear()
}