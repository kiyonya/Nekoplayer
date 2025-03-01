<template>
  <div
    class="song"
    :data-id="id"
    :class="this.$audio.musicId.value === id ? 'strong' : ''"
  >
    <div class="cover-shell">
      <img
        src="@/assets/images/play-solid.svg"
        alt=""
        class="play-btn"
        @click="this.$audio.play(this.id, { rs: rs, replaceResource: false })"
      />
      <img
        :data-src="
          cover ||
          'https://p1.music.126.net/0ju8ET1ApZSXfWacc4w49w==/109951169484091680.jpg?param=50y50'
        "
        class="lazyload cover"
        ref="cover"
        alt=""
      />
    </div>

    <div class="info">
      <span class="name text-limit">{{ this.name }}</span>
    </div>

    <div class="act">
      <img
        src="@/assets/images/link.svg"
        alt=""
        class="i icon"
        @click="gotoRs()"
        v-if="['playlist','album'].includes(this.rs.type) && rs.id"
        title="查看来源"
      />
      <img src="@/assets/images/like.svg" alt="" class="i icon" />
      <img src="@/assets/images/add.svg" alt="" class="i icon" />
    </div>
    <span class="dt">{{ mmss(duration) }}</span>
  </div>
</template>
<script>
import { mmss } from "@/utils/timers";
export default {
  data() {
    return {
      playing: this.$audio.musicId.value === this.id,
    };
  },
  mounted() {
    if (this.lazyOb) {
      this.lazyOb.observe(this.$refs.cover);
    }
    console.log(this.rs)
  },
  props: ["index", "name", "artist", "cover", "duration", "rs", "id", "lazyOb"],
  created() {},
  methods: {
    mmss,
    gotoRs() {
      if (this.rs.type === "playlist" && this.rs.id) {
        this.$router.push({
          name: "Playlist",
          params: {
            id: this.rs.id,
          },
        });
      } else if (this.rs.type === "album" && this.rs.id) {
        this.$router.push({
          name: "Album",
          params: {
            id: this.rs.id,
          },
        });
      }
    },
  },
};
</script>
<style scoped>
.song {
  width: 100%;
  height: 2.8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: transparent;
  gap: 0.5rem;
  border-radius: 0.3rem;
  transition: 0.1s;
  padding: 0.1rem 0;
  position: relative;
}
.song:hover {
  .play-btn {
    opacity: 1;
  }
  .cover {
    filter: brightness(0.6);
  }
}
.song:hover {
  background: var(--mid-glay);
}
.play-btn {
  position: absolute;
  width: 50%;
  aspect-ratio: 1/1;
  opacity: 0;
  z-index: 5;
  filter: invert(1);
}
.playing {
  width: 1rem;
  aspect-ratio: 1/1;
  padding: 0 0.25rem;
  margin-left: 0.5rem;
}
@keyframes bePlay {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
.strong {
  background: var(--app-theme-strong-background) !important;
  animation: bePlay 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: 0.3s;
  color: #fff;
}
.strong .artist-name-ref {
  color: #fff !important;
}
.strong .artist-name-ref::before {
  color: #fff !important;
}
.strong .artist-name-ref:hover {
  color: #000 !important;
}
.name {
  font-size: 1rem;
  flex: 1;
  max-width: 12rem;
}
.cover-shell {
  height: 90%;
  aspect-ratio: 1/1;
  flex-shrink: 0;
  border-radius: 0.2rem;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover-shell .cover {
  width: 100%;
  aspect-ratio: 1/1;
}
.info {
  display: flex;
  flex-direction: column;
}
.info .artist {
  font-size: 0.8rem;
  flex: 1;
  max-width: 12rem;
}
.serial {
  margin-left: 0.5rem;
  min-width: 1.5rem;
  font-size: 0.9rem;
}
.dt {
  font-size: 0.8rem;
  margin-left: auto;
  margin-right: 0.7rem;
  flex-shrink: 0;
  opacity: var(--text-opacity-3);

}
.act {
  width: fit-content;
  flex-direction: row;
  gap: 0.5rem;
  margin: auto 0 auto auto;
  display: none;
}
.act .i {
  width: 1.1rem;
}
.song:hover {
  .name {
    width: 7rem;
  }
  .artist {
    width: 7rem;
  }
  .act {
    display: flex;
  }
}
</style>
