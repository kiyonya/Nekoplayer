// main.js (主进程)
const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const logDir = path.join(app.getPath('logs'));
const logFile = path.join(logDir, 'main.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log to file:', err);
    }
  });
}
 const logger = {
  debug: (message) => log('debug', message),
  info: (message) => log('info', message),
  warn: (message) => log('warn', message),
  error: (message) => log('error', message),
  fatal: (message) => log('fatal', message)
};
export {logger}