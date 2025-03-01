<template>
  <div class="page">
    <div class="head">
      <div class="daily-song" @click="router.push({name:'DailyRecommend'})">
        <div class="cover-shell">
          <img :src="dailySongs[0]?.al.picUrl" alt="" class="main-cover" />
          <img :src="dailySongs[0]?.al.picUrl" alt="" class="blur-cover" />
        </div>
        <div class="cover-preview">
          <img :src="i?.al?.picUrl" alt="" v-for="i in dailySongs.slice(1, 4)" />
        </div>
        <div class="bottom-mask"></div>
        <div class="date">
          <Icon icon="material-symbols:calendar-today" class="icon" style="color: white" />
          {{ date?.month }}月{{ date?.date }}日
        </div>
        <h2 class="title">每日推荐</h2>
      </div>
      <div class="recent-like-list" v-if="isLogin">
        <h2>猜你最近喜欢</h2>
        <div class="ctn">
          <div class="playlist" v-for="likelist in recentLikes?.slice(0, 4)" @click="router.push({name:'Playlist',params:{id:likelist?.resourceId}})">
            <span>{{ likelist?.title }}</span>
            <img :src="likelist?.coverUrlList[0]" alt="" />
            <div class="text-mask"></div>
          </div>
        </div>
      </div>
      <div class="sing-up"></div>
    </div>
    <div class="body">
      <div class="shell official-playlist">
        <h2 class="ti">雷达歌单</h2>
        <div class="official-playlists">
          <PlaylistCard
            v-for="officialPlaylist in officialPlaylist?.slice(0, deviceScreenSize < 1 ? 5 : 6)"
            :name="officialPlaylist?.name"
            :cover="officialPlaylist?.coverImgUrl"
            :id="officialPlaylist?.id"
            class="card"
            @playall="player.playPlaylist(null,null,{type:'playlist',id:officialPlaylist?.id},true)"
          ></PlaylistCard>
        </div>
      </div>
    </div>
    <div class="body row" v-if="isLogin">
      <div class="shell simi-recommend">
        <h2 class="ti">根据「{{ simiRecommendBaseSong?.name }}」为您推荐</h2>
        <div class="simi-recommends">
          <Song_Small
            v-for="song in simiRecommend"
            :name="song?.name"
            :cover="song?.album?.picUrl"
            :artist="song?.artists"
            :id="song?.id"
            @play="
              playSimiRecommendSongs
            "
          >
          </Song_Small>
        </div>
      </div>
      <div class="shell personalfm" :style="{ background: personalFMBackground }">
        <img
          :src="personalFM?.album?.picUrl"
          alt=""
          class="cover"
          crossorigin="anonymous"
          @load="getPersonalFMBackground"
        />
        <div class="ep-info">
          <h2 class="text-limit">{{ personalFM?.name }}</h2>
          <ArtistNameGroup :array="personalFM?.artists"></ArtistNameGroup>
        </div>
        <div class="control">
          <button @click="player.playPersonalFM(true)">
            <Icon icon="ion:play" class="icon" />
          </button>
          <button @click="player.nextFM()">
            <Icon icon="fluent:next-32-filled" class="icon" />
          </button>
        </div>
      </div>
    </div>
    <div class="body recommend-playlist">
      <h2 class="ti">推荐歌单</h2>
      <div class="recommend-playlists">
        <PlaylistCard
          v-for="rp in recommendPlaylist?.slice(0, deviceScreenSize < 1 ? 10 : 12)"
          :name="rp?.name"
          :cover="rp?.picUrl"
          :id="rp?.id"
          class="card"
          @playall="player.playPlaylist(null,null,{type:'playlist',id:rp?.id},true)"
        ></PlaylistCard>
      </div>
    </div>
    <div class="body hotlists">
      <h2 class="ti">热门榜单</h2>
      <div class="hotlist">
        <div class="alist" v-for="list in toplist">
          <h3 class="name">{{ list?.name }}</h3>
          <div class="detial">
            <img :src="list?.coverImgUrl" alt="" class="cover" />
            <ul class="list-items">
              <li class="list-item" v-for="(item, index) in list?.tracks || []">
                <span class="sel">{{ index + 1 }}.</span>
                <span class="song-name text-limit">{{ item?.first }}</span>
                <span class="artist-name text-limit">{{ item?.second }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      class="body starpick"
      @click="
        () => {
          if (starpickCommentShowIndex < starpickComment.length - 1) {
            starpickCommentShowIndex++
          } else {
            starpickCommentShowIndex = 0
          }
        }
      "
    >
      <p class="comment">{{ starpickComment[starpickCommentShowIndex]?.content }}</p>
      <span class="refer"
        >用户<span class="user">{{
          starpickComment[starpickCommentShowIndex]?.user?.nickname
        }}</span
        >在歌曲<span class="song"
          >「{{ starpickComment[starpickCommentShowIndex]?.refer?.name }}」</span
        >的评论</span
      >
    </div>
  </div>
</template>
<script setup>
import { getDailySong, getRadio, getRecentLike } from '@/api/recommend'
import { onActivated } from 'vue'
import { onBeforeMount } from 'vue'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import {
  getRecommendPlaylist,
  getSimiSong,
  getToplistDetial,
  getStarpickComments
} from '@/api/recommend'
import PlaylistCard from '@/components/PlaylistCard.vue'
import Song_Small from '@/components/Song_Small.vue'
import { computed } from 'vue'
import { store } from '@/store'
import { getUserRecentListen } from '@/api/user'
import { player } from '@/main'
import ArtistNameGroup from '@/components/ArtistNameGroup.vue'
import { getColor } from '@/musicplayer/color'
import { createLinearGradient } from '@/utils/imageProcess'
import { watch } from 'vue'
import router from '@/router'

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
const loginStatus = computed(()=>{
  return store.state.loginStatus
})
const isLogin = computed({
  get:()=>store.state.isLogin,
})
const dailySongs = ref([])
const recentLikes = ref([])
const officialPlaylist = ref([])
const simiRecommendBaseSong = ref({})
const simiRecommend = ref([])
const personalFMBackground = ref('')
const recommendPlaylist = ref([])
const artistToplist = ref({})
const toplist = ref([])
const rewardToplist = ref({})
const starpickComment = ref([])
const starpickCommentShowIndex = ref(0)
function load() {
  getDailySong().then((data) => {
    dailySongs.value = data?.data?.dailySongs
  })
  getRecentLike().then((data) => {
    recentLikes.value = data?.data?.resources
    console.log(data)
  })
  getRecommendPlaylist().then((data) => {})
  getRadio().then((data) => {
    officialPlaylist.value = data
  })
  watch(
    isLogin,
    () => {
      if (profile.value?.userId && isLogin.value) {
        getUserRecentListen(profile.value?.userId).then((data) => {
          const baseSong = randomGet(data?.weekData.slice(0, 10))
          const baseSongId = baseSong?.song?.id
          simiRecommendBaseSong.value = baseSong?.song
          getSimiSong(baseSongId).then((songs) => {
            console.log(songs)
            simiRecommend.value = songs?.songs
          })
        })
        
      }
    },
    { immediate: true }
  )
  getRecommendPlaylist().then((data) => {
    recommendPlaylist.value = data?.result.sort(() => {
      return 0.5 - Math.random()
    })
  })
  getToplistDetial().then((data) => {
    artistToplist.value = data?.artistToplist
    rewardToplist.value = data?.rewardToplist
    toplist.value = data?.list?.slice(0, 4)
  })
  getStarpickComments().then((data) => {
    let comments = []
    const creatives = data?.data?.blocks[0]?.creatives
    for (let create of creatives) {
      comments.push(...create?.resources)
    }
    comments = comments.map((i) => {
      return {
        content: i?.uiElement?.mainTitle?.titleDesc,
        user: i?.resourceExtInfo?.users[0],
        refer: i?.resourceExtInfo?.songData
      }
    })
    starpickComment.value = comments
  })
}
onBeforeMount(() => {
  load()
})
onActivated(() => {
  const d = new Date()
  date.value.month = d.getMonth() + 1
  date.value.date = d.getDate().toString().padStart(2, '0')
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

function playSimiRecommendSongs(id){
  let source = {type:'simi_recommend',id:simiRecommendBaseSong.value.id}
  player.playInsertTracks(id,simiRecommend.value.map(i=>{return {id:i.id,source}}),source)
}
</script>
<style scoped>
@media screen and (min-width: 1301px) {
  .official-playlists,
  .recommend-playlists {
    grid-template-columns: repeat(6, 1fr) !important;
  }
}
.page {
  gap: 2rem;
  font-family: misans;
}
.head {
  width: 90%;
  height: 12rem;
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-top: 3rem;
}
.body {
  width: 90%;
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
  letter-spacing: 1.5px;
}
.head .daily-song {
  width: 25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  background: var(--component);
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
  font-size: 1.2rem;
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
  width: 30rem;
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
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  gap: 25px;
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
  width: 50%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--component-diff);
  border-radius: var(--br-3);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  .ti {
    font-size: 1.1rem;
  }
  .simi-recommends {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 16px;
  }
}
.personalfm {
  flex: 1;
  height: auto;
  background-color: var(--component-diff);
  box-shadow: var(--shadow);
  padding: 1.4rem;
  margin-left: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: var(--br-3);
  position: relative;
  overflow: hidden;
  .cover {
    width: 12rem;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: var(--br-2);
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
  gap: 1.5rem;
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
</style>
