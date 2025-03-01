<template>
    <div class="top">
        <div class="cover">
            <img :src="cover + `?parma=500y500`" alt="" class="main" />
            <img :src="cover + `?parma=500y500`" alt="" class="blur" />
        </div>
        <div class="detial">
            <h2 class="name">{{ name }}</h2>
            <span class="subtitle" v-if="subtitle" @click="this.$emit('subtitleclick', true)">{{ subtitle }}</span>
            <div class="maininfo" v-if="maininfo">
                <span>{{ maininfo }}</span>
            </div>
            <div class="maininfo " v-if="creator">
                <span @click="oncreatorclick">由{{ creator }}创建</span>
            </div>
            <div class="info">
                <span>{{ info }}</span>
            </div>
            <div class="desc" v-if="desc" @click="this.$emit('descClick', true)">{{ desc }}</div>
            <div class="btns">
                <button @click="this.$emit('playall', true)">
                    <Icon icon="material-symbols:play-arrow-rounded" class="i" />
                    播放
                </button>
                <button>
                    <Icon icon="material-symbols:favorite-outline-rounded" class="i" />
                </button>
                <button>
                    <Icon icon="lucide:ellipsis" class="i" />
                    <ContextMenu :menu="[
                        { label: '播放全部', act: 'playall', icon: 'ion:play' },
                        { label: '分享', act: 'share', icon: 'majesticons:share' },

                        { label: '加入播放列表', act: 'addlist', icon: 'material-symbols:list-alt-add-rounded' },
                        'hr',
                        { label: '复制链接', act: 'copylink', icon: 'tabler:link' },
                        { label: '浏览器打开', act: 'browser', icon: 'mdi:web' },
                    ]" :mode="'click'" @select="contextMenuSelected">
                    </ContextMenu>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { Icon } from '@iconify/vue';
import ContextMenu from './ContextMenu/ContextMenu.vue';

export default {
    components: {
        Icon, ContextMenu
    },
    props: ["cover", "name", "subtitle", "maininfo", "info", "desc", "onplayall", "onsubtitleclick", "oncreatorclick", "creator"],
    emits: ['playall', 'addlist', 'edit','browser'],
    methods: {
        contextMenuSelected(e) {
            const act = e.act
            const actions = {
                playall: () => {
                    this.$emit('playall')
                },
                addlist: () => {
                    this.$emit('addlist')
                },
                edit: () => {
                    this.$emit('edit')
                },
                browser:()=>{
                    this.$emit('browser')
                }
            }
            if (actions[act]) {
                actions[act]()
            }
        }
    }
}
</script>
<style scoped>
.top {
    position: relative;
    margin-top: 3rem;
    margin-bottom: 1.8rem;
    width: 93%;
    height: 18rem;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.cover {
    height: 100%;
    aspect-ratio: 1/1;
    position: relative;
    display: flex;
    justify-content: center;
}

.cover .main {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 5%;
}

.cover .blur {
    width: 95%;
    aspect-ratio: 1/1;
    position: absolute;
    border-radius: 5%;
    z-index: -1;
    filter: blur(15px);
    bottom: -1rem;
    opacity: 0.5;
}

.detial {
    position: relative;
    width: 50%;
    height: 100%;
    margin-left: 1.5rem;
    display: flex;
    flex-direction: column;
    color: var(--text);
    flex: 1;
}

.detial .name {
    margin-top: 0rem;
    font-size: 2.3rem;
}

.detial .subtitle {
    margin-top: 0.3rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--strong);
}

.detial .maininfo {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.8rem;
    font-size: 1.3rem;
    font-weight: 400;
    opacity: var(--text-o-1);
}



.detial .info {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    font-size: 1rem;
    opacity: var(--text-o-4);
}

.detial .tags {
    display: flex;
    flex-direction: row;
    gap: 0.9rem;
    font-size: 1rem;
}

.detial .tags span {
    background: var(--component);
    padding: 0.1rem 0.5rem;
    border-radius: 1rem;
}

.desc {
    width: 70%;
    height: fit-content;
    display: -webkit-inline-box;
    margin: auto auto auto 0px;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    text-overflow: ellipsis;
    opacity: var(--text-o-4);
    font-size: 0.9rem;
}

.desc:hover {
    text-decoration: underline;
}

.btns {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    margin: auto auto 0px 0px;
    width: 100%;
    height: 2.5rem;
}

.btns button {
    height: 100%;
    aspect-ratio: 1/1;
    border: none;
    background: var(--ui);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    border-radius: 5px;
    color: var(--text-o-2);
    font-size: 1.2rem;
    gap: 0.2rem;
    box-shadow: var(--shadow);
}

.btns button:first-child {
    padding: 0.4rem 1rem;
    aspect-ratio: auto;
    background: var(--strong-light);
    font-weight: 600;
    color: white;
    fill: white;
}

.btns button .i {
    width: 1.4em;
    height: 1.4em;
    color: inherit;
}
</style>