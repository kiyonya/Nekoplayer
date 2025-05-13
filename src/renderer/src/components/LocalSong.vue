<template>
    <div class="local" @dblclick="play">
        <div class="cover-shell">
            <img :src="cover" alt="" class="cover" v-if="cover">
            <div class="no-cover" v-if="!cover">
                <Icon icon="material-symbols:music-note" class="i" style="font-size: 2rem; color: var(--text-o-1);" />
            </div>
            <button class="play" @click.stop="play">
                <Icon icon="fe:play" class="i" style="font-size:2.2rem; color: var(--text-o-1);" />
            </button>
        </div>
        <div class="info">
            <h2 class="name text-limit">{{ name }}</h2>
            <span class="artist text-limit no-match" v-if="!matched">{{artist.map(i => i.name).join("/")}}</span>
            <ArtistNameGroup :array="artist" v-if="matched" class="artist"></ArtistNameGroup>
        </div>
        <span class="album text-limit">

            <span class="no-match" v-if="!matched">{{ album?.name || '未知专辑' }}</span>
            <span class="match" v-if="matched" @click="$router.push({ name: 'Album', params: { id: album?.id } })">{{
                album?.name }}</span>
        </span>
        <span class="time"> {{ getDate(time) }}</span>
        <span class="size">{{ formatSize(size) }}</span>

        <ContextMenu :menu="[
            { label: '播放', act: 'play', icon: 'ion:play' },
            { label: '在资源管理器显示', act: 'expshow', icon: 'material-symbols:folder-outline' },
            { label: '详情', act: 'detail', icon: 'ix:about' },
            'hr',
            { label: '设置歌词', act: 'setLyric', icon: 'material-symbols:lyrics' },
            // { label: '设置为封面', act: 'setcover', icon: 'humbleicons:image',disrender:cover ? false : true },
            { label: '从集合中删除', act: 'deleteInGroup', icon: 'material-symbols:delete-outline' },
             
            { label: '删除本地文件', act: 'delete', icon: 'material-symbols:delete-outline', style: 'color:red' },
        ]" @select="contextMenuSelected">
        </ContextMenu>

        <ModalWindow v-if="showDetial" @close="showDetial = false">
            <div class="song-window">
                <div class="cover-shell-window">
                    <img :src="cover" alt="" class="cover-window" v-if="cover">
                    <div class="no-cover-window" v-if="!cover"></div>
                </div>
                <div class="info-window">
                    <h3> {{ name }}</h3>
                    <span class="artist text-limit no-match" v-if="!matched">{{artist.map(i => i.name).join("/")
                        }}</span>
                    <ArtistNameGroup :array="artist" v-if="matched" class="artist"></ArtistNameGroup>
                </div>
            </div>
            <div class="song-info">
                <div class="info-item" v-for="(key, value) in detialWindow">
                    <span class="key">{{ value }}</span>
                    <span class="value">{{ key }}</span>
                </div>

            </div>
        </ModalWindow>

        <ModalWindow v-if="showWarn" @close="showWarn = false" :title="'确定要删除吗'">
            <div class="song-window">
                <div class="cover-shell-window">
                    <img :src="cover" alt="" class="cover-window" v-if="cover">
                    <div class="no-cover-window" v-if="!cover"></div>
                </div>
                <div class="info-window">
                    <h3> {{ name }}</h3>
                    <span class="artist text-limit no-match" v-if="!matched">{{artist.map(i => i.name).join("/")
                        }}</span>
                    <ArtistNameGroup :array="artist" v-if="matched" class="artist"></ArtistNameGroup>
                </div>
            </div>
            <p style="color: red;font-weight: bold;margin-top: 1rem;">这个操作会删除本地的文件，这个文件会消失很久，真的很久！</p>
            <div class="button-group">
                <button @click="showWarn = false" class="cancel">取消</button>
                <button @click="() => { $emit('delete', path,md5); showWarn = false }" class="confirm">我清楚我在做什么</button>
            </div>
        </ModalWindow>
    </div>
</template>
<script>
import { getDate } from '@/utils/timers';
import { Icon } from '@iconify/vue';
import ModalWindow from './windows/ModalWindow.vue';
import ContextMenu from './ContextMenu/ContextMenu.vue';
import ArtistNameGroup from './ArtistNameGroup.vue';

