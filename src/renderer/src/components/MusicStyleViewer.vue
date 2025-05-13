<template>
    <div class="ctn" v-if="this.$route.params.id == 0">
        <div class="p-title"><img src="@/assets/images/preference.svg" alt=""><span>{{ title }}</span></div>
        <div class="my-style">
            <div class="style-card" v-for="pre in this.tagPreferenceVos" :key="pre.tagId"
                :style="`--s:#${pre.colorShallow}5a`">
                <img :src="pre.picUrl" alt="" class="bg-cover">
                <h2 class="style-name">{{ pre.tagName }}</h2>
                <h2 class="ratio">{{ pre.ratio + "%" }}</h2>
                <div class="child-tags">
                    <span v-for="(child, index) in pre.childrenTags" :key="child.tagId">{{ child.tagName }}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="ctn ctn-mtl style-info" v-if="this.$route.params.id != 0" style="overflow: hidden;position: relative;">
        <div class="m-title" style="margin-top: 0.5rem;"><span style="font-size: larger;">{{ styleSongTag }}</span>
        </div>
        <div class="style-intro">{{ styleMotd }}</div>
        <img :src="styleBg" alt="" class="style-img">
    </div>


    <div class="ctn">
        <div class="p-title"><img src="@/assets/images/disc.svg" alt="" class="icon"><span>

            {{ this.$route.params.id == 0 ? $t('styles.youMayLike') :
            $t('styles.recommendAbove') }} <span class="strong-tag">{{
                    styleSongTag }}</span>{{ $t('styles.song') }}
                </span>
            <div class="toggle-sort" @click="toggleSortRule()" tabindex="1">{{ styleSongsSort < 1 ? $t('styles.byTime') : $t('styles.byHot') }}</div>
            </div>
            <div class="songs-ctn">
                <div class="btn-shell" @click="changeStyleSongPage(-1)">
                    <img src="@/assets/images/pgup.svg" alt="" class="i icon" tabindex="1">
                </div>
                <div class="songs-shell">

                    <RcmdSong v-for="song in styleSongs.slice(0, 9)" :cover="song.al.picUrl" :name="song.name"
                        :artist="song.ar" :key="song.id" :id="song.id">
                    </RcmdSong>

                </div>
                <div class="btn-shell" @click="changeStyleSongPage(1)">
                    <img src="@/assets/images/pgdn.svg" alt="" class="i icon" tabindex="1">
                </div>
            </div>
        </div>



        <div class="ctn">
            <div class="p-title"><img src="@/assets/images/playlist.svg" alt="" class="icon"><span>{{ $t('styles.listen') }}<span class="strong-tag">{{
                styleSongTag }}</span>{{ $t('styles.stylePlaylist') }}</span>
                <div class="cursor">
                    <img src="@/assets/images/pgup.svg" alt="" class="i" @click="changePlaylistPage(-1)" tabindex="1">
                    <p class="page-code">{{ stylePlaylistCursor + 1 }}</p>
                    <img src="@/assets/images/pgdn.svg" alt="" class="i" @click="changePlaylistPage(1)" tabindex="1">
                </div>
            </div>
            <div class="g-shell-6">
                <PlaylistCard v-for="p in stylePlaylist" :name="p.name" :cover="p.cover" :key="p.id" :id="p.id"></PlaylistCard>
            </div>
        </div>


        <div class="ctn">
            <div class="p-title"><img src="@/assets/images/artist.svg" alt="" class="icon"><span>推荐艺人</span></div>
            <div class="g-shell-6">
                <ArtistCard v-for="ar in styleArtist" :cover="ar.img1v1Url" :name="ar.name" :key="ar.id"></ArtistCard>
            </div>
        </div>

        <div class="ctn">
            <div class="p-title"><img src="@/assets/images/playlist.svg" alt="" class="icon"><span>推荐 <span class="strong-tag">{{
                styleSongTag }}</span> 的专辑</span>
                <div class="toggle-sort" @click="toggleSortAlbum()" tabindex="1">{{ styleAlbumSort < 1 ? "按热度" : '按时间' }} </div>
                        <div class="cursor" style="margin: 0;">
                            <img src="@/assets/images/pgup.svg" alt="" class="i" @click="changeAlbumPage(-1)" tabindex="1">
                            <p class="page-code">{{ styleAlbumCursor + 1 }}</p>
                            <img src="@/assets/images/pgdn.svg" alt="" class="i" @click="changeAlbumPage(1)" tabindex="1"> 
                        </div>
                </div>
                <div class="artist-shell g-shell-6">
                    <PlaylistCard v-for="p in styleAlbum" :name="p.name" :cover="p.picUrl" :key="p.id"
                        :count="`${p.size}首 · ${getDate(p.publishTime)}`"></PlaylistCard>
                </div>
            </div>
