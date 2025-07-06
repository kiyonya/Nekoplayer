<template>
    <div class="page">
        <div class="page-selector">
        </div>
        <div class="common view">
            <h2 class="t">通用</h2>

            <div class="group">
                <div class="profile">
                    <img :src="profile?.avatarUrl" alt="">
                    <div class="info">
                        <h2 class="name">{{ profile?.nickname }}</h2>
                        <span class="sign">{{ profile?.signature }}</span>
                    </div>
                    <button style="margin-left: auto;margin-right: 0;background: var(--strong);color: white;"
                        @click="logout">退出登录</button>
                </div>

            </div>
            <div class="group">
                <div class="r">
                    <div class="t">使用云音乐账号进行个性推荐</div>
                    <Switch v-model="config.useCookiesForPersonalRecommend" />
                </div>
                <div class="r">
                    <div class="t">上传播放记录</div>
                    <Switch v-model="config.allowScrobble" />
                </div>
                <div class="r">
                    <div class="t">本地保存播放记录</div>
                    <Switch v-model="config.savePlaylist"></Switch>
                </div>
            </div>
             <div class="group">
                <div class="r">
                    <div class="t">退出行为</div>
                    <select name="" id="" @change="config = { key: 'exitBehavior', value: $event.target.value }"
                        :value="config.exitBehavior">
                        <option value="close">关闭应用</option>
                        <option value="hide">最小化到托盘</option>
                        <option value="ask">每次询问</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="performance view">
            <h2 class="t">应用外观</h2>
            <div class="group">
                <div class="t">应用主题</div>
                <div class="themes">
                    <div class="theme follow" @click="setTheme({ key: 'theme', value: 'default:follow' })"
                        :class="{ 'ch': theme.theme === 'default:follow' }">
                        <div class="color">
                            <Icon icon="fluent:dark-theme-20-filled"
                                style="font-size: 1.5em;position: absolute;right: 0.5rem;bottom: 0.5rem;mix-blend-mode: difference;" />
                        </div>
                        <span>跟随系统</span>
                    </div>
                    <div class="theme light" @click="setTheme({ key: 'theme', value: 'default:light' })"
                        :class="{ 'ch': theme.theme === 'default:light' }">
                        <div class="color">
                            <Icon icon="tabler:sun"
                                style="font-size: 1.5em;position: absolute;right: 0.5rem;bottom: 0.5rem;color: black;" />
                        </div>
                        <span>浅色模式</span>
                    </div>
                    <div class="theme dark" @click="setTheme({ key: 'theme', value: 'default:dark' })"
                        :class="{ 'ch': theme.theme === 'default:dark' }">
                        <div class="color">
                            <Icon icon="tabler:moon"
                                style="font-size: 1.5em;position: absolute;right: 0.5rem;bottom: 0.5rem;color: white;" />
                        </div>
                        <span>深色模式</span>
                    </div>
                </div>
            </div>
            <div class="group">
                <div class="t">应用配色</div>
                <div class="ur" style="justify-content: left;gap: 1rem;">
                    <div class="color-card" v-for="color in config.themeDefaultUIColors"
                        :style="{ background: `rgb(${color})` }" @click="setTheme({ key: 'ui', value: color })"
                        tabindex="2">

                        <Icon icon="fluent:checkmark-12-regular" class="i"
                            v-if="theme.ui.join(',') == color.join(',')" />
                    </div>
                </div>
                <div class="r">
                    <div class="t">应用字体</div>
                    <select name="" id="" @change="theme = { key: 'font', value: $event.target.value }"
                        :value="theme.font" style="max-width: 10rem;overflow-x: hidden;">
                        <option value="default">默认</option>
                        <option :value="font.postscriptName" v-for="font in zhFonts">{{ font.fullName }}</option>
                    </select>
                </div>
                <div class="r">
                    <div class="t">界面比例</div>
                    <select name="" id="" @change="($event) => { store.commit('setAppZoom', $event.target.value) }"
                        :value="config.appZoomLevel">
                        <option value="-4">-4x</option>
                        <option value="-3">-3x</option>
                        <option value="-2">-2x</option>
                        <option value="-1">-1x</option>
                        <option value="0">默认</option>
                        <option value="1">1x</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                    </select>
                </div>

            </div>
            <div class="group">
                <div class="r">
                    <div class="t">应用背景</div>
                    <select name="" id="" @change="theme = { key: 'backgroundMode', value: $event.target.value }"
                        :value="theme.backgroundMode">
                        <option value="none">无背景</option>
                        <option value="image">图片背景</option>
                        <option value="video">视频背景</option>
                    </select>
                </div>
                <div class="image-preview" v-if="theme.backgroundMode === 'image'">
                    <div class="use-image">
                        <div class="image-shell">
                            <img :src="theme.backgroundImage" alt="" v-if="theme.backgroundMode === 'image'"
                                :style="{ filter: `blur(${theme.backgroundImageBlur}px) brightness(${theme.backgroundImageBrightness}) saturate(${theme.backgroundImageSaturate})`, opacity: theme.backgroundImageOpacity, objectFit: theme.backgroundImageFit, transform: `scale(${theme.backgroundImageScale})` }"
                                @load="getMainColorFromImage($event)" crossorigin="anonymous">
                        </div>
                        <div class="set-image-mode">
                            <button @click="selectImage">选择图片</button>
                            <select name="" id=""
                                @change="theme = { key: 'backgroundImageFit', value: $event.target.value }">
                                <option value="cover">覆盖</option>
                                <option value="contain">包含</option>
                                <option value="fill">填充</option>
                            </select>
                        </div>
                    </div>
                    <div class="image-adjust">
                        <div class="slider">
                            <span>不透明度</span>
                            <VueSlider v-model="theme.backgroundImageOpacity" :min="0.1" :max="1" :interval="0.1"
                                style="flex: 1;" :process-style="{ background: 'var(--strong)' }"></VueSlider>
                        </div>
                        <!-- <div class="slider">
                            <span>饱和度</span>
                            <VueSlider v-model="theme.backgroundImageSaturate" :min="0.5" :max="5" :interval="0.1"
                                style="flex: 1;" :process-style="{ background: 'var(--strong)' }"></VueSlider>
                        </div> -->
                        <div class="slider">
                            <span>明亮度</span>
                            <VueSlider v-model="theme.backgroundImageBrightness" :min="0" :max="1" :interval="0.1"
                                style="flex: 1;" :process-style="{ background: 'var(--strong)' }"></VueSlider>
                        </div>
                        <div class="slider">
                            <span>模糊度</span>
                            <VueSlider v-model="theme.backgroundImageBlur" :min="0" :max="3" :interval="0.1"
                                style="flex: 1;" :process-style="{ background: 'var(--strong)' }"></VueSlider>
                        </div>
                        <div class="slider">
                            <span>图片缩放</span>
                            <VueSlider v-model="theme.backgroundImageScale" :min="0.5" :max="3" :interval="0.1"
                                style="flex: 1;" :process-style="{ background: 'var(--strong)' }"></VueSlider>
                        </div>
                        <div class="main-color-of-image">
                            <div class="custom-color" v-for="color in mainColorOfCustomImage"
                                :style="{ background: `rgb(${color})` }" @click="setTheme({ key: 'ui', value: color })">
                                <Icon icon="fluent:checkmark-12-regular" class="i"
                                    v-if="theme.ui.join(',') == color.join(',')" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="video-preview" v-if="theme.backgroundMode === 'video'">
                    <div class="use-video">
                        <div class="preview">
                            <video v-if="theme.backgroundMode === 'video'" :src="theme.backgroundVideo"
                                :style="{ opacity: theme.backgroundVideoOpacity, objectFit: theme.backgroundVideoFit, transform: `scale(${theme.backgroundVideoScale})` }"
                                autoplay loop muted>
                            </video>
                        </div>
                        <div class="set-video-mode">
                            <button @click="selectVideo">选择视频</button>
                            <select name="" id=""
                                @change="theme = { key: 'backgroundVideoFit', value: $event.target.value }">
                                <option value="cover">覆盖</option>
                                <option value="contain">包含</option>
                                <option value="fill">填充</option>
                            </select>
                        </div>
                    </div>
                    <div class="video-adjust">
                        <div class="slider">
                            <span>不透明度</span>
                            <VueSlider v-model="theme.backgroundVideoOpacity" :min="0.1" :max="1" :interval="0.1"
                                style="flex: 1;" :process-style="{ background: 'var(--strong)' }"></VueSlider>
                        </div>
                        <div class="slider">
                            <span>视频缩放</span>
                            <VueSlider v-model="theme.backgroundVideoScale" :min="0.5" :max="3" :interval="0.1"
                                style="flex: 1;" :process-style="{ background: 'var(--strong)' }"></VueSlider>
                        </div>
                        <div class="slider">
                            <span>视频静音</span>
                        <Switch v-model="theme.backgroundVideoMute" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="audio view">
            <h2 class="t">播放</h2>
            <div class="group">
                <div class="r">
                    <div class="t">音频质量</div>
                    <select name="" id="" @change="config = { key: 'audioQuality', value: $event.target.value }"
                        :value="config.audioQuality">
                        <option value="standard">标准 128kbps</option>
                        <option value="higher">极高 192kbps</option>
                        <option value="exhigh">超高 320kbps</option>
                        <option value="lossless">无损 FLAC</option>
                        <option value="hires">Hi-Res</option>
                        <option value="jyeffect">超清母带</option>
                    </select>
                </div>
                <div class="r">
                    <div class="t">音量均衡</div>
                    <Switch v-model="config.enalbeVolumeBalance"></Switch>
                </div>
                <div class="r">
                    <div class="t">音频淡入淡出</div>
                    <Switch v-model="config.audioFade"></Switch>
                </div>
                <div class="r sub" v-if="config.audioFade">
                    <div class="t">音频淡入淡出时长</div>
                    <VueSlider v-model="config.audioFadeDuration" :min="100" :max="1000" :interval="100"
                        :tooltip-formatter="(t) => (t / 1000) + 's'" :process-style="{ background: 'var(--strong)' }"
                        :tooltip-style="{ background: 'var(--strong)' }" :width="350"></VueSlider>
                </div>

                <div class="r">
                    <div class="t">使用图形均衡器</div>
                    <Switch v-model="config.useEQ"></Switch>
                </div>
                <div class="r">
                    <button @click="store.commit('showEqualizer', true)">打开图形均衡器面板</button>
                </div>
            </div>
        </div>
        <div class="playpage view">
            <h2 class="t">播放页</h2>
            <div class="group">
                <div class="r">
                    <div class="t">播放页背景格式</div>
                    <select name="" id=""
                        @change="config = { key: 'musicPlayerBackgroundMode', value: $event.target.value }"
                        :value="config.musicPlayerBackgroundMode">
                        <option value="color">纯色</option>
                        <option value="image">歌词封面</option>
                        <option value="dynamic">动态封面（高占用）</option>
                    </select>
                </div>
                <div class="r">
                    <div class="t">歌词模糊</div>
                    <Switch v-model="config.musicPlayerLyricBlur"></Switch>
                </div>
                <div class="r">
                    <div class="t">歌词辉光</div>
                    <Switch v-model="config.musicPlayerLyricGlow"></Switch>
                </div>
                <div class="r">
                    <div class="t">播放页封面展示模式</div>
                    <select name="" id=""
                        @change="config = { key: 'playerCoverDisplayType', value: $event.target.value }"
                        :value="config.playerCoverDisplayType">
                        <option value="cover">封面展示</option>
                        <option value="record">唱片机</option>
                        <option value="wave">音频可视化（高占用）</option>
                    </select>
                </div>
                <div class="r sub" v-if="config.playerCoverDisplayType === 'wave'">
                    <div class="t">音频可视化随机混淆</div>
                    <Switch v-model="config.audioVisualizationConfig.randomConfuse"></Switch>
                </div>

            </div>


        </div>
        <div class="file view">
            <h2 class="t">存储</h2>
            <div class="group">
                <div class="r">
                    <div class="t">允许音频缓存</div>
                    <Switch v-model="config.enableCache" />
                </div>
                <div class="r" v-if="config.enableCache">
                    <div class="t">缓存目录</div>
                    <span>{{ config.cachePath }}</span>
                    <button @click.stop="selectCacheFolder">更改缓存目录</button>
                </div>
                <div class="r" v-if="config.enableCache">
                    <div class="t">缓存占用</div>
                    <span>已使用 : {{ (cacheUsage / 1024 / 1024).toFixed(2) }}MB</span>
                    <button @click.stop="clearCache">清除缓存</button>
                </div>
                <div class="r" v-if="config.enableCache">
                    <div class="t">下载目录</div>
                    <span>{{ config.downloadPath }}</span>
                    <button @click.stop="selectDownloadFolder">更改下载目录</button>
                </div>
            </div>
        </div>
        <div class="hotkey view">
            <h2 class="t">快捷键</h2>
            <div class="group">
                <div class="hotkey-tab">
                    <div class="function">
                        <span>功能</span><span>应用快捷键</span><span>全局快捷键</span>
                    </div>
                    <div class="function" v-for="(value, key) in config.hotKey">
                        <span class="name">{{ value?.name }}</span>
                        <input type="text" :value="value.app" :data-key="'app/' + key" @focus="($event) => {
                            let keys = []
                            $event.target.onkeydown = (e) => {
                                e.preventDefault()
                                if (!keys.includes(e.key.toLowerCase())) {
                                    keys.push(e.key.toLowerCase())
                                    $event.target.value = keys.join('+').replace('control', 'ctrl').replace(' ', 'space').replace('arrow', '')
                                }
                            }
                        }" @blur="($event) => {
                            $event.target.onkeydown = null
                            config.hotKey[key].app = $event.target.value
                            registeAppHotkey()
                        }">
                        <input type="text" :value="value.global" :data-key="'global/' + key" @focus="($event) => {
                            let keys = []
                            $event.target.onkeydown = (e) => {
                                e.preventDefault()
                                if (!keys.includes(e.key.toLowerCase())) {
                                    keys.push(e.key.toLowerCase())
                                    $event.target.value = keys.join('+').replace('control', 'ctrl').replace(' ', 'space').replace('arrow', '')
                                }
                            }
                        }" @blur="($event) => {
                            $event.target.onkeydown = null
                            config.hotKey[key].global = $event.target.value
                            registeGlobalHotKey()
                        }">
                    </div>
                </div>
                <div class="r">
                    <button @click="restoreHotKey()">恢复默认</button>
                </div>
            </div>
        </div>
        <div class="plugin view">
            <h2 class="t">插件</h2>
            <div class="group">
                <div class="r">
                    <div class="t">安装的桌面播放器插件</div>
                    <button @click="queryAppPlugin">刷新插件</button>
                    <button @click="openPluginDir">打开插件文件夹</button>
                </div>
                <div class="desktopplayer-plugins g-shell-5" v-if="pluginList?.desktopPlayer?.length">
                    <div class="dp" v-for="plugin in pluginList?.desktopPlayer" :class="{hl:plugin?.packEntryName === config?.desktopPlayerPackName}" @click="config = {key:'desktopPlayerPackName',value:plugin.packEntryName}">
                        <img :src="plugin?.iconUrl" alt="">
                        <h3>{{ plugin?.name }}</h3>
                        <span v-if="plugin?.author">由{{ plugin?.author}}制作</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="about view">
            <h2 class="t">关于</h2>
            <div class="group">
                <span>当前版本 {{ store.state.appInfo.version }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onActivated, ref } from 'vue';
