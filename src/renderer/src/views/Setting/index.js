export async function getLocalFonts() {
    const fonts = await window.queryLocalFonts()
    return fonts
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