<template>
  <div class="page">

    <div class="head">
      <div class="daily-song" @click="router.push({ name: 'DailyRecommend' })">
        <div class="cover-shell">
          <img :src="dailySongs[0]?.al.picUrl" alt="" class="main-cover" />
          <img :src="dailySongs[0]?.al.picUrl" alt="" class="blur-cover" />
        </div>
        <div class="cover-preview">
          <img :src="i?.al?.picUrl" alt="" v-for="i in dailySongs.slice(1, 4)" />
        </div>
        <div class="bottom-mask"></div>
        <div class="date">
          {{ date?.month }}月{{ date?.date }}日
        </div>
        <h2 class="title">每日推荐</h2>
      </div>
      <div class="shell personalfm" :style="{ background: personalFMBackground }" v-if="isLogin">
        <img :src="personalFM?.album?.picUrl" alt="" class="cover" crossorigin="anonymous"
          @load="getPersonalFMBackground" />
        <div class="ep-info">
          <h2 class="text-limit">{{ personalFM?.name }}</h2>
          <ArtistNameGroup :array="personalFM?.artists" style="color: white;"></ArtistNameGroup>
        </div>
        <div class="control">
          <button @click="player.playPersonalFM(true)">
            <Icon icon="ion:play" class="icon" style="color: white;" />
          </button>
          <button @click="player.nextFM()">
            <Icon icon="fluent:next-32-filled" class="icon" style="color: white;" />
          </button>
        </div>
      </div>
      <div class="sing-up"></div>
    </div>
    <!-- <div class="" @click="router.push({
      name:'BillboardVocaloid'
    })">看看周榜</div> -->
    <div class="body">
      <div class="shell official-playlist">
        <h2 class="ti">雷达歌单</h2>
        <div class="official-playlists">
          <PlaylistCard v-for="officialPlaylist in officialPlaylist?.slice(0, deviceScreenSize < 1 ? 5 : 6)"
            :name="officialPlaylist?.name" :cover="officialPlaylist?.coverImgUrl" :id="officialPlaylist?.id"
            :key="officialPlaylist?.coverImgUrl"
            class="card"
            @playall="player.playPlaylist(null, null, { type: 'playlist', id: officialPlaylist?.id }, true)">
          </PlaylistCard>
          <Skeleton v-for="i in deviceScreenSize < 1 ? 5 : 6" v-if="officialPlaylist.length <= 0"></Skeleton>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="shell red-simi" v-if="redSimiSongs.length">
        <h2 class="ti">为你定制</h2>
        <div class="red-simisongs">
          <Song_Small v-for="song in redSimiSongs?.slice(0, deviceScreenSize < 1 ? 9 : 12)" :name="song?.name"
            :cover="song?.album?.picUrl" :artist="song?.artists" :id="song?.id" @play="
              playRedSimiSong" @menu="(_,act)=>{miniTrackMenuSelected(_,act,playRedSimiSong)}">
          </Song_Small>
        </div>
      </div>
    </div>
    <div class="body recommend-playlist">
      <h2 class="ti">推荐歌单</h2>
      <div class="recommend-playlists">
        <PlaylistCard v-for="rp in recommendPlaylist?.slice(0, deviceScreenSize < 1 ? 10 : 12)" :name="rp?.name"
          :cover="rp?.picUrl" :id="rp?.id" class="card" :key="rp?.id"
          @playall="player.playPlaylist(null, null, { type: 'playlist', id: rp?.id }, true)"></PlaylistCard>
      </div>
    </div>
    <div class="body row style-rcmd">

      <div class="user-style" v-if="deviceScreenSize >= 1">
        <h1 class="ti">我的曲风</h1>
        <div class="style" v-for="(style, index) in userStyle.slice(0, 3)"
          :style="{ background: `rgb(${style?.mainColor})` }">
          <span style="z-index: 1;">{{ style.tagName }}</span>
          <img :src="style?.picUrl" alt="" class="icon">
        </div>
      </div>
      <div class="style-rcmd-detial">
        <h2 class="ti" style="justify-content: space-between;">{{ homepageStyleRCMD?.ui?.subTitle?.title }}

          <button @click="getHomepageStyleRecommend(true)">
            <Icon icon="material-symbols:refresh-rounded" /> 刷新
          </button>

        </h2>
        <div class="songs">
          <Song_Small v-for="song in homepageStyleRCMD?.songs?.slice(0, deviceScreenSize < 1 ? 9 : 12)"
            :name="song?.name" :cover="song?.album?.picUrl" :artist="song?.artists" :id="song?.id" :key="song?.id"
            @play="(id) => playHomepageStyleRecommendSongs(id)" @menu="(_,act)=>{
              miniTrackMenuSelected(_,act,playHomepageStyleRecommendSongs)
            }">

          </Song_Small>
        </div>
      </div>
    </div>
    <div class="body  artist-new">
      <h2 class="ti">关注艺人新专辑</h2>
      <div class="artist-new-album g-shell-6">
        <AlbumCard 
        v-for="al in subscribeArtistsNewAlbum?.slice(0, deviceScreenSize < 1 ? 5 : 6)"
        :name="al?.blockTitle?.resourceName"
        :cover="al?.blockTitle?.imgUrl"
        :size="al?.albumSongCount"
        :id="al?.albumId"
        :key="al?.albumId"
        :date="al?.publishTime"
        ></AlbumCard>
      </div>
    </div>

  </div>