import Switch from '@/components/element/Switch.vue'
import { watch } from 'vue';
import { Icon } from '@iconify/vue';
import { setTheme } from '@/lib/theme';
import { getLocalFonts } from './setting';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { store } from '@/store';
import VueSlider from 'vue-slider-component';
import ColorThief from 'colorthief';
import { onBeforeRouteLeave } from 'vue-router';
import { logout } from '@/api/auth';
import { showConfirmDialog } from '@/components/notification/use_notification';
import { registeAppHotkey, registeGlobalHotKey, restoreHotKey } from '@/lib/hotkey';
import { player } from '@/main';
const profile = computed(() => {
    return store.state.profile
})
const theme = computed({
    get: () => store.state.theme,
    set: ({ key, value }) => {
        store.commit('updateTheme', { key: key, value: value });
        setTheme({ key, value })
    }
})

const zhFonts = ref([])
const mainColorOfCustomImage = ref([])
const cacheUsage = ref(0)
const pluginList = ref({})
let config = computed({
    get: () => store.state.config,
    set: ({ key, value }) => {
        store.commit('config', { key, value })
    }
})
function loadFonts() {
    window.queryLocalFonts().then(fonts => {
        zhFonts.value = fonts
    })
}
async function selectImage() {
    const file = await window.api.dialogOpenFile({
        filters: [
            { name: '图片文件', extensions: ['jpg', 'png', 'gif'] }
        ]
    })
    if (file && file[0]) {
        theme.value = { key: 'backgroundImage', value: file[0].replace(/\\/g, '/') }
    }
}
async function selectVideo() {
    const file = await window.api.dialogOpenFile({
        title:"选择视频",
        filters: [
            { name: '视频文件', extensions: ['mp4', 'avi', 'webm','3gp','wmv','mkv'] }
        ]
    })
    if (file && file[0]) {
        theme.value = { key: 'backgroundVideo', value: file[0].replace(/\\/g, '/') }
    }
}
async function selectCacheFolder() {
    const dir = await window.api.dialogOpenDir({
        title: "选择缓存文件夹",
        defaultPath: config.value.cachePath
    })
    if (dir) {
        let lastDir = config.value.cachePath
        config.value = { key: "cachePath", value: dir }
        getCacheUsage()

        const remove = await showConfirmDialog("修改缓存路径", `您刚刚修改了缓存路径，在之前的路径${lastDir}可能存有很多缓存文件，您可以自己清除或者点击下方清理按钮`, [{
            label: "取消",
            act: 'cancel'
        }, {
            label: "清理",
            act: 'clear',
            style: 'strong'
        }])

        if (remove === 'clear') {
            window.electron.ipcRenderer.invoke("file:clearDir", lastDir)
        }
    }
}
async function selectDownloadFolder() {
    const dir = await window.api.dialogOpenDir({
        title: "选择下载文件夹",
        defaultPath: config.value.downloadPath
    })
    if (dir) {
        config.value = { key: "downloadPath", value: dir }
    }
}
async function getCacheUsage() {
    cacheUsage.value = await window.electron.ipcRenderer.invoke("tool:getFolderSize", config.value?.cachePath)
}
async function getMainColorFromImage(e) {
    const cf = new ColorThief()
    const color = await cf.getPalette(e.target)
    mainColorOfCustomImage.value = color.slice(0, 5)
}
onBeforeRouteLeave((_, __, next) => {
    localStorage.setItem("neko_config", JSON.stringify(config.value))
    console.log("已保存")
    window.webFrame.clearCache()
    next()

})
function clearCache() {
    showConfirmDialog("确定要清除缓存吗", "目录下的文件将被删除，请确保没有其他文件！").then(async choice => {
        if (choice === 'yes') {
            const clear = await window.electron.ipcRenderer.invoke("file:clearDir", config.value?.cachePath)
            getCacheUsage()
            player.clearAudioCache()
        }
        else {
            return
        }
    })
}
async function queryAppPlugin(){
    pluginList.value = await window.electron.ipcRenderer.invoke("plugin:getplugins")
}
async function openPluginDir() {
    const pluginDir = await window.electron.ipcRenderer.invoke("plugin:getpluginDir")
    pluginDir && window.electron.ipcRenderer.send("shell:openExplorer",pluginDir)
}
onActivated(()=>{
    Promise.resolve().then(() => {
        loadFonts()
        getCacheUsage()
        queryAppPlugin()
    })
})
</script>
<style scoped>
.view {
    width: 90%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    gap: 0.6rem;

    .t {
        font-size: 1.8rem;
        color: var(--text-o-1);
    }
}

