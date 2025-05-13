const fs = require('fs')
const path = require('path')
export async function writeBufferToPath(id,fpath,buffer) {
  const file = path.join(fpath,id + 'cb')
  fs.writeFileSync(file,buffer)
}