</template>
<script setup>
import { getDailySong, getRadio, getHomepageBlock, getUserStylePreference, getUserSubArtistsNewAlbum } from '@/api/recommend'
import { nextTick, onActivated } from 'vue'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import {
  getRecommendPlaylist,
} from '@/api/recommend'
import PlaylistCard from '@/components/PlaylistCard.vue'
import Song_Small from '@/components/Song_Small.vue'
import { computed } from 'vue'
import { store } from '@/store'
import { player } from '@/main'
import ArtistNameGroup from '@/components/ArtistNameGroup.vue'
import Skeleton from '@/components/Skeleton.vue';
import { getColor } from '@/components/musicplayer/color'
import { createLinearGradient } from '@/utils/imageProcess'
import router from '@/router'
import { getMainColorFromImage } from '@/utils/color'
import { paralleTask } from '@/utils/lazyload'
import { watch } from 'vue'
import { onDeactivated } from 'vue'
import { onMounted } from 'vue'
import { showMessageNotification } from '@/components/notification/use_notification'
import AlbumCard from '@/components/AlbumCard.vue'
const date = ref({
  month: 1,
  date: 1
})
const deviceScreenSize = computed(() => {
  return store.state.deviceScreenSize
})
const profile = computed(() => {
  return store.state.profile
})
const personalFM = computed(() => {
  return store.state.personalFM
})
const isLogin = computed(() => {
  return store.state.isLogin
})
const dailySongs = ref([])
const officialPlaylist = ref([])
const simiRecommendBaseSong = ref({})
const simiRecommend = ref([])
const personalFMBackground = ref('')
const recommendPlaylist = ref([])
const homepageStyleRCMD = ref({})
const userStyle = ref([])
const redSimiSongs = ref([])
const subscribeArtistsNewAlbum = ref([])

