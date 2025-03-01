const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
export async function fileToMD5(filepath) {
    const buffer = fs.readFileSync(filepath)
    const hash = crypto.createHash('md5');
    hash.update(buffer,'utf8')
    const md5 = hash.digest('hex');
    console.log(md5)
    return md5
}