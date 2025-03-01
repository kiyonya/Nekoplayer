export async function getLocalFonts() {
    const fonts = await window.queryLocalFonts()
    const zhcn = []
    let reg = new RegExp(/[\u4E00-\u9FFF]+/)
    fonts.forEach(font => {
        if(reg.test(font.fullName)){
            zhcn.push(font)
        }
    });
    return zhcn
}
//获取本地可用的音频设备
export async function queryOutputAudioDevice() {
    const devices = await navigator.mediaDevices.enumerateDevices() || []
    let outputs = []
    devices.forEach(d=>{
        if(d.kind === 'audiooutput'){
            outputs.push(d)
        }
    })
    return outputs
}



export function heyWhatsWrong(){
    const tricks = [noGravity,devForAnt,donotTouchMe]
    function noGravity(){
        const ohahahah = document.createElement('style')
        ohahahah.classList.add("ohahahaha")
        ohahahah.innerHTML = `
        html {
        transform:rotate(${Math.random() * 360}deg)
        }
        `
        document.head.appendChild(ohahahah)
        setInterval(() => {
            const style = document.querySelector('style.ohahahaha')
            style.innerHTML = `
            html {
            transform:rotate(${Math.random() * 360}deg)
            }`
        }, 50);
    }
    function devForAnt(){
        document.body.style.transition = '10s'
        document.body.style.transformOrigin = "center center"
        document.body.style.transform = "scale(0)"
    }
    function donotTouchMe(){
        const sensitive = document.createElement('style')
        sensitive.innerHTML = `
        body *:hover{
            display:none
        }
        `
        document.head.appendChild(sensitive)
    }
    const IWILLDO = tricks[Math.floor(Math.random() * tricks.length)]
    
    console.log("我要干坏事了")
    IWILLDO()
}