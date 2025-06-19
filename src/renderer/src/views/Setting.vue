<template>
    <div class="page">
        <div class="page-selector">

        </div>
        <div class="common view">
            <h2 class="t">云音乐账号</h2>

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
            </div>
        </div>
        <div class="performance view">
            <h2 class="t">应用外观</h2>
            <div class="group">
                <div class="t">应用主题</div>
                <div class="themes">
                    <div class="theme follow" @click="setTheme({ key: 'theme', value: 'default:follow' })">
                        <div class="color"></div>
                        <span>跟随系统</span>
                    </div>
                    <div class="theme light" @click="setTheme({ key: 'theme', value: 'default:light' })">
                        <div class="color"></div>
                        <span>浅色模式</span>
                    </div>
                    <div class="theme dark" @click="setTheme({ key: 'theme', value: 'default:dark' })">
                        <div class="color"></div>
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
                    <select name="" id="" @change="theme = { key: 'font', value: $event.target.value }">
                        <option :value="font.postscriptName" v-for="font in zhFonts">{{ font.fullName }}</option>
                    </select>
                </div>
                <div class="r">
                    <div class="t">应用圆角</div>
                    <Switch />
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
            </div>
        </div>
        <div class="audio view">
            <h2 class="t">音频</h2>
            <div class="group">
                <div class="r">
                    <div class="t">音频质量</div>
                    <select name="" id="" @change="config = { key: 'audioQuaility', value: $event.target.value }"
                        :value="config.audioQuaility">
                        <option value="standard">标准 128kbps</option>
                        <option value="higher">极高 192kbps</option>
                        <option value="exhigh">超高 320kbps</option>
                        <option value="lossless">无损 FLAC</option>
                        <option value="hires">Hi-Res</option>
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
                    <div class="t">缓存最大占用</div>
                    <span>已使用:{{ (cacheUsage / 1024 / 1024).toFixed(2) }}MB / 全部:{{ config.maxCacheSize }}MB</span>
                    <VueSlider v-model="config.maxCacheSize" :min="1024" :max="10240" :interval="1" :width="350"
                        :tooltip-formatter="(i) => (i / 1024).toFixed(2) + 'GB'"
                        :process-style="{ background: 'var(--strong)' }"
                        :tooltip-style="{ background: 'var(--strong)' }" :lazy="true"></VueSlider>
                </div>
            </div>
        </div>

        <div class="behavior view">
            <h2 class="t">性能</h2>
            <div class="group">
                <div class="r">
                    <div class="t">定时内存回收</div>
                    <Switch />
                </div>
            </div>
        </div>

        <div class="about view">
            <h2 class="t">关于</h2>
            <div class="group">
                <div class="r">
                    感谢您使用喵喵播放器，虽然还有很多很多不足，希望您可以反馈给我，再次衷心感谢您的信任与支持！
                    <br>
                    NekoPlayer 使用 MIT 协议开源
                </div>
                <div class="r">
                    0.4.4b
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
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
const profile = computed(() => {
    return store.state.profile
})
const theme = computed({
    get: () => store.state.theme,
    set: ({ key, value }) => store.commit('updateTheme', { key: key, value: value })
})

const zhFonts = ref([])
const mainColorOfCustomImage = ref([])
const cacheUsage = ref(0)
const config = computed({
    get: () => store.state.config,
    set: ({ key, value }) => { store.commit('config', { key, value }) }
})

function loadFonts() {
    getLocalFonts().then(fonts => {
        zhFonts.value = fonts
    })
}
onMounted(async () => {
    Promise.resolve().then(() => {
        loadFonts()
        getCacheUsage()
    })
})
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
async function selectCacheFolder() {
    const dir = await window.api.dialogOpenDir({
        title: "选择缓存文件夹"
    })
    if (dir) {
        config.value = { key: "cachePath", value: dir }
        getCacheUsage()
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
</script>
<style scoped>
.view {
    width: 92%;
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
    background: var(--component);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0.8rem 1rem;
    gap: 0.7rem;
    box-shadow: var(--shadow);
    border-radius: var(--br-1);
    animation: group-in 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);

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
</style>