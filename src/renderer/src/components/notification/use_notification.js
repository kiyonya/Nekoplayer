import { createApp } from 'vue'
import SideNotification from './SideNotification.vue'
import MessageNotification from './MessageNotification.vue'
import Confirm from './Confirm.vue'
import InputConfirm from './InputConfirm.vue'
import QuitDialog from './QuitDialog.vue'
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
  return () => {
    app.unmount()
    mountel.remove()
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
    { label: '取消', act: 'no' },
    { label: '确定', act: 'yes', style: 'strong' }
  ]
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
      onCancel: () => {
        app.unmount()
        modelel.remove()
        resolve('canceled')
      }
    })

    document.body.appendChild(modelel)
    app.mount(modelel)
  })
}

export async function showInputConfirmDialog(
  title,
  msg,
  buttons = [
    { label: '取消', act: 'no' },
    { label: '确定', act: 'yes', style: 'strong' }
  ]
) {
  return new Promise((resolve, reject) => {
    const modelel = document.createElement('div')
    let v = '';
    const app = createApp(InputConfirm, {
      title,
      msg,
      buttons,
      onInputValue:(value)=>{
        v = value
      },
      onSelect: (act) => {
        app.unmount()
        modelel.remove()
        resolve({
          act,
          value:v
        })
      },
      onCancel: () => {
        app.unmount()
        modelel.remove()
        resolve('canceled')
      }
    })

    document.body.appendChild(modelel)
    app.mount(modelel)
  })
}
export async function showQuitDialog(
  title = '退出',
  msg,
  buttons = [
    { label: '最小化到托盘', act: 'tray' },
    { label: '最小化窗口', act: 'min' },
    { label: '直接退出', act: 'quit' }
  ]
) {
  return new Promise((resolve, reject) => {
    const modelel = document.createElement('div')
    const app = createApp(QuitDialog, {
      title,
      msg,
      buttons,
      onSelect: (act) => {
        app.unmount()
        modelel.remove()
        resolve(act)
      },
      onCancel: () => {
        app.unmount()
        modelel.remove()
        resolve('canceled')
      },
      onNevershow: (o) => {
        localStorage.setItem('show_quit_dialog', JSON.stringify(o))
      }
    })
    document.body.appendChild(modelel)
    app.mount(modelel)
  })
}
