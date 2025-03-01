import { createApp } from "vue"
import SideNotification from "./SideNotification.vue"
import MessageNotification from './MessageNotification.vue'
export function showSideNotification(title,content,delay = 2000,clickHandler){
    const mountel = document.createElement('div')
    const app = createApp(SideNotification,{
        title,content,
        onClick(){
            clickHandler && clickHandler(()=>{
                app.unmount()
                mountel.remove()
            })
        }
    })
    document.body.appendChild(mountel)
    app.mount(mountel)
    if(delay){
        setTimeout(()=>{
            app.unmount()
            mountel && mountel.remove()
        },delay)
    }
}

export function showMessageNotification(msg,delay = 1000,clickHandler){
    const mountel = document.createElement('div')
    const app = createApp(MessageNotification,{
        msg,
        onClick:()=>{
            clickHandler && clickHandler(()=>{
                app.unmount()
                mountel.remove()
            })
        }
    })
    document.body.appendChild(mountel)
    app.mount(mountel)
    if(delay){
        setTimeout(() => {
            app.unmount()
            mountel.remove()
        }, delay);
    }
}
