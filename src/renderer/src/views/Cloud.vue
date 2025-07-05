<template>
  <div class="page">
    <h2 class="pt">云盘</h2>
    <div class="actions">
      <button>播放</button>
      <button>上传</button>
      <button>下载</button>
    </div>
    <div class="tracks">
      <Song v-for="(song, index) in songs" :source="{ type: 'cloud', id: null }" :trackDetial="{
        name: song?.name,
        cover: song?.al?.picUrl,
        artist: song?.ar,
        album: song?.al,
        id: song?.id,
        duration: song?.dt,
        tns: song?.tns || null,
        alia: song?.alia,
        mv: song?.mv
      }" :menu="[
        { label: '播放', act: 'play', icon: 'ion:play' },
        { label: '添加到下一首', act: 'addnext', icon: 'material-symbols-light:add-notes' },
        'hr',
      ]" :index="index" @play="playTracks" @menu="trackMenuSelected">
      </Song>
      <div class="loadmore" ref="loadMore" style="height: 5rem;"></div>
    </div>

  </div>
</template>
<script setup>
import { getCloud } from '@/api/cloud';
import { onUnmounted } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import Song from '@/components/Song.vue';
import { player } from '@/main';
let isLoading = false
let songs = ref([])
let page = 0
let more = true
let loadMore = ref(null)
function load() {
  isLoading = true
  getCloud(page, 200).then(data => {
    page++
    console.log(data)
    more = data?.hasMore
    songs.value.push(...data?.data?.map(i => i?.simpleSong))
    isLoading = false
    console.log(songs)
  })
}
let loadOb;
onMounted(() => {
  loadOb = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting && !isLoading && more) {
        load()
      }
      else if (!more) {
        loadOb.disconnect()
        loadMore.value && loadMore.value.remove()
      }
    })
  })

  if (loadMore.value) {
    loadOb.observe(loadMore.value)
  }
})
onUnmounted(() => {
  loadOb = null
})
function playTracks(id) {
  let source = {
    type: "cloud",
    id: null,
  }
  console.log(songs.value.map(i => {
    return {
      id: i?.id,
      source
    }
  }))
  player.playNewList(id, songs.value.map(i => {
    return {
      id: i?.id,
      source
    }
  }), source)
}
function trackMenuSelected(track,item) {
  let id = track?.id
  let name = track?.name
  const act = item?.act
  let source = { type: 'cloud', id: null }
  const actions = {
    play: () => {
      playTracks(id)
    },
    addnext: () => {
      player.addTrackToNext(id, source)
    }
  }
  if (actions[act]) {
    actions[act]()
  }
}
</script>
<style>
.page {
  gap: 1.5rem;
  padding-top: 1.5rem;
}

.tracks {
  width: 93%;
  margin-bottom: 7rem;
}
</style>