async function getWebApiRecommendPlaylist() {
  const data = await getRecommendPlaylist()
  recommendPlaylist.value = data?.result.slice(1)
}
async function getHomepageStyleRecommend(rf = false) {
  const data = await getHomepageBlock("HOMEPAGE_BLOCK_STYLE_RCMD", 0, rf)
  let block = data?.data?.blocks[0]
  let styleRcmdSongs = []
  let creatives = block?.creatives
  for (let create of creatives) {
    const res = create?.resources
    for (const song of res) {
      styleRcmdSongs.push(song.resourceExtInfo.songData)
    }
  }
  homepageStyleRCMD.value = {
    ui: block?.uiElement,
    songs: styleRcmdSongs
  }
  styleRcmdSongs = null
  creatives = null
  block = null

}
async function getRedSimilar(rf = false) {
  if (!isLogin.value) { return }
  const data = await getHomepageBlock('HOMEPAGE_BLOCK_RED_SIMILAR_SONG', 0, rf)
  for (let c of data?.data?.blocks[0]?.creatives) {
    const r = c?.resources
    for (let rs of r) {
      redSimiSongs.value.push(rs.resourceExtInfo.songData)
    }
  }
}
async function load() {

  let tasks = [
    async () => {
      getDailySong().then((data) => {
        dailySongs.value = data?.data?.dailySongs
      })
    },
    async () => {
      getRadio().then((data) => {
        officialPlaylist.value = data
      })
    },
    getRedSimilar,
    getWebApiRecommendPlaylist,
    getHomepageStyleRecommend,
    async () => {
      getUserStylePreference().then(data => {
        const vos = data?.data.tagPreferenceVos
        const stylePromises = vos.map(style => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = style?.picUrl;
            img.crossOrigin = 'anonymous';
            img.onload = async () => {
              try {
                const mainColor = await getMainColorFromImage(img);
                resolve({ ...style, mainColor });
              } catch (error) {
                console.error('Error getting color for image:', style.picUrl, error);
                resolve({ ...style, mainColor: [0, 0, 0] });
              }
            };
            img.onerror = () => {
              console.error('Error loading image:', style.picUrl);
              resolve(style);
            };
          });
        });

        Promise.all(stylePromises).then(stylesWithColors => {
          userStyle.value = stylesWithColors;
        });
      })
    },
    async ()=>{
      if (!isLogin.value) { return }
      getUserSubArtistsNewAlbum(6).then((data) => {
        console.log(data?.data?.newWorks)
        subscribeArtistsNewAlbum.value = data?.data?.newWorks
      })
    }
  ]

  Promise.resolve().then(paralleTask(tasks, 1)).then(()=>{
    tasks = null;
    webFrame.clearCache()
  })

}

onMounted(()=>{
  nextTick().then(load())
})
onActivated(() => {
  let watcher = watch(isLogin, (newVal, oldVal) => {
      load()
  })
  const d = new Date()
  date.value.month = d.getMonth() + 1
  date.value.date = d.getDate().toString().padStart(2, '0')
  onDeactivated(()=>{
    watcher()
  })
})

function randomGet(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getPersonalFMBackground(event) {
  const img = event.target
  getColor(img).then((data) => {
    personalFMBackground.value = createLinearGradient('45deg', data?.mainColor)
  })
}

function playSimiRecommendSongs(id) {
  let source = { type: 'simi_recommend', id: simiRecommendBaseSong.value.id }
  player.playInsertTracks(id, simiRecommend.value.map(i => { return { id: i.id, source } }), source)
}
function playHomepageStyleRecommendSongs(id) {
  let source = { type: 'simi_recommend', id: homepageStyleRCMD.value?.ui?.subTitle?.title || Date.now().toString() }
  player.playNewList(id, homepageStyleRCMD.value?.songs?.map(i => { return { id: i.id, source } }), source)
}
function playRedSimiSong(id) {
  let source = { type: 'simi_recommend', id: 'redsimi' }
  player.playNewList(id, redSimiSongs.value.map(i => { return { id: i.id, source } }), source)
}
function miniTrackMenuSelected({name,id} = _,item,playHandler) {
  const act = item?.act
  let source = { type: 'recommend_mini_song', id: id }
  const actions = {
    play: () => {
      if(playHandler){
        playHandler(id)
      }
    },
    addnext: () => {
      player.addTrackToNext(id, source)
    },
    browser: () => {
      const url = `https://music.163.com/#/song?id=${id}`
      window.electron.ipcRenderer.send('app:openWebView', url)
    },
    copylink: () => {
      const url = `https://music.163.com/#/song?id=${id}`
      window.navigator.clipboard.writeText(url)
      showMessageNotification("已复制")
    },
    downloadlyric: () => {
      toolkit.downloadLyric(id,name)
    },
    downloadNloLyric: () => {
      toolkit.downloadNloLyric(id,name)
    }
  }
  if (actions[act]) {
    actions[act]()
  }
}
</script>
<style scoped>
@media screen and (min-width: 1301px) {

  .official-playlists,
  .recommend-playlists {
    grid-template-columns: repeat(6, 1fr) !important;
  }

  .style-rcmd-detial .songs {
    grid-template-columns: repeat(4, 1fr) !important;
  }

  .head .recent-like-list .ctn {
    grid-template-columns: repeat(4, 1fr) !important;
  }

  .red-simisongs {
    grid-template-columns: repeat(4, 1fr) !important;
  }

  .simi-recommends {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 16px !important;
  }
}

.page {
  gap: 1rem;
  font-family: misans;
}

.head {
  width: 93%;
  height: 12rem;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 3rem;
}

.body {
  width: 93%;
  height: fit-content;
}

.row {
  display: flex;
  flex-direction: row;
}

.body:last-child {
  margin-bottom: 5rem;
}

.box-padding {
  padding: 1rem;
}

.ti {
  font-weight: 600;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  color: var(--strong);

  button {
    width: fit-content;
    height: fit-content;
    padding: 0.3rem;
    font-size: 1rem;
    border: none;
    background: none;
    color: var(--text-o-2);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--br-1);

  }

  button:hover {
    background: var(--hover);
  }
}

