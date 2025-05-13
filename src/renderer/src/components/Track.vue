<template>
  <div class="tracks">
    <Song
      v-for="(song, index) in tracks"
      :source=source
      :trackDetial="{
          name: song.name,
          cover: song.al.picUrl,
          artist: song.ar,
          album: song.al,
          id: song.id,
          duration: song.dt,
          tns: song.tns || null,
          alia: song.alia,
          mv: song.mv
      }"
      :index="index"
    ></Song>
  </div>
</template>
<script>
import Song from "./Song.vue";
import { ob } from "@/utils/libs";
export default {
    data(){
        return{
            ob:ob
        }
    },
  components: {
    Song,
  },
  props: ["tracks","source"],
  mounted(){
    console.log(this.tracks)
  }
};
</script>
<style scoped>
.tracks {
  width: 95%;
  display: flex;
  flex-direction: column;
  scroll-snap-type: proximity;
}
</style>
