export function setCookie(cookie){
    localStorage.setItem('@cookie',cookie)
}
export function getCookie(){
    const cookie = localStorage.getItem('@cookie') || ""
    return cookie
}
export function clearCookie(){
    localStorage.removeItem('@cookie')
}