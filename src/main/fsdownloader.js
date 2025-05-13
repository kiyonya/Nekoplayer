const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');
export class FileDownloader extends EventEmitter {
  constructor(concurrency = 3) {
    super();
    this.concurrency = concurrency; // 并发任务数量
    this.tasks = new Map(); // 存储所有任务
    this.activeTasks = 0; // 当前正在运行的任务数量
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
   * @returns {string} - 返回任务的 UUID
   */
  addTask(url, savePath, fileName, onProgress, onSuccess, onError) {
    const taskId = this.generateUUID(); // 生成任务 UUID
    const filePath = path.join(savePath, fileName); // 完整的文件路径

    // 将任务添加到任务列表
    this.tasks.set(taskId, {
      id: taskId,
      url,
      filePath,
      onProgress,
      onSuccess,
      onError,
      status: 'pending', // 任务状态：pending, downloading, completed, failed
    });

    // 尝试启动任务
    this.runNextTask();

    return taskId;
  }

  /**
   * 启动下一个任务
   */
  runNextTask() {
    if (this.activeTasks >= this.concurrency) return; // 达到并发限制

    // 找到下一个待处理的任务
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
    const { id, url, filePath, onProgress, onSuccess, onError } = task;

    try {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });

      // 确保保存路径存在
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const writer = fs.createWriteStream(filePath);
      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;

      response.data.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = (downloadedSize / totalSize) * 100;
        if (onProgress) onProgress(progress); // 调用进度回调
      });

      response.data.pipe(writer);

      writer.on('finish', () => {
        this.activeTasks--;
        task.status = 'completed';
        if (onSuccess) onSuccess(filePath); // 调用成功回调
        this.runNextTask(); // 启动下一个任务
      });

      writer.on('error', (err) => {
        this.activeTasks--;
        task.status = 'failed';
        if (onError) onError(err); // 调用失败回调
        this.runNextTask(); // 启动下一个任务
      });
    } catch (err) {
      this.activeTasks--;
      task.status = 'failed';
      if (onError) onError(err); // 调用失败回调
      this.runNextTask(); // 启动下一个任务
    }
  }

  /**
   * 列出所有任务
   * @returns {Array} - 返回所有任务列表
   */
  listTasks() {
    return [...this.tasks.values()];
  }
}
