<template>
    <div class="page">
        <div class="page-selector">

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
                <div class="r" style="justify-content: left;gap: 1rem;">
                    <div class="color-card" v-for="color in uiColor" :style="{ background: `rgb(${color})` }"
                        @click="setTheme({ key: 'ui', value: color })" tabindex="2">

                        <Icon icon="fluent:checkmark-12-regular" class="i"
                            v-if="theme.ui.join(',') == color.join(',')" />
                    </div>
                </div>
            </div>
            <div class="group">
                <div class="r">
                    <div class="t">应用字体</div>
                    <select name="" id="" @change="theme = { key: 'font', value: $event.target.value }">
                        <option :value="font.postscriptName" v-for="font in zhFonts">{{ font.fullName }}</option>
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
            </div>
        </div>
        <div class="playpage view">
            <h2 class="t">播放页设置</h2>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import Switch from '@/components/element/Switch.vue'
import Selector from '@/components/element/Selector.vue'
import { watch } from 'vue';
import { Icon } from '@iconify/vue';
import { setTheme } from '@/lib/theme';
import { getLocalFonts } from './setting';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { store } from '@/store';
import VueSlider from 'vue-slider-component';
import { getMainColorFromImg } from '@/utils/imageProcess';
import ColorThief from 'colorthief';
const theme = computed({
    get: () => store.state.theme,
    set: ({ key, value }) => store.commit('updateTheme', { key: key, value: value })
})
const a = ref(true)
const zhFonts = ref([])
const mainColorOfCustomImage = ref([])
const uiColor = [
    [133, 141, 255], [255, 188, 55], [255, 82, 55], [255, 141, 168], [57, 197, 187], [100, 149, 237]
]
watch(a, () => {
    console.log(a.value)
})
function loadFonts() {
    getLocalFonts().then(fonts => {
        console.log(fonts)
        zhFonts.value = fonts
    })
}
onMounted(() => {
    loadFonts()
})
async function selectImage() {
    const file = await window.api.dialogOpenFile({
        filters: [
            { name: '图片文件', extensions: ['jpg', 'png', 'gif'] }
        ]
    })
    console.log(file[0])
    if (file && file[0]) {
        theme.value = { key: 'backgroundImage', value: file[0].replace(/\\/g, '/') }
    }
}
async function getMainColorFromImage(e) {
    const cf = new ColorThief()
    const color = await cf.getPalette(e.target)
    mainColorOfCustomImage.value = color.slice(0, 5)
}
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

.group {
    width: 100%;
    height: fit-content;
    background: var(--component);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0.8rem 1rem;
    gap: 0.5rem;
    box-shadow: var(--shadow);
    border-radius: var(--br-1);

    .t {
        font-size: 1.1rem;
        font-weight: 600;
    }

    .r {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        align-items: center;
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
    min-width: 10rem;
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
</style>