<template>
   <div class="page">
      <h2 class="pt">Playlist Of {{ cat }}

         <button @click="refresh">刷新</button>
      </h2>
      <div class="playlists g-shell-6">
         <PlaylistCard v-for="playlist in playlists" :name="playlist?.name" :cover="playlist?.coverImgUrl"
            :id="playlist?.id" :key="playlist?.id"
            />

         <div class="loadmore" ref="loadMore" style="height: 5rem;"></div>
      </div>
   </div>
</template>
<script setup>
import { getCatPlaylist } from '@/api/playlist';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PlaylistCard from '@/components/PlaylistCard.vue';
import { onUnmounted } from 'vue';
import { onActivated } from 'vue';
let isLoading = false
let cat = ref("")
let page = 0
let loadMore = ref(null)
let playlists = ref([])
let pageSize = 20
let last = 1;
let loadOb

function load() {
   isLoading = true
   Promise.resolve().then(() => {
      getCatPlaylist(cat.value, page, pageSize).then(data => {
         last = data?.playlistIds?.length - pageSize || -1
         playlists.value.push(...data?.playlists)
         isLoading = false
         page++
      })
   })
}
function refresh() {
   isLoading = true
   page = 0
   last = 1
   playlists.value = []
   load()
}
function init(){
   page = 0
   last = 1
   playlists.value = []
   cat.value = useRoute().params?.cat
   loadOb = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
         if (ent.isIntersecting && !isLoading && last > 0) {
            load()
         }
         else if (last <= 0) {
            loadMore.value && loadOb.unobserve(loadMore.value)
            loadOb.disconnect()
            loadOb = null
            loadMore.value.remove()
         }
      });
   })
   if (loadMore.value) {
      loadOb.observe(loadMore.value)
   }
}
onMounted(() => {
  init()
})
onUnmounted(() => {
   playlists = null
   isLoading = false
   loadOb = null
   window.webFrame.clearCache()
})
</script>
<style scoped>
.page {
   gap: 1.2rem;
   padding-top: 1.5rem;
}
.pt{
   display: flex;
   flex-direction: row;
   align-items: center;
   button{
      padding: 0.2rem 0.5rem;
      border-radius: 0.3rem;
      background-color: var(--ui);
      color: white;
      border: none;
      cursor: pointer;
      margin-left: auto;
      margin-right: 0;
      font-size: 1rem;
   }
   button:hover{
      background-color: var(--hover);
   }
}
.playlists {
   width: 93%;
}

.playlists:last-child {
   margin-bottom: 5rem;
}
</style>