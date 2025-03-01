const { default: Dexie } = require("dexie");
const dataCache = new Dexie('dataCache')
dataCache.version(1).stores({
    cahce:"++id,resource,data"
})
dataCache.open().catch(err=>{throw new Error(err)})

export async function cacheData(resource,data){
    try {
        await dataCache.cache.put({})
    } catch (error) {
        
    }
}