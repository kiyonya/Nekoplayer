export function sessionCache(namespace,data){
    sessionStorage.setItem(namespace,JSON.stringify(data))
}
export function sessionGet(namespace){
    return JSON.parse(sessionStorage.getItem(namespace))
}