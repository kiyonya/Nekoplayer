const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');
const id3 = require('node-id3')

export class FileDownloader extends EventEmitter {
  constructor(concurrency = 3) {
    super();
    this.concurrency = concurrency; // 并发任务数量
    this.tasks = new Map(); // 存储所有任务
    this.activeTasks = 0; // 当前正在运行的任务数量
    this.paused = false; // 全局暂停状态
  }

  setConcurrency(value) {
    this.concurrency = value;
    this.runNextTask();
  }

  generateUUID() {
    return crypto.randomUUID();
  }

  /**
   * 添加下载任务
   * @param {string} url - 下载文件的 URL
   * @param {string} savePath - 文件保存路径
   * @param {string} fileName - 文件名
   * @param {function} onProgress - 进度回调函数
   * @param {function} onSuccess - 成功回调函数
   * @param {function} onError - 失败回调函数
   * @param {object} exdata - 额外数据
   * @returns {string} - 返回任务的 UUID
   */
  addTask(url, savePath, fileName, onProgress, onSuccess, onError, exdata = {}) {
    const taskId = this.generateUUID();
    const filePath = path.join(savePath, fileName);
    
    this.tasks.set(taskId, {
      id: taskId,
      url,
      filePath,
      onProgress,
      onSuccess,
      onError,
      status: 'pending',
      progress: 0,
      speed: 0,
      downloadedSize: 0,
      totalSize: 0,
      fileName,
      exdata,
      lastUpdateTime: Date.now(),
      lastDownloadedSize: 0,
      responseStream: null,
      writerStream: null
    });
    
    this.runNextTask();
    return taskId;
  }

  /**
   * 启动下一个任务
   */
  runNextTask() {
    if (this.paused || this.activeTasks >= this.concurrency) return;
    
    const nextTask = [...this.tasks.values()].find(
      (task) => task.status === 'pending',
    );
    
    if (nextTask) {
      this.activeTasks++;
      nextTask.status = 'downloading';
      this.downloadFile(nextTask);
    }
  }

  /**
   * 下载文件
   * @param {object} task - 任务对象
   */
  async downloadFile(task) {
    const { id, url, filePath, onProgress, onSuccess, onError, exdata } = task;
    
    try {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });
      
      task.responseStream = response.data;
      
      
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const writer = fs.createWriteStream(filePath);
      task.writerStream = writer;
      
      task.totalSize = parseInt(response.headers['content-length'], 10);
      task.downloadedSize = 0;
      task.lastDownloadedSize = 0;
      task.lastUpdateTime = Date.now();
      
      // 更新下载速度和进度的定时器
      const speedUpdateInterval = setInterval(() => {
        const now = Date.now();
        const timeDiff = (now - task.lastUpdateTime) / 1000;
        const downloadedDiff = task.downloadedSize - task.lastDownloadedSize;
        
        if (timeDiff > 0) {
          task.speed = downloadedDiff / timeDiff;
        }
        
        task.lastUpdateTime = now;
        task.lastDownloadedSize = task.downloadedSize;
        
        this.emit('progress', {
          id: task.id,
          progress: task.progress,
          speed: task.speed,
          downloadedSize: task.downloadedSize,
          totalSize: task.totalSize
        });
      }, 500);
      
      response.data.on('data', (chunk) => {
        task.downloadedSize += chunk.length;
        task.progress = (task.downloadedSize / task.totalSize) * 100;
        if (onProgress) onProgress(task.progress);
      });
      
      response.data.pipe(writer);
      
      writer.on('finish', () => {
        clearInterval(speedUpdateInterval);
        this.finishTask(task, filePath, exdata, onSuccess);
      });
      
      writer.on('error', (err) => {
        clearInterval(speedUpdateInterval);
        this.failTask(task, err, onError);
      });
      
