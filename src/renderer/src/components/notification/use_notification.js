import { createApp } from 'vue'
import SideNotification from './SideNotification.vue'
import MessageNotification from './MessageNotification.vue'
import Confirm from './Confirm.vue'
export function showSideNotification(title, content, delay = 2000, clickHandler) {
  const mountel = document.createElement('div')
  const app = createApp(SideNotification, {
    title,
    content,
    onClick() {
      clickHandler &&
        clickHandler(() => {
          app.unmount()
          mountel.remove()
        })
    }
  })
  document.body.appendChild(mountel)
  app.mount(mountel)
  if (delay) {
    setTimeout(() => {
      app.unmount()
      mountel && mountel.remove()
    }, delay)
  }
}

export function showMessageNotification(msg, delay = 1000, clickHandler) {
  const mountel = document.createElement('div')
  const app = createApp(MessageNotification, {
    msg,
    onClick: () => {
      clickHandler &&
        clickHandler(() => {
          app.unmount()
          mountel.remove()
        })
    }
  })
  document.body.appendChild(mountel)
  app.mount(mountel)
  if (delay) {
    setTimeout(() => {
      app.unmount()
      mountel.remove()
    }, delay)
  }
}

export async function showConfirmDialog(
  title,
  msg,
  buttons = [
    { label: '确定', act: 'yes',style:'strong' },
    { label: '取消', act: 'no' }
  ],
) {
  return new Promise((resolve, reject) => {
    const modelel = document.createElement('div')
    const app = createApp(Confirm, {
      title,
      msg,
      buttons,
      onSelect: (act) => {
        app.unmount()
        modelel.remove()
        resolve(act)
      },
      onCancel:()=>{
        app.unmount()
        modelel.remove()
        resolve("canceled")
      }
    })

    document.body.appendChild(modelel)
    app.mount(modelel)
  })
}

window.scd = showConfirmDialog