</template>
<script>
import * as musicstyle from '@/api/musicstyle';
import { customRef, ref, watch } from 'vue';
import RcmdSong from '@/components/Song_Small.vue';
import ms from '@/assets/data/musicstyle.json'
import PlaylistCard from './PlaylistCard.vue';
import { getDate } from '@/utils/timers';
import ArtistCard from './ArtistCard.vue';


export default {
    data() {
        return {
            tid: ref(0),
            title: this.$route.params.id == 0 ? `我的曲风偏好` : "曲风-" + this.$route.params.id,
            tagPreferenceVos: ref([]),

            styleMotd: '',
            styleBg: ref(''),

            styleSongs: ref([]),
            styleSongsCursor: ref(0),
            styleSongsSort: ref(1),
            styleSongsMore: ref(true),
            styleSongTag: ref(''),

            stylePlaylist: ref([]),
            stylePlaylistCursor: ref(0),
            stylePlaylistMore: ref(true),

            styleAlbum: ref([]),
            styleAlbumCursor: ref(0),
            styleAlbumSort: ref(0),
            styleAlbumMore: ref(true),

            styleArtist: ref([]),
            styleArtistCursor: ref(0),
            styleArtistTotal: ref(0)
        }
    },
    components: {
        RcmdSong, PlaylistCard, ArtistCard
    },
    props: ['id'],
    methods: {
        changeStyleSongPage(i) {
            if (i > 0 && this.styleSongsMore) {
                this.styleSongsCursor++
            }
            if (i < 0 && this.styleSongsCursor > 0) {
                this.styleSongsCursor--
            }
            this.getStyleSongs(this.tid)
        },
        changePlaylistPage(i) {
            if (i > 0 && this.stylePlaylistMore) {
                this.stylePlaylistCursor++
            }
            if (i < 0 && this.stylePlaylistCursor > 0) {
                this.stylePlaylistCursor--
            }
            this.getStylePlaylist(this.tid)
        },
        changeAlbumPage(i) {
            if (i > 0 && this.styleAlbumMore) {
                this.styleAlbumCursor++
            }
            if (i < 0 && this.styleAlbumCursor > 0) {
                this.styleAlbumCursor--
            }
            this.getStyleAlbum(this.tid)
        },
        async queryMyStyle() {
            const pref = (await musicstyle.getPreference())
            this.tagPreferenceVos = pref.slice(0, 5)
            return pref
        },
        async getStyleSongs(id = this.$route.params.id) {
            if (this.styleSongsMore) {
                const data = (await musicstyle.getStyleSongs(id, this.styleSongsSort, this.styleSongsCursor * 9))
                this.styleSongs = data.data.songs
                this.styleSongsMore = data.data.page.more
            }
        },
        async getStyleDetial(id) {
            const data = (await musicstyle.getStyleDetial(id))
            this.styleMotd = data.data.desc
            this.styleBg = data.data.cover[0] + '?param=300y300'
        },
        async getStylePlaylist(id) {
            const data = (await musicstyle.getStylePlaylist(id, this.stylePlaylistCursor * 12))
            this.stylePlaylist = data.data.playlist
            this.stylePlaylistMore = data.data.page.more
        },
        async getStyleAlbum(id) {
            const data = await musicstyle.getStyleAlbum(id, this.styleAlbumCursor *12, this.styleAlbumSort)
            this.styleAlbum = data.data.albums
            this.styleAlbumMore = data.data.page.more
        },
        async getStyleArtist(id) {
            const data = await musicstyle.getStyleArtist(id, Math.floor(Math.random() * 40))
            this.styleArtist = data.data.artists
            this.styleArtistTotal = data.data.page.total
        },
        _drawObjectByProbability(arr) {
            const rand = Math.random();
            let cumulativeProbability = 0;
            for (let obj of arr) {
                cumulativeProbability += obj.ratio / 100;
                if (rand < cumulativeProbability) {
                    return [obj.tagId, obj.tagName];
                }
            }
            console.error("Probabilities do not sum to 1.");
            return null;
        },
        toggleSortRule() {
            if (this.styleSongsSort === 0) {
                this.styleSongsSort = 1
            }
            else { this.styleSongsSort = 0 }
        },
        toggleSortAlbum() {
            if (this.styleAlbumSort === 0) {
                this.styleAlbumSort = 1
            }
            else { this.styleAlbumSort = 0 }
        },
        getDate
    },
    mounted() {
        if (this.$route.params.id == 0) {
            this.queryMyStyle().then(data => {
                this.tid = this._drawObjectByProbability(data)[0]
            })
        }
        else {
            this.tid = this.$route.params.id
        }
    },
    watch: {
        tid(n, o) {
            for (let i of ms) {
                if (i.id == n) {
                    this.styleSongTag = i.name
                    break
                }
            }
            this.stylePlaylistCursor = 0
            this.getStyleSongs(n)
            this.getStyleDetial(n)
            this.getStylePlaylist(n)
            this.getStyleAlbum(n)
            this.getStyleArtist(n)
        },
        styleSongsSort(n, o) {
            this.styleSongsCursor = 0
            this.getStyleSongs(this.tid)
        },
        styleAlbumSort(n, o) {
            this.styleAlbumCursor = 0
            this.getStyleAlbum(this.tid)
        }
    }
}
</script>
<style>
.my-style {
    width: 100%;
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
}

