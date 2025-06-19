import { getLyric } from "@/api/lyric";
import request from "@/utils/request";
export default class Toolkit {
    constructor(){

    }
    async downloadLyric(id,filename = ""){
        const data = await request({
            url: `/lyric?id=${id}`
        })
        const lyric = data.lrc.lyric
        if(lyric){
            const path = await window.api.dialogSaveFile({
                title: '保存歌词',
                filters: [
                    { name: '文本文件', extensions: ['lrc'] }
                ],
                defaultPath: filename
            })
            if(path){
                const buffer = new TextEncoder().encode(lyric)
                const res = await window.api.writeFile(path,buffer)
            }
        }
    }
    async downloadNloLyric(id,filename = ""){
        const nlo = await getLyric(id)
        if(nlo){
            const path = await window.api.dialogSaveFile({
                title: '保存歌词',
                filters: [
                    { name: 'Neko Lyric Object', extensions: ['nlo'] }
                ],
                defaultPath: filename
            })
            if(path){
                const buffer = new TextEncoder().encode(JSON.stringify(nlo))
                const res = await window.api.writeFile(path,buffer)
            }
        }
    }
}