export default {
    data() {
        return {
            showDetial: false,
            showWarn: false,
            detialWindow: {
                "标题": this.name,
                "艺术家": this.artist.map(i => i.name).join(" / "),
                "专辑": this.album.name || "",
                "比特率": (this.bitrate / 1000).toFixed(0) + "kbps" || null,
                "时长": this.duration.toFixed(0) + "秒" || null,
                "无损": this.lossless ? "是" : "否",
                "文件": this.path,
                "体积": this.formatSize(this.size),
                "编码": this.codec || null
            }
        }
    },
    name: 'LocalSong',
    components: {
        Icon,
        ModalWindow,
        ContextMenu,
        ArtistNameGroup
    },
    props: {
        cover: {
            default: 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1746433477928/9C6161FE28BEAE3A69DB3C5244EAFB9A.gif'
        },
        name: {
            type: String,
            default: ''
        },
        path: {
            type: String,
            default: ''
        },
        album: {
            type: Object,
            default: ''
        },
        artist: {
            type: Array,
            default: ''
        },
        size: {
            type: Number,
            default: 0
        },
        index: {
            type: Number,
            default: 0
        },
        time: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 0
        },
        bitrate: {
            type: Number,
            default: 0
        },
        lossless: {
            type: Boolean,
            default: false
        },
        codec: {
            type: String,
            default: ''
        },
        matched: {
            type: Boolean,
        },
        md5: {
            type: String,
        }
    },
    methods: {
        formatSize(size) {
            if (size < 1024) return size + 'B'
            else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB'
            else if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + 'MB'
            else return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        }, getDate,
        play() {
            this.$emit('play', this.md5);
        },
        contextMenuSelected(item) {
            const act = item?.act
            const actions = {
                play: () => {
                    this.play()
                },
                expshow: () => {

                },
                detail: () => {
                    this.showDetial = true
                },
                delete: () => {
                    this.showWarn = true
                },
                deleteInGroup: () => {
                    this.$emit('deleteInGroup', this.md5)
                },
                setCover: () => {
                    this.$emit('setcover', this.path, this.md5)
                },
                setLyric:(()=>{
                    this.$emit('setlyric',this.md5)
                })
            }
            if (actions[act]) {
                actions[act]()
            }
        },
    },
    emits: ['play', 'delete', 'deleteInGroup', 'setcover','setlyric'],
}
</script>
<style scoped>
.local {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    border-radius: 0.5rem;
    background-color: var(--bg-2);
    color: var(--text-o-1);
    font-size: 1.2rem;
    cursor: pointer;
    align-items: center;
    position: relative;
    flex-shrink: 0;
    --cover-size: 3.5rem;
    box-sizing: border-box;
    padding: 0.2rem 1rem 0.2rem 0;

    .cover-shell {
        width: var(--cover-size);
        height: var(--cover-size);
        position: relative;
        overflow: hidden;
        border-radius: 0.5rem;
        background-color: var(--ui);
    }

    .cover {
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        object-fit: cover;
    }

    .play {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: brightness(0.5);
        opacity: 0;
    }

    .play:active {
        transform: none;
    }

    .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        width: fit-content;

    }

    .name {
        font-size: 1.2rem;
        font-weight: bold;
        max-width: 20rem;
    }

    .artist {
        font-size: 0.9rem;
        color: var(--text-o-4);
        max-width: 20rem;
    }

    .album {
        position: absolute;
        left: 45%;
        font-size: 1rem;
        color: var(--text-o-2);
        max-width: 18rem;

        .match:hover {
            text-decoration: underline;
        }
    }

    .size {
        position: absolute;
        right: 1rem;
        font-size: 1rem;
        color: var(--text-o-2);
    }

    .time {
        position: absolute;
        right: 7rem;
        font-size: 1rem;
        color: var(--text-o-2);
    }
}

.local:hover .play {
    opacity: 1;
}

.no-cover {
    width: var(--cover-size);
    height: var(--cover-size);
    border-radius: 0.5rem;
    background-color: var(--ui);
    display: flex;
    justify-content: center;
    align-items: center;
}

.s {
    min-width: 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--text-o-4);
}

.local:hover {
    background: var(--hover);
}

.song-window {
    display: flex;
    flex-direction: row;
    gap: 0.8rem;
    width: auto;
    height: auto;
    background-color: var(--bg-2);
    color: var(--text-o-1);
    cursor: pointer;
    align-items: center;
    position: relative;
    flex-shrink: 0;

    .cover-shell-window {
        width: 3rem;
        height: 3rem;
        position: relative;
        overflow: hidden;
        border-radius: 0.5rem;
        background-color: var(--ui);

        .cover-window {
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
            object-fit: cover;
        }

        .no-cover-window {
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
            background-color: var(--ui);
        }
    }

    .info-window {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: fit-content;

        h3 {
            font-size: 1.2rem;
            font-weight: bold;
            max-width: 25rem;
        }

        span {
            font-size: 0.9rem;
            color: var(--text-o-4);
            max-width: 20rem;
        }
    }




}

.song-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    margin-top: 1rem;
    border-top: 1px solid var(--border);
    padding: 0.5rem 0;

    .info-item {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        font-size: 1rem;

        .key {
            font-weight: bold;
            color: var(--text-o-1);
        }

        .value {
            color: var(--text-o-4);
        }
    }
}

.button-group {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-top: auto;
    margin-bottom: 0;

    button {
        width: fit-content;
        height: fit-content;
        padding: 0.5rem 1.5rem;
        background: var(--ui);
        color: var(--text-o-1);
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 15px;
        flex: 1;

        &.cancel {
            background-color: var(--ui-light);
            color: var(--text-o-4);
        }

        &.confirm {
            background-color: rgb(223, 35, 35);
            color: white;
        }
    }
}
</style>