@keyframes style-card-in {
    from {
        transform: rotate(15deg);
        filter: brightness(0.5);
    }
}

.my-style .style-card {
    transform-origin: left top;
    animation: style-card-in .3s;
    width: 100%;
    background-color: var(--app-theme-component);
    position: relative;
    overflow: hidden;
    border-radius: 0.6cqw;
    
    border: 1px solid var(--s);
    aspect-ratio: 3/2;
    transition: .2s;
}
.my-style .style-card:hover{
    box-shadow: 0px 0px 12px var(--s);
}
.my-style .style-card .bg-cover {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(1px) brightness(0.8);
    transition: .2s;
}

.my-style .style-card:hover .bg-cover {
    transform: scale(1.2);
}

.my-style .style-card .style-name {
    position: absolute;
    z-index: 1;
    font-size: 1.7cqw;
    left: 6%;
    top: 8%;
    color: #fff;
    opacity: 0.9;
}

.my-style .style-card .ratio {
    position: absolute;
    z-index: 1;
    font-size: 1.7cqw;
    right: 6%;
    bottom: 8%;
    color: #fff;
}

.my-style .style-card .child-tags {
    position: absolute;
    left: 6%;
    bottom: 8%;
    z-index: 2;
    font-size: 0.9cqw;
    display: flex;
    flex-direction: column;
    color: #fff;
}

.songs-ctn {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.songs-ctn .i {
    width: 1.5rem;

}

.songs-ctn .songs-shell {
    width: 95%;
    height: 13.5rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 0.5rem 0.6rem;
}

.songs-ctn .btn-shell {
    position: relative;
    width: 2%;
    height: 13.5rem;
    background: var(--app-theme-component);
    display: flex;
    border-radius: 3px;
    transition: .3s;
}

.btn-shell .i {
    width: 1.5rem;
    margin: auto;
    opacity: var(--text-opacity-2);
}

.btn-shell:hover {
    background: var(--app-theme-strong-background);
}

.toggle-sort {
    margin: auto 2% auto auto;
    font-size: 1.05rem;
    font-weight: bold;
    opacity: var(--text-opacity-3);
    cursor: pointer;
}

@keyframes style-info-in {
    from {
        transform: translateX(200px);
        opacity: 0;
        filter: blur(5px);
    }
}

.style-info {
    animation: style-info-in .3s forwards;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid var(--app-theme);
    transition: .2s;
}

.style-intro {
    width: 65%;
    height: fit-content;
    font-size: 1.05rem;
    margin-left: 1.5%;
    margin-bottom: 0.75rem;
    position: relative;
    z-index: 1;
    opacity: var(--text-opacity-2);
    font-weight: 500;
}

.style-img {
    width: 50%;
    height: 100%;
    position: absolute;
    right: 0;
    mask: linear-gradient(270deg, #000, transparent);
    z-index: 0;
    object-fit: cover;
}

.m-title {
    font-weight: bold;
    font-size: 1.5rem;
    margin-left: 1.5%;
    margin-bottom: 0.75rem;
    opacity: var(--text-opacity-2);
}

.cursor {
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: auto 2% auto auto;
    gap: 1.125rem;
    background: var(--app-theme-component);
    padding: 0.3rem;
    border-radius: 5px;
    box-shadow: 1px 1px 2px #00000015;
    transition: .2s;
}
.cursor:hover{
    background: var(--app-theme-strong-background);
}
.cursor .page-code {
    width: 1rem;
    font-size: 1.05rem;
    text-align: center;
    transform: translateX(-2px);
    font-weight: bold;
    opacity: var(--text-opacity-2);
}

.cursor .i {
    width: 2.2cqh;
    opacity: var(--text-opacity-2);
}

.artist-shell {
    width: 100%;
    min-height: 10rem;
}
</style>