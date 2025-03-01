<template>
  <div class="top">
    <div class="top-bar">
      <div class="route-control">
        <button @click="router.back()">
          <Icon icon="icon-park-outline:left" class="icon" />
        </button>
        <button @click="router.go(1)">
          <Icon icon="icon-park-outline:right" class="icon" />
        </button>
      </div>
      <div class="search" :class="{ 'search-focus': isFocus }" ref="searchContainer">
        <input
          type="text"
          name=""
          id=""
          class="search-input"
          ref="searchInput"
          @compositionstart="isComposing = true"
          @compositionend="
            isComposing = false;
            getSearchRecommend($event)
          "
          @input="getSearchRecommend($event)"
          @keydown.self="$event.key === 'Enter' && goSearch()"
          @click.stop
          @focusin="handleSearchRecommend()"
          placeholder="搜索想听的内容"
        />
        <Icon icon="material-symbols:search" class="icon-1" @click.stop="goSearch()" />
      </div>

      <Transition name="searchRecommend">
        <ul class="search-recommend" v-if="isFocus" @click.stop>
          <h3 class="search-title">{{ searchIndex ? '热门搜索' : '猜你想搜' }}</h3>
          <li
            v-for="item in sr.slice(0, 11)"
            @click="handleQuickJump(item)"
            :class="{ hlj: item?.rawType !== 'only' }"
          >
            <span class="title" v-html="item?.name"></span>
            <span class="reason" v-if="item?.reason">{{ item?.reason }}</span>
            <span class="type">{{ item?.type }}</span>
          </li>
        </ul>
      </Transition>
      <div class="app-control">
        <!-- <Icon icon="material-symbols:dark-mode-outline-rounded" class="icon" @click="setTheme({key:'color',value:'default:dark'})" v-show="theme.computedColor === 'light'"/>
        <Icon icon="material-symbols:light-mode-outline-rounded" class="icon" @click="setTheme({key:'color',value:'default:light'})" v-show="theme.computedColor === 'dark'"/> -->
        <button @click="minimize()">
          <Icon icon="mingcute:minimize-line" class="icon" />
        </button>
        <button @click="maximize()">
          <Icon icon="fluent:maximize-20-filled" class="icon" />
        </button>
        <button @click="close()">
          <Icon icon="material-symbols:close" class="icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { searchRecommend ,getHots} from '@/api/search'
import router from '@/router'
import { Icon } from '@iconify/vue'
import { onMounted } from 'vue'
import { ref ,computed} from 'vue'
import { store } from '@/store'
import { setTheme } from '@/lib/theme';
let isComposing = false
const isFocus = ref(false)
const searchInput = ref(null)
const searchHistory = JSON.parse(localStorage.getItem('neko_search_history')) || []
const searchIndex = ref(false)
let srMap = {
  songs: '单曲',
  playlists: '歌单',
  albums: '专辑',
  artists: '艺术家',
  mvs: 'MV'
}
const theme = computed(()=>{
  return store.state.theme
})
const sr = ref([])
let searchTimer
function getSearchRecommend(event, im = false) {
  if (isComposing) {
    return
  }
  if (!event.target.value) {
    sr.value = []
    searchIndex.value = true
  }
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    handleSearchRecommend()
  }, 200)
}

async function handleSearchRecommend() {
  let text = searchInput.value.value || ""
  if (!text) {
    sr.value = []
    searchIndex.value = true
    let hots = (await getHots())?.data || []
    hots = hots.map(i=>{return {
      name: i.searchWord,
      type: '',
      rawType: 'only',
      id: '',
      keyword: i.searchWord,
      reason: ""}
    })
    sr.value = hots
    return
  } else {
    sr.value = []
    searchIndex.value = false
    let pc = (await searchRecommend(text))?.result
    let mobile = (await searchRecommend(text, 'mobile'))?.result?.allMatch || []
    let pcOrder = pc?.order || []
    let result = []
    result.push(
      ...mobile.map((i) => {
        return {
          name: highlight(text, i.keyword),
          type: '',
          rawType: 'only',
          id: '',
          keyword: i.keyword,
          reason: parseReason(i.alg)
        }
      })
    )
    for (let type of pcOrder) {
      if (type === 'songs') {
        continue
      }
      if (!pc[type]) {
        continue
      }
      pc[type].forEach((i) => {
        i.type = srMap[type]
        i.rawType = type
        i.keyword = i.name
        i.name = highlight(text, i.name)
      })
      result.push(...pc[type])
    }
    sr.value = result
  }

  function highlight(key, str) {
    let reg = new RegExp(key, 'g', 'i')
    str = str.replace(reg, `<b style="color:var(--strong)">${key}</b>`)
    return str
  }

  function parseReason(alg) {
    if (alg.includes('Like')) {
      return '我喜欢的'
    } else if (alg.includes('Heard')) {
      return '曾经听过'
    } else if (alg.includes('NewSong')) {
      return '发现新歌'
    }
  }
}