.view:last-child {
    margin-bottom: 5rem;
}

@keyframes group-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
}

@keyframes clip-cc {
    from {
        clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    }

    to {
        clip-path: none;
    }
}

.group {
    width: 100%;
    height: fit-content;
    background: var(--component-diff);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0.8rem 1rem;
    gap: 0.7rem;
    box-shadow: var(--shadow);
    border-radius: var(--br-1);
    animation: group-in 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
    backdrop-filter: blur(3px);

    .t {
        font-size: 1.1rem;
        font-weight: 600;
    }

    .r {
        display: flex;
        flex-direction: row;
        gap: 1.5rem;
        width: 100%;
        align-items: center;
        min-height: 2rem;
    }

    .r>:nth-child(2) {
        margin-left: auto;
        margin-right: 0;
    }

    .ur {
        display: flex;
        flex-direction: row;
        gap: 1.5rem;
        width: 100%;
        align-items: center;
        min-height: 2rem;
    }

    .sub {
        .t {
            margin-left: 1rem;
            opacity: 0.8;
        }

        .t::before {
            content: " - ";
        }
    }
}

.performance {
    .themes {
        display: flex;
        flex-direction: row;
        gap: 3.5rem;
        height: auto;
        width: fit-content;

    }

    .ch {
        .color {
            outline: var(--strong) 3px solid;
        }

        pointer-events: none;
    }

    .theme {
        width: 6rem;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;

        .color {
            width: 100%;
            height: 4rem;
            border-radius: var(--br-1);
            position: relative;
        }

    }

    .theme:hover .color,
    .used-theme {
        outline: var(--strong) 3px solid;

    }

    .follow .color {
        background: linear-gradient(34deg, black 50%, rgb(255, 255, 255) 50%)
    }

    .light .color {
        background: white
    }

    .dark .color {
        background: black
    }

    .font-preview {
        font-size: 1.5rem;
    }

    .color-card {
        width: 3rem;
        aspect-ratio: 1/1;
        border-radius: 50%;
        color: rgb(255, 141, 168);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .i {
            font-size: 2rem;
            color: var(--text);
        }
    }

    .image-preview {
        display: flex;
        flex-direction: row;
        gap: 2rem;

        .use-image {
            width: fit-content;
            height: fit-content;
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .image-shell {
                width: 16rem;
                height: 10rem;
                overflow: hidden;
                display: flex;
                background-color: var(--ui);
            }

            img {
                width: 100%;
                transform-origin: center center;
                transition: .3s;
            }

            .set-image-mode {
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: space-between;
                gap: 1rem;

                select {
                    min-width: 0;
                    flex: 1;
                }

                button {
                    background: var(--strong);
                }
            }
        }

        .image-adjust {
            display: flex;
            flex-direction: column;
            flex: 0.8;
            font-size: 1rem;
            gap: 1.1rem;

            .slider {
                display: flex;
                flex-direction: row;

                span {
                    width: 5rem;
                }
            }

            .main-color-of-image {
                display: flex;
                flex-direction: row;
                gap: 1.2rem;

                .custom-color {
                    width: 3rem;
                    height: 3rem;
                    display: flex;
                    border-radius: 50%;
                    align-items: center;
                    justify-content: center;
                }

                .i {
                    font-size: 2rem;
                    color: var(--text);
                }
            }
        }
    }

    .video-preview {
        display: flex;
        flex-direction: row;
        gap: 2rem;

        .use-video {
            width: fit-content;
            height: fit-content;
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .preview {
                width: 16rem;
                height: 10rem;
                overflow: hidden;
                display: flex;
                background-color: var(--ui);
            }

            video {
                width: 100%;
                transform-origin: center center;
                transition: .3s;
            }

            .set-video-mode {
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: space-between;
                gap: 1rem;

                select {
                    min-width: 0;
                    flex: 1;
                }

                button {
                    background: var(--strong);
                }
            }
        }

        .video-adjust {
            display: flex;
            flex-direction: column;
            flex: 0.8;
            font-size: 1rem;
            gap: 1.1rem;

            .slider {
                display: flex;
                flex-direction: row;

                span {
                    width: 5rem;
                }
            }
        }
    }
}

