import { dialog } from 'electron'
export async function fsopen(opt) {
  const path = await dialog.showOpenDialog(opt)
  if (!path.canceled) {
    return path.filePaths
  } else {
    return undefined
  }
}