const handleBlur = () => {
  isFocus.value = false
  window.removeEventListener('click', handleBlur)
}
const handleFocus = () => {
  isFocus.value = true
  setTimeout(() => {
    window.addEventListener('click', handleBlur)
  }, 500)
}
onMounted(() => {
  searchInput.value.addEventListener('focus', handleFocus)
})

function handleQuickJump(item) {
  const rawType = item?.rawType
  if (!rawType) {
    return
  }
  handleBlur()
  if (rawType === 'albums') {
    router.push({ name: 'Album', params: { id: item.id } })
  } else if (rawType === 'playlists') {
    router.push({ name: 'Playlist', params: { id: item.id } })
  } else if (rawType === 'artists') {
    router.push({ name: 'Artist', params: { id: item.id } })
  } else if (rawType === 'only') {
    searchInput.value.value = item.keyword
    goSearch(item.keyword)
  }
}

function goSearch(keyword) {
  let key = keyword || searchInput.value.value
  if (!key) {
    return
  }
  handleBlur()
  router.push({ name: 'Search', query: { keyword: key } })
}

function minimize(){
  window.electron.ipcRenderer.send('main:minimize')
}
function maximize(){
  window.electron.ipcRenderer.send('main:maximize')
}
function close(){
  window.electron.ipcRenderer.send('main:close')
}
</script>
<style scoped>
.top {
  height: var(--top-bar-height);
  width: calc(100% - var(--side-bar-width));
  left: var(--side-bar-width);
  top: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  justify-content: center;
  z-index: 100;

}

.top-bar {
  --pad: 3%;
  width: calc(100% - 2 * var(--pad));
  padding: 0 var(--pad) 0 var(--pad);
  height: 100%;
  padding-top: 0.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  -webkit-app-region: drag;
  -webkit-user-select: none;
}

.top-bar span,
a,
button,
svg,
img,
input {
  -webkit-app-region: no-drag !important;
}

button {
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem;
  background: none;
  border: none;
  border-radius: var(--br-1);
  color: inherit;
  transition: 0.15 cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

button:hover {
  background: var(--hover);
}

.icon {
  width: 2.2em;
  height: 2.2em;
  color: inherit;
}

.icon-1 {
  width: 1.5em;
  height: 1.5em;
  color: inherit;
}

.route-control {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  color: var(--text);
}

.search {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: var(--br-1);
  background: var(--ui);
  width: 15rem;
  height: fit-content;
  padding: 0rem 0.7rem;
  right: 9rem;
  position: absolute;
  transition: 0.2s;
}

.search-focus {
  right: calc(50% - 13rem);
  width: 26rem;
  outline: var(--strong) 1px solid;
}

.search .search-input {
  flex: 1;
  height: auto;
  padding: 0.5rem 0.6rem 0.5rem 0rem;
  font-size: 0.9rem;
  outline: none;
  background: transparent;
  border: none;
  color: var(--text);
}

.app-control {
  display: flex;
  flex-direction: row;
  gap: 0.2rem;
  height: fit-content;
  width: fit-content;
  border-left: 1px solid var(--border);
  margin: auto 0 auto auto;
}

.app-control .icon {
  width: 1.5rem;
  height: 1.5rem;
}

.app-control > :first-child {
  margin-left: 0.5rem;
}

.search-recommend {
  position: absolute;
  width: 26rem;
  height: 27.5rem;
  background: var(--component);
  right: calc(50% - 13rem);
  top: 100%;
  padding: 0.5rem 0.7rem;
  border-radius: var(--br-1);
  box-shadow: var(--shadow-flow);
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.show-search-recommend {
  height: 25rem;
  outline: var(--ui) 1.4px solid;
  opacity: 1;
}

.search-recommend li {
  text-decoration: none;
  list-style: none;
  width: 95%;
  padding: 0.5rem 0.58rem;
  height: auto;
  display: flex;
  align-items: center;
  border-radius: var(--br-1);
}

.search-recommend li:hover {
  background: var(--hover);
}

.search-recommend li .type {
  margin-left: auto;
  margin-right: 0;
  color: var(--text-o-4);
  font-size: 0.8rem;
}
.search-recommend .search-title{
  width: 95%;
  margin-bottom: 0.5rem;
}
.hlj:first-child {
  margin-top: 3rem;
}
.reason {
  font-size: 0.7rem;
  padding: 0.1rem 0.2rem;
  border-radius: var(--br-1);
  display: flex;
  align-items: center;
  background: var(--ui-light);
  margin-left: 0.4rem;
}
.searchRecommend-enter-from,
.searchRecommend-leave-to {
  opacity: 0;
  height: 0rem;
}
.searchRecommend-enter-to,
.searchRecommend-leave-from {
  opacity: 1;
}

</style>
