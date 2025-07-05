# Desktop Player API 文档
## 概述
所有的方法都定义在 window.api 上 例如 
window.api.onTimeUpdate((currentTime)=>{

})
事件监听器采用传入回调的方式 所有监听器的返回结果都是取消监听函数
部分情况导致api注册失败 请判断window上是否注册成功
## 事件监听 API
### `onListUpdate`
- **描述**: 监听播放列表更新事件
- **参数**:
  - `callback`: 回调函数，接收更新后的播放列表
- **返回**: 取消监听函数

### `onTimeUpdate`
- **描述**: 监听播放时间更新事件
- **参数**:
  - `callback`: 回调函数，接收当前播放时间
- **返回**: 取消监听函数

### `onLyricUpdate`
- **描述**: 监听歌词更新事件
- **参数**:
  - `callback`: 回调函数，接收歌词数据
- **返回**: 取消监听函数

### `onNowPlayingUpdate`
- **描述**: 监听当前播放歌曲更新事件
- **参数**:
  - `callback`: 回调函数，接收当前播放歌曲信息
- **返回**: 取消监听函数

### `onStateUpdate`
- **描述**: 监听播放状态更新事件
- **参数**:
  - `callback`: 回调函数，接收播放状态
- **返回**: 取消监听函数

### `onPlaymodeChange`
- **描述**: 监听播放模式变更事件
- **参数**:
  - `callback`: 回调函数，接收新的播放模式
- **返回**: 取消监听函数

### `onVolumeChange`
- **描述**: 监听音量变更事件
- **参数**:
  - `callback`: 回调函数，接收新的音量值
- **返回**: 取消监听函数

### `onCanPlay`
- **描述**: 监听可以播放事件
- **参数**:
  - `callback`: 回调函数，接收相关数据
- **返回**: 取消监听函数

## 控制 API

### `togglePlay`
- **描述**: 切换播放/暂停状态
- **参数**: 无

### `resize`
- **描述**: 调整窗口大小
- **参数**:
  - `w`: 宽度
  - `h`: 高度

### `previous`
- **描述**: 播放上一首
- **参数**: 无

### `next`
- **描述**: 播放下一首
- **参数**: 无

### `seek`
- **描述**: 跳转到指定时间
- **参数**:
  - `time`: 要跳转的时间(秒)

### `playSong`
- **描述**: 播放指定歌曲
- **参数**:
  - `id`: 歌曲ID
  - `source`: 歌曲来源

### `getSongListDetail`
- **描述**: 获取歌曲列表详情
- **参数**:
  - `ids`: 歌曲ID数组
- **返回**: Promise，解析为歌曲列表详情

### `close`
- **描述**: 关闭桌面播放器
- **参数**: 无

### `changeVolume`
- **描述**: 改变音量
- **参数**:
  - `v`: 音量值(0-1)

### `changePlayMode`
- **描述**: 改变播放模式
- **参数**:
  - `m`: 播放模式标识


# 播放器主题配置文件
## 概述
每个播放器都必须包含pack.json文件 标明名称作者以及入口文件

## 基础信息字段

### `name`
- **类型**: 字符串
- **描述**: 主题名称
- **示例**: `"NEKOPLAYER经典"`

### `author`
- **类型**: 字符串
- **描述**: 主题作者
- **示例**: `"kiyuu"`

### `version`
- **类型**: 字符串
- **描述**: 主题版本号
- **示例**: `"0.3.5"`

### `icon`
- **类型**: 字符串
- **描述**: 主题图标文件路径
- **示例**: `"icon.png"`

### `description`
- **类型**: 字符串
- **描述**: 主题简短描述
- **示例**: `"默认的播放器样式，提供基本功能"`

## 主题展示字段

### `thumbnail`
- **类型**: 数组
- **描述**: 主题预览图路径数组
- **示例**: `[]` (空数组表示无预览图)

## 开发模式配置

### `devMode`
- **类型**: 布尔值
- **描述**: 是否启用开发模式，注意，当开发模式启动时 入口文件会失效，程序会显示本地对应端口的页面，默认为localhost:9090 您可以在devOptions字段里设置port来修改，记住在完成开发之后记得关闭devMode
- **默认值**: `false`

### `devOptions`
- **类型**: 对象
- **描述**: 开发模式配置选项
- **子字段**:
  - `port`: 开发服务器端口号 (示例: `9090`)
  - `devTool`: 是否自动打开开发者工具 (示例: `true`)

## 主题入口配置

### `entry`
- **类型**: 字符串
- **描述**: 主题入口HTML文件路径，入口文件需要为html文件，例如如果您使用vue，入口文件应当是index.html
- **示例**: `"index.html"`

## Electron 窗口配置

### `electronWindowOptions`
- **类型**: 对象
- **描述**: Electron 浏览器窗口的配置选项
- **子字段**:
  - `width`: 窗口初始宽度 (像素)
  - `height`: 窗口初始高度 (像素)
  - `resizable`: 窗口是否可调整大小
  - `show`: 创建后是否立即显示窗口
  - `frame`: 是否显示窗口边框/框架
  - `autoHideMenuBar`: 是否自动隐藏菜单栏
  - `transparent`: 窗口是否透明

## 示例配置
```json
{
  "name": "NEKOPLAYER经典",
  "author": "kiyuu",
  "version": "0.3.5",
  "icon": "icon.png",
  "description": "默认的播放器样式，提供基本功能",
  "thumbnail": [],
  "devMode": false,
  "devOptions": {
    "port": 9090,
    "devTool": true
  },
  "entry": "index.html",
  "electronWindowOptions": {
    "width": 420,
    "height": 150,
    "resizable": false,
    "show": false,
    "frame": false,
    "autoHideMenuBar": true,
    "transparent": true
  }
}
```