.head .daily-song {
  width: 27rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  background: var(--component);
  border-radius: var(--br-2);

  .title {
    position: absolute;
    left: 1rem;
    top: 1rem;
    z-index: 6;
    font-weight: 900;
    color: #fff;
  }
}

.head .daily-song .cover-shell {
  width: 100%;
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
}

.head .daily-song .cover-shell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  border-radius: var(--br-2);
}

.head .daily-song .cover-preview {
  width: fit-content;
  height: fit-content;
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  z-index: 4;
  display: flex;
  flex-direction: row;
  gap: 1rem;

}

.head .daily-song .cover-preview img {
  width: 3.5rem;
  height: 3.5rem;
  aspect-ratio: 1/1;
  border-radius: var(--br-2);
}

.head .daily-song .bottom-mask {
  position: absolute;
  width: 100%;
  height: 4rem;
  background: linear-gradient(to top, #000000c8, transparent);
  bottom: 0;
  left: 0;
  z-index: 3;
  border-radius: 0 0 var(--br-2) var(--br-2);
}

.head .daily-song .date {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 5;
  color: #fff;
  font-weight: 600;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
}

.cover-shell .main-cover {
  z-index: 2;
  filter: brightness(0.8);
}

.cover-shell .blur-cover {
  width: 90% !important;
  filter: blur(20px) saturate(0.8);
  bottom: -1rem;
  z-index: 1;
  opacity: 0.2;
}

.icon {
  width: 1.4em;
  height: 1.4em;
  color: var(--text-o-1);
}

.head .recent-like-list {
  height: auto;
  flex: 1;
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--component-diff);
  padding: 1.2rem;
  justify-content: space-between;
  border-radius: var(--br-2);
  box-shadow: var(--shadow);

  h2 {
    font-size: 1.2rem;
  }
}

.head .recent-like-list .ctn {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  gap: 25px;
  margin-top: 1rem;
}

.head .recent-like-list .ctn::-webkit-scrollbar {
  display: none;
}

.head .recent-like-list .ctn .playlist {
  width: 100%;
  position: relative;

  img {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: var(--br-2);
  }

  span {
    position: absolute;
    color: #fff;
    left: 0.5rem;
    top: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    z-index: 3;
  }

  .text-mask {
    position: absolute;
    width: 100%;
    height: 45%;
    background: linear-gradient(to bottom, #00000088, transparent);
    top: 0;
    z-index: 2;
    border-radius: var(--br-2) var(--br-2) 0 0;
  }
}

.official-playlist {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  .official-playlists {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    overflow: hidden;
    gap: 20px;
  }
}

.simi-recommend {
  width: 45%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--component-diff);
  border-radius: var(--br-3);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  box-sizing: border-box;
  position: relative;

  .ti {
    font-size: 1.1rem;
  }

  .simi-recommends {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: auto;
    gap: 10px;
  }
}