select {
    min-width: 15rem;
    width: fit-content;
    max-width: 40rem;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    outline: none;
    padding: 0.5rem 0.7rem;
    border-radius: 0.3rem;
    color: var(--text-color);
    background: var(--ui-dark);
    transition: .3s;
}

select:hover {
    background: var(--hover);
}

select option {
    font-size: 1rem;
}

select:focus {
    outline: 1px solid var(--strong);
}

button {
    background: var(--ui-dark);
    color: var(--text);
    border-radius: 0.3rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    outline: none;
    transition: .3s;
    background-size: auto;
}

.profile {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    width: 25rem;
    box-sizing: border-box;
    padding: 0.8rem;
    border-radius: var(--br-1);

    img {
        width: 4rem;
        height: 4rem;
        aspect-ratio: 1/1;

    }

    &:hover {
        background: var(--hover);
    }

    .sign {
        color: var(--text-o-4);
        font-size: 0.9rem;
    }
}

.hotkey-tab {
    width: 50%;
    min-width: 35rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    .function {
        width: 100%;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        align-items: center;

        input {
            width: 8rem;
            height: 2rem;
            background: var(--component-diff);
            border: 1px solid var(--border);
            outline: none;
            color: var(--text-o-1);
            box-sizing: border-box;
            padding: 0.2rem 0.6rem;
            cursor: pointer;
            font-size: 1.1rem;
            border-radius: var(--br-1);
        }

        input:focus {
            outline: 1px solid var(--strong);
            background: var(--strong);
            color: white;
        }

        input:hover {
            outline: 1.6px solid var(--strong);

        }
    }
}
.desktopplayer-plugins {
    gap: 1rem !important;
    width: 100%;
    .dp {
        width: 10rem;
        height: 10rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--ui);
        border-radius: var(--br-1);
        box-shadow: var(--shadow);
        padding: 0.5rem;

        img {
            width:10rem;
            height: 5rem;
            object-fit: contain;
            border-radius: var(--br-1);
            margin-bottom: 0.5rem;
        }

        h3 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-o-1);
            text-align: center;
        }

        span {
            font-size: 0.9rem;
            color: var(--text-o-4);
            text-align: center;
        }
    }
    .hl{
        outline: var(--strong) 2px solid;
        pointer-events: none;
    }
}
</style>