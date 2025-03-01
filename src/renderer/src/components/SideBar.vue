<template>
  <aside class="side-bar">

    <div class="user">
      <img :src="resize(profile.avatarUrl,60)" alt="" class="avatar">
      <h2>{{ profile?.nickname }}</h2>
      <span v-if="!isLogin" @click="store.commit('showLoginWindow',true)">未登录</span>
    </div>

    <div class="routes">
      <RouterLink class="route" to="/recommend" active-class="active"
        ><Icon icon="fluent:collections-16-filled" class="icon" /> <span>精选</span>
      </RouterLink>
      <RouterLink class="route" :to="{ name: 'Discover', query: { cat: 'all', t: Date.now() } }" active-class="active">
        <Icon icon="iconamoon:discover-bold" class="icon" />
        <span>发现</span>
      </RouterLink>
      <RouterLink class="route" to="/listentogether" active-class="active">
        <Icon icon="stash:podcast" class="icon" />
        <span>一起听</span>
      </RouterLink>
      <RouterLink class="route" to="/library" active-class="active" v-if="store.state.isLogin"> 
        <Icon icon="solar:library-bold-duotone" class="icon" />
        <span>音乐库</span>
      </RouterLink>
      <RouterLink class="route" to="/localmusic" active-class="active">
        <Icon icon="material-symbols:music-cast" class="icon" />
        <span>本地</span>
      </RouterLink>
      <RouterLink class="route" to="/setting" active-class="active">
        <Icon icon="mingcute:settings-3-line" class="icon tosetting" />
        <span>设置</span>
      </RouterLink>
    </div>

    <span class="tip">快速访问</span>
    <div class="quick-find">
      
      <RouterLink  class="playlist" v-for="playlist in userPlaylist" @click="$router.push({name:'Playlist',params:{id:playlist?.id}})" :key="playlist?.id" active-class="onfocus" :to="{name:'Playlist',params:{id:playlist?.id}}">
        <img :src="playlist.coverImgUrl" alt="">
        <span class="name">{{ playlist?.name }}</span>
      </RouterLink>
    </div>






  </aside>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { store } from '@/store';
import { computed ,ref} from 'vue';
import {useRouter } from 'vue-router';
import { resize } from '@/utils/imageProcess';
import { watch } from 'vue';
import { getUserPlaylist } from '@/api/user';
const profile = computed(()=>{
  return store.state.profile
})
const loginStatus = computed(()=>{
  return store.state.loginStatus
})
const userPlaylist = ref([])
const isLogin = computed({
  get:()=>store.state.isLogin,
})
watch(isLogin,()=>{
  if(profile.value?.userId && isLogin.value){
    getUserPlaylist(profile.value.userId).then(data=>{
      userPlaylist.value = data?.create
    })
  }else{
    userPlaylist.value = []
  }
},{immediate:true})
</script>
<style scoped>
.side-bar {
  width: var(--side-bar-width);
  height: 100vh;
  box-shadow: var(--shadow);
  position: fixed;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--component-diff);
}
.routes {
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  gap: 0.4rem;
}
.route {
  width: calc(100% - 1rem);
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-o-4);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.5rem;
  gap: 0.4rem;
  border-radius: var(--br-1);
  .icon {
  width: 1.2rem;
  height: 1.2rem;
  }
}
.route:hover{
  background: var(--hover);
}
.icon {
  width: 2rem;
  height: 2rem;
}
.route span {
  font-size: 0.9rem;
}
.route:hover {
  color: var(--strong);
}
.active{
    color: var(--strong);
    font-weight: 600 !important;
}
.setting{
    width: 85%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: fit-content;
    margin: 0.5rem auto 5rem auto;
    gap: 1.2rem;
    padding: 0.5rem 0.5rem;
    .icon{
      color: var(--text-o-4);
      width: 1.5rem;
      height: 1.5rem;
    }
    .icon:hover{
    color: var(--strong);
    }
}
.tosetting{
  transform: rotate(0deg);
  transition: .3s cubic-bezier(0.23, 1, 0.320, 1);
}
.tosetting:hover{
  transform: rotate(180deg);
}
.active{
  background: var(--strong) !important;
  color: #fff;
  pointer-events: none;
}

.quick-find{
  width: 85%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  .playlist{
    scroll-snap-align: start;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.3rem 0.5rem;
    border-radius: var(--br-1);
    align-items: center;
    img{
      width: 2.3rem;
      height: 2.3rem;
      border-radius: var(--br-1)
    }
    .name{
      font-size: 0.8rem;
      color: var(--text-o-3);
    }
  }
  .playlist:hover{
    background: var(--hover);
  }
  .playlist:last-child{
    margin-bottom: 4rem;
  }
}
.quick-find::-webkit-scrollbar{
  width: 2px;
  display: none;
}
.quick-find:hover::-webkit-scrollbar{
  display: block;
}
.tip{
  width: 80%;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem 0 ;
  margin-bottom: 0.5rem;
  border-bottom: var(--border) 1px solid;
  color: var(--text-o-4);
}
.user{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  width: 80%;
  margin-top: 2rem;
  .avatar{
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
  }
  h2{
    font-size: 1.1rem;
  }
}

.onfocus{
  background: var(--strong);
  pointer-events: none;
  color: white;
  text-decoration: none;
}
</style>