.personalfm {
  flex: 1;
  height: auto;
  max-width: 30rem;
  background-color: var(--component-diff);
  box-shadow: var(--shadow);
  padding: 1.4rem;
  margin-left: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: var(--br-2);
  position: relative;
  overflow: hidden;
  color: white;

  .cover {
    width: 9rem;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: var(--br-1);
  }

  .ep-info {
    height: fit-content;
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: auto;
    margin-top: 1rem;
    margin-left: 1rem;

    h2 {
      max-width: 15cqw;
    }
  }

  .control {
    position: absolute;
    display: flex;
    flex-direction: row;
    right: 2.4rem;
    bottom: 2.4rem;
    gap: 1rem;

    button {
      width: fit-content;
      height: fit-content;
      aspect-ratio: 1/1;
      display: flex;
      padding: 0.3rem;
      align-items: center;
      background: transparent;
      border: none;
      border-radius: var(--br-2);

      .icon {
        width: 2em !important;
        height: 2em;
      }
    }

    button:hover {
      background: var(--hover);
    }
  }
}

.recommend-playlist {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  .recommend-playlists {
    width: 100%;
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto;
    gap: 20px;
  }
}

.hotlists {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .hotlist {
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 25px;
  }
}

.alist {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: var(--component-diff);
  box-shadow: var(--shadow);
  border-radius: var(--br-2);
  gap: 0.8rem;
  overflow: hidden;

  .name {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--text-o-2);
  }

  .detial {
    display: flex;
    flex-direction: row;
    align-items: center;

    .cover {
      width: 5rem;
      height: 5rem;
      aspect-ratio: 1/1;
      flex-shrink: 0;
      border-radius: var(--br-2);
    }

    .list-items {
      height: 100%;
      display: flex;
      flex-direction: column;
      margin-left: 1rem;
      justify-content: space-around;

      .list-item {
        display: flex;
        flex-direction: row;
        gap: 0.3rem;

        .sel {
          font-weight: 600;
          color: var(--text-o-3);
        }

        .song-name {
          max-width: 20rem;
        }

        .artist-name {
          opacity: 0.5;
          max-width: 20rem;
        }

        .artist-name::before {
          content: '-';
          margin-left: 0.5rem;
        }
      }
    }
  }
}

.starpick {
  min-height: 4rem;
  background: var(--component-diff);
  border-radius: var(--br-2);
  box-shadow: var(--shadow);
  outline: 1px solid var(--app);
  padding: 0.8rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .comment {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-o-2);
    margin-left: 1rem;
  }

  .refer {
    margin-left: auto;
    margin-right: 5rem;
    text-align: right;
    opacity: 0.6;

    .user {
      color: var(--strong);
    }
  }

  .refer::before {
    content: '———';
    margin-right: 0.5rem;
  }
}

.style-rcmd {
  display: flex;
  flex-direction: row;
  height: auto;
  gap: 1.5rem;

  .style {
    width: 100%;
    height: 3rem;
    border-radius: var(--br-2);
    box-sizing: border-box;
    padding: 0.7rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 700;
    position: relative;
    overflow: hidden;
    ;


    .icon {
      position: absolute;
      right: 0;
      width: 70%;
      height: auto;
      object-fit: cover;
      z-index: 0;
      mask: linear-gradient(to left, white 0%, rgba(0, 0, 0, 0) 80%);
    }
  }

  .style-rcmd-detial {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .songs {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem 1rem;
  }

  .user-style {
    width: 12rem;
    height: 15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: var(--component-diff);
    box-sizing: border-box;
    padding: 0.8rem;
    border-radius: var(--br-2);
  }
}

.red-simi {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.red-simisongs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem 1rem;

}
.artist-new{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
