<template>
  <div class="page">
    <div class="cats">
      <RouterLink
        v-for="(key, value) in _defaultTags"
        :to="{ name: 'Discover', query: { cat: value } }"
        :class="cat == value ? 'actived' : ''"
        >{{ key }}</RouterLink
      >
      <span
        @click="showSelector = !showSelector"
        :class="!Object.keys(_defaultTags).includes(this.cat) ? 'actived' : ''"
        >{{ Object.keys(_defaultTags).includes(this.cat) ? "分类" : this.cat }}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="fa"
          :class="showSelector ? 'fa-fold' : ''"
        >
          <path
            fill-rule="evenodd"
            d="M3.293 7.293a1 1 0 0 1 1.414 0L12 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414l-8 8a1 1 0 0 1-1.414 0l-8-8a1 1 0 0 1 0-1.414"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </div>
    <div :class="showSelector ? 'selector nowarp' : 'selector'">
      <div class="group" v-for="(key, value) in cats">
        <h2 class="ti">{{ key.cat }}</h2>
        <div class="cats-shell">
          <RouterLink
            v-for="cat in key.sub"
            :to="{ name: 'Discover', query: { cat: cat.name } }"
            :class="this.cat == cat.name ? 'actived' : ''"
            >{{ cat.name }}</RouterLink
          >
        </div>
      </div>
    </div>

    <div class="g-shell-6 main">
      <PlaylistCard
        v-for="playlist in displayData"
        :name="playlist.name"
        :cover="(playlist.coverImgUrl).replace('thumbnail=140y140','thumbnail=500y500')"
        :id="playlist.id"
        @playall="(id)=>{player.playPlaylist(null,null,{type:'playlist',id:id},true)}"
      ></PlaylistCard>
    </div>

    <div class="more" ref="loader"></div>
  </div>
</template>
<script lang="js">
import { RouterLink } from "vue-router";
import * as req_discover from "../api/discover"
import PlaylistCard from "@/components/PlaylistCard.vue";
import { imgUrlDecoder } from "@/utils/libs";
import { player } from "@/main";
    export default{
        components:{
            PlaylistCard
        },
        data(){
            return{
                _defaultTags:{
                    "all":"全部",
                    "highquality":'精选',
                    "recommend":"推荐",
                    "official":"官方",
                    "toplist":"榜单",
                },
                showSelector:false,
                cat:'',
                cats:null,
                page:1,
                hasMore:false,
                displayData:[],
                obWait:false,
                before:Date.now(),
                ob : new IntersectionObserver((entries)=>{
                    entries.forEach(enter=>{
                        if(enter.isIntersecting && this.hasMore){
                            this.obWait = true
                            this.page++
                            this.getPlaylistData().then(()=>{
                                this.obWait = false
                            })
                        }
                    })
                }),
                player
            }
        },
        methods:{
            async load(){
                this.cats = await req_discover.getPlaylistCatlist()
                this.getPlaylistData()
            },
            async getPlaylistData(){
                let data;
                if(this.cat == 'toplist'){
                    data = await req_discover.getToplist()
                    this.displayData = data.list
                    return;
                }
                if(this.cat == 'highquality'){
                    data = await req_discover.getHQPlaylist("",18,this.before)
                    this.before = data.lasttime
                }
                else{
                    let cat = this._defaultTags[this.cat] || this.cat
                    data = await req_discover.getTopPlaylist(cat,18,this.page)
                }
                if(data.more){this.hasMore = true}
                this.displayData.push(...data.playlists)
            },
            imgUrlDecoder
        },
        mounted(){
            this.load().then(()=>{
                this.ob.observe(this.$refs.loader)
            })
        },
        beforeUnmount(){
            this.ob.unobserve(this.$refs.loader)
        },
        created(){
            this.cat = this.$route.query.cat || 'highquality'
        }
    }
</script>
<style scoped>
.page {
  gap: 1.3rem;
}
.cats {
  width: 95%;
  display: inline-flex;
  margin-top: 2rem;
  gap: 1.1rem;
}
.cats span,
a {
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  align-items: center;
  font-weight: 600;
  font-size: 1.2rem;
  background-color: var(--app-theme-component);
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  transition: 0.1s;
  opacity: var(--text-opacity-3);
  color: var(--text-color);
  text-decoration: none;
  cursor: pointer;
}
.cats .fa {
  width: 1.1rem;
  margin-left: 0.3rem;
  transition: 0.2s;
}
.fa-fold {
  transform: rotate(180deg);
}
.cats span,
a:hover {
  background: var(--hover);
}
.cats span,
a:active {
  transform: scale(0.9);
}
.actived {
  opacity: 1 !important;
  color: #757cf6 !important;
}
.cats-shell {
  flex: 1;
  height: fit-content;
  display: inline-flex;
  white-space: auto;
  flex-wrap: wrap;
}
.cats-shell span {
  display: inline-block;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  opacity: var(--text-opacity-2);
}
.cats-shell span:hover {
  background: var(--hover);
}
.selector {
  width: 95%;
  height: 0;
  background: var(--app-theme-component);
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  transition: 0.2s;
  overflow: hidden;
  opacity: 0;
  justify-content: space-around;
}
.selector .group {
  width: 95%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
}
.selector .group .ti {
  opacity: var(--text-opacity-2);
}
.nowarp {
  height: 22rem;
  padding: 1rem 0;
  opacity: 1;
}
.main {
  width: 95%;
}
.more {
  height: 1px;
  width: 0;
  margin-bottom: 5rem;
}
</style>
