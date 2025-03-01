
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const https = require('https')
export class FileDownloader {
  /**
   * 构造函数
   * @param {number} concurrency 并发任务数量
   */
  constructor(concurrency = 3) {
    this.concurrency = concurrency // 并发任务数量
    this.downloadQueue = [] // 下载任务队列
    this.activeDownloads = 0 // 当前正在进行的下载任务数量
    this.downloadTasks = new Map() // 存储所有下载任务的状态
    this.node = typeof process !== 'undefined' && process.versions && process.versions.node;
  }

  /**
   * 下载远程文件并保存到指定路径
   * @param {string} url 远程文件的URL
   * @param {string} savePath 保存文件的本地路径
   * @param {function} onProgress 进度回调函数，接收进度百分比
   * @returns {Promise<void>}
   */
  downloadFile(url, savePath, onProgress) {
    return new Promise((resolve, reject) => {
      const dir = path.dirname(savePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const file = fs.createWriteStream(savePath);
      https.get(url, (response) => {
        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;
        response.pipe(file);
        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          if (onProgress && totalSize ) {
            const percent = Math.round((downloadedSize / totalSize) * 100);
            onProgress(percent);
          }
        });
        response.on('end',()=>{
          if(onProgress){
            onProgress(100)
          }
        })
        file.on('finish', () => {
          file.close();
          resolve();
        });
        file.on('error', (err) => {
          fs.unlinkSync(savePath); // 删除未完成的文件
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * 添加一个下载任务
   * @param {string} url 远程文件的URL
   * @param {string} savePath 保存文件的本地路径
   * @param {function} onProgress 进度回调函数，接收进度百分比
   */
  addTask(url, savePath, onProgress) {
    const taskId = crypto.randomUUID() // 生成一个唯一的任务ID
    // 将任务添加到队列中
    this.downloadQueue.push({ taskId, url, savePath, onProgress })
    // 尝试启动新的下载任务
    this._startNextDownload()

    return taskId // 返回任务ID
  }

  /**
   * 启动下一个下载任务
   */
  _startNextDownload() {
    if (this.activeDownloads >= this.concurrency || this.downloadQueue.length === 0) {
      return // 如果已达到并发限制或队列为空，则返回
    }

    const { taskId, url, savePath, onProgress } = this.downloadQueue.shift() // 从队列中取出任务
    this.activeDownloads++ // 增加正在进行的任务数量

    const task = this.downloadFile(url, savePath, onProgress)
      .then(() => {
        console.log(`Download task ${taskId} completed.`)
      })
      .catch((err) => {
        console.error(`Download task ${taskId} failed:`, err)
      })
      .finally(() => {
        this.activeDownloads-- // 任务完成后减少正在进行的任务数量
        this._startNextDownload() // 尝试启动下一个任务
      })

    this.downloadTasks.set(taskId, task) // 存储任务
  }

  /**
   * 获取所有下载任务的状态
   * @returns {Promise<Array<{taskId: string, status: string}>>}
   */
  async getDownloadTasksStatus() {
    const tasksStatus = []
    for (const [taskId, task] of this.downloadTasks.entries()) {
      const status = await task.then(() => 'completed').catch(() => 'failed')
      tasksStatus.push({ taskId, status })
    }
    return tasksStatus
  }
}