export function send(namespace,payload){
    localStorage.setItem('@'+namespace,JSON.stringify({payload,timestamp:Date.now()}))
}
export function listen(handler){
    const storageHandler = e=>{
        const data = JSON.parse(e.newValue)
        handler(e.key.substring(1),data.payload)
    }
    window.addEventListener('storage',storageHandler)
    return ()=>{window.removeEventListener('storage',storageHandler)}
}