      response.data.on('error', (err) => {
        clearInterval(speedUpdateInterval);
        this.failTask(task, err, onError);
      });
      
    } catch (err) {
      this.failTask(task, err, onError);
    }
  }

  /**
   * 完成任务
   */
  finishTask(task, filePath, exdata, onSuccess) {
    this.activeTasks--;
    task.status = 'completed';
    task.speed = 0;
    this.cleanupTaskStreams(task);
    
    if (onSuccess) onSuccess(filePath);
    if (exdata && exdata.ncm) {
      Id3Builder(filePath, exdata);
    }
    
    this.runNextTask();
    this.emit('complete', task.id);
  }

  /**
   * 任务失败处理
   */
  failTask(task, err, onError) {
    this.activeTasks--;
    task.status = 'failed';
    task.speed = 0;
    this.cleanupTaskStreams(task);
    
    if (onError) onError(err);
    this.runNextTask();
    this.emit('error', { id: task.id, error: err });
  }

  /**
   * 清理任务流
   */
  cleanupTaskStreams(task) {
    if (task.responseStream) {
      task.responseStream.destroy();
      task.responseStream = null;
    }
    if (task.writerStream) {
      task.writerStream.end();
      task.writerStream = null;
    }
  }

  /**
   * 暂停单个任务
   * @param {string} taskId - 要暂停的任务ID
   * @returns {boolean} - 是否成功暂停
   */
  pauseTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'downloading') {
      return false;
    }
    
    task.responseStream.unpipe(task.writerStream)
    task.responseStream.pause()
    task.status = 'paused';
    this.activeTasks--;
    this.runNextTask();
    this.emit('paused', taskId);
    return true;
  }

  /**
   * 恢复单个任务
   * @param {string} taskId - 要恢复的任务ID
   * @returns {boolean} - 是否成功恢复
   */
  resumeTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'paused') {
      return false;
    }
    task.responseStream.pipe(task.writerStream)
    task.responseStream.resume()
    task.status = 'downloading';
    this.runNextTask();
    this.emit('resumed', taskId);
    return true;
  }

  /**
   * 暂停所有任务
   */
  pauseAll() {
    if (this.paused) return;
    
    this.paused = true;
    const pausedTasks = [];
    
    for (const [taskId, task] of this.tasks) {
      if (task.status === 'downloading') {
        this.pauseTask(taskId);
        pausedTasks.push(taskId);
      }
    }
    
    this.emit('allPaused', pausedTasks);
  }

  /**
   * 恢复所有任务
   */
  resumeAll() {
    if (!this.paused) return;
    
    this.paused = false;
    const resumedTasks = [];
    
    for (const [taskId, task] of this.tasks) {
      if (task.status === 'paused') {
        this.resumeTask(taskId);
        resumedTasks.push(taskId);
      }
    }
    
    this.emit('allResumed', resumedTasks);
  }

  /**
   * 获取任务状态
   * @returns {Array} - 所有任务状态数组
   */
  getTasksStatus() {
    return [...this.tasks.values()].map(task => ({
      id: task.id,
      url: task.url,
      filePath: task.filePath,
      fileName: task.fileName,
      status: task.status,
      progress: task.progress,
      speed: task.speed,
      downloadedSize: task.downloadedSize,
      totalSize: task.totalSize,
      speedReadable: task.speed,
      exdata: task.exdata
    }));
  }
  /**
   * 取消任务
   * @param {string} taskId - 要取消的任务ID
   * @returns {boolean} - 是否成功取消
   */
  cancelTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    this.cleanupTaskStreams(task);
    // 尝试删除已下载的部分文件
    try {
      if (fs.existsSync(task.filePath)) {
        fs.unlinkSync(task.filePath);
      }
    } catch (err) {
      console.error(`Failed to delete file: ${task.filePath}`, err);
    }
    
    this.tasks.delete(taskId);
    if (task.status === 'downloading') {
      this.activeTasks--;
      this.runNextTask();
    }
    
    this.emit('canceled', taskId);
    return true;
  }
}

async function Id3Builder(filepath,exdata){
  if(!exdata.ncm || !fs.existsSync(filepath) || exdata.format !== "mp3"){return}
  const {cover,title,artist,album} = exdata
  const coverBuffer = Buffer.from(await (await fetch(cover) ).arrayBuffer())
  const tags = {
    APIC:coverBuffer,
    album,
    artist,
    title
  }
  return id3.Promise.write(tags,filepath)
}