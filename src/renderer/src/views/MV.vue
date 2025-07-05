<template>
  <div class="page">
    <div class="info">
      <h2>{{data.name}}</h2>
      <span>{{ data.artistName }}</span>
    </div>
    <VideoPlayer
      :id="this.id"
      :brs="data.brs"
      :cover="data.cover"
      class="video-player"
      v-if="data"
    ></VideoPlayer>
   
    
  </div>
</template>
<script>
import VideoPlayer from '@/components/VideoPlayer.vue'
import * as req_mv from '../api/mv'
import { formatNumber } from '@/utils/libs'
export default {
  components: {
    VideoPlayer
  },
  data() {
    return {
      data: null,
      brs: []
    }
  },
  methods: {
    async loadMv(id) {
      this.data = (await req_mv.getMvDetial(id)).data
    },
    formatNumber
  },
  created() {
    this.loadMv(this.id)
    window.scrollTo({ top: 0 })
  },
  props: ['id'],
}
</script>
<style scoped>
.page {
  padding-bottom: 5rem;
}
.video-player {
  width: 95%;
  height:80vh;
  position: relative;
  border-radius: 1rem;
}
.info {
  width: 95%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  
  margin-top: 1rem;
  margin-bottom: 1rem;

  span{
    font-size: 0.9rem;
    color: var(--text-o-4);
  }
}
</style>
