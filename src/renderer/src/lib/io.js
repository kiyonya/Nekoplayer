

const fs = require('node:fs')
const path = require('path')
export function fileIO() {
  return {
    read(filepath) {}
  }
}

export function readFileIterated(dir, opt = {}) {
  let files = []
  let extendNameFilter = opt.extendNameFilter || '*'
  function _read(pth) {
    const items = fs.readdirSync(pth)
    items.forEach((file) => {
      const fullpath = path.join(pth, file)
      const stats = fs.statSync(fullpath)
      if (stats.isDirectory()) {
        _read(fullpath)
      } else if (stats.isFile()) {
        if (extendNameFilter !== '*') {
          const ext = path.extname(file).substring(1)
          if (extendNameFilter.includes(ext)) {
            files.push(fullpath)
          }
        } else {
          files.push(fullpath)
        }
      }
    })
  }
  _read(dir)
  return files
}
