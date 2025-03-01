<template>
  <div class="cloud page">
    <div class="p-title">
      <img src="@/assets/images/cloud.svg" alt="" class="i icon" /><span
        >我的云盘</span
      >
    </div>
    <div class="bar">
      <button class="btn colorbtn">
        <img src="@/assets/images/u-upload.svg" alt="" class="i" />上传
      </button>
      <button class="btn colorbtn">
        <img src="@/assets/images/u-download.svg" alt="" class="i" />下载
      </button>
      <button class="btn">
        <img
          src="@/assets/images/play-solid.svg"
          alt=""
          class="i icon"
        />播放全部
      </button>
      <button class="btn">
        <img src="@/assets/images/u-list.svg" alt="" class="i icon" />
      </button>
      <div class="size">
        <div class="num">已用 {{ size }} / 共 {{ maxSize }}</div>
        <div class="pro">
          <span class="width" :style="{ width: this.per * 100 + '%' }"></span>
        </div>
      </div>
    </div>

    <div class="files">
      <div class="ts">
        <span>歌曲</span>
        <span>专辑</span>
        <span>上传时间</span>
      </div>
      <Song
        v-for="(file, index) in data"
        :name="file.simpleSong.name"
        :index="index"
        :artist="file.simpleSong.ar"
        :id="file.simpleSong.id"
        :cover="file.simpleSong.al ? file.simpleSong.al.picUrl : ''"
        :lazyOb="ob"
        :cloud="true"
        :cloudPack="{
          artist: [{ name: file.artist }],
          name: file.songName,
          album: file.album,
        }"
        :album="file.simpleSong.al"
        :mv="file.simpleSong.mv"
        :date="file.addTime"
      >
      </Song>
      <div ref="loadmore" v-if="this.more">
        <img src="@/assets/images/loading.svg" alt="" class="loader icon" />
      </div>
    </div>
  </div>
</template>
<script>
import * as req_cloud from "../api/cloud";
import { formatBytes } from "@/utils/libs";
import Song from "@/components/Song.vue";
export default {
  name: "Cloud",
  components: {
    Song,
  },
  data() {
    return {
      maxSize: undefined,
      size: undefined,
      per: 0,
      count: 0,
      data: [],
      time: null,
      ob: new IntersectionObserver((entries) => {
        clearTimeout(this.time);
        this.time = setTimeout(() => {
          entries.forEach((item) => {
            if (item.isIntersecting) {
              item.target.src = item.target.dataset.src;
              item.target.classList.remove("lazyload");
              item.target.classList.add("loaded");
              this.ob.unobserve(item.target);
            }
          });
        }, 0);
      }),
      page: 1,
      more: true,
    };
  },
  methods: {
    async getCloudSong(page = 1) {
      const data = await req_cloud.userCloud(page, 30);
      if (page === 1) {
        this.maxSize = formatBytes(data.maxSize);
        this.size = formatBytes(data.size);
        this.per = data.size / data.maxSize;
        this.count = data.count;
      }
      this.data.push(...data.data);
      this.more = data.hasMore;
    },
    formatBytes,
    autoLoad() {
      let f = false;
      const b = new IntersectionObserver((entries) => {
        entries.forEach((item) => {
          if (item.isIntersecting) {
            if (this.more && !f) {
              f = true;
              this.getCloudSong(++this.page).then(() => {
                f = false;
              });
            } else if (!this.more) {
              b.unobserve(this.$refs.loadmore);
            }
          }
        });
      });
      b.observe(this.$refs.loadmore);
    },
  },
  created() {
    this.getCloudSong(1).then(() => {
      this.autoLoad();
    });
  },
  mounted() {},
  props: [],
};
</script>
<style scoped>
.p-title {
  margin-left: 2.5%;
}

.bar {
  width: 95%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1cqw;
  height: 2.5rem;
}

.bar .btn {
  font-weight: 600;
  height: 2.2rem;
}

.colorbtn .i {
  filter: invert(1);
  width: 1.4cqw;
}

.colorbtn {
  background: var(--app-theme-strong-background);
  color: #fff;
}

.size {
  width: 25%;
  height: 2.5rem;
  background: var(--app-theme-component);
  padding: 0 1cqw;
  border-radius: 0.4cqw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto 0 auto auto;
  box-shadow: 1px 1px 4px #0000001b;
}

.size .num {
  font-size: 0.8cqw;
  margin-bottom: 0.2cqw;
  opacity: var(--text-opacity-3);
}

.pro {
  width: 100%;
  height: 10%;
  background: #cdcdcd;
  display: flex;
  overflow: hidden;
  position: relative;
  border-radius: 2px;
  align-items: center;
}

.width {
  height: 100%;
  position: absolute;
  left: 0;
  background: var(--app-theme-strong);
}

.files {
  width: 95%;
  display: flex;
  flex-direction: column;
}

.ts {
  width: 95%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 2cqw;
}

.ts span {
  position: absolute;
  font-size: medium;
  opacity: var(--text-opacity-4);
}

.ts span:nth-child(1) {
  left: calc(2.5% + 1.2rem);
}

.ts span:nth-child(2) {
  left: 36%;
}

.ts span:nth-child(3) {
  left: 64.2%;
}

.ts span:nth-child(2)::before,
span:nth-child(3)::before {
  background: var(--app-theme-component);
  border-radius: 0.5px;
  content: "";
  display: inline-block;
  height: 16px;
  inset-inline-start: -15px;
  position: absolute;
  top: calc(50% - 3px);
  transform: translateY(-50%);
  width: 1px;
}
.loader {
  width: 1.2cqw;
  display: block;
  margin: 1cqw auto 1cqw auto;
}
</style>
