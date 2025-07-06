<template>
  <aside class="side-bar">

    <div class="user" @click="() => {
      if (isLogin) {
        $router.push({ name: 'User', params: { id: profile?.userId } })
      }
    }">
      <img :src="resize(profile.avatarUrl, 60)" alt="" class="avatar" v-if="isLogin">
      <h2>{{ profile?.nickname }}</h2>
      <span v-if="!isLogin" @click.top="store.commit('showLoginWindow', true)">未登录</span>
    </div>

    <div class="routes">
      <RouterLink class="route" to="/recommend" active-class="active">
        <Icon icon="iconamoon:discover-bold" class="icon" /> <span>精选</span>
      </RouterLink>
      <RouterLink class="route" :to="{ name: 'PlaylistSquare' }" active-class="active">
        <Icon icon="tabler:playlist" class="icon" />
        <span>歌单</span>
      </RouterLink>
      <RouterLink class="route" to="/radio" active-class="active">
        <Icon icon="meteor-icons:radio" class="icon" />
        <span>电台</span>
      </RouterLink>
      <RouterLink class="route" to="/library" active-class="active" v-if="store.state.isLogin">
        <Icon icon="solar:library-line-duotone" class="icon" />
        <span>音乐库</span>
      </RouterLink>
      <RouterLink class="route" to="/localmusic" active-class="active">
        <Icon icon="icons8:hdd" class="icon" />
        <span>本地</span>
      </RouterLink>
      <RouterLink class="route" to="/setting" active-class="active">
        <Icon icon="mingcute:settings-3-line" class="icon tosetting" />
        <span>设置</span>
      </RouterLink>
      <button class="route" @click="openDev" title="如果你看到了这个，说明你正在使用开发版，这个版本可能包含很多意想不到的问题，很多功能仍在处于测试，请注意。（单击以打开开发者工具）" v-if="store.state.appInfo.dev">
        <Icon icon="mdi:dev-to" class="icon" />
        <b style="color:orange;background: none;">DEV{{ store.state.appInfo.version }}</b>
      </button>
    </div>

    <span class="tip">快速访问</span>
    <div class="quick-find">

      <RouterLink  tabindex="-1" class="playlist" v-for="playlist in userPlaylist"
        @click="$router.push({ name: 'Playlist', params: { id: playlist?.id } })" :key="playlist?.id"
        active-class="onfocus" :to="{ name: 'Playlist', params: { id: playlist?.id } }"  >
        <img :src="playlist.coverImgUrl" alt="" tabindex="-1">
        <span class="name" tabindex="-1">{{ playlist?.name }}</span>
        <ContextMenu :menu="[
          { label: '打开', act: 'open', icon: 'majesticons:open' },
          { label: '播放', act: 'playall', icon: 'ion:play' },
          'hr',
          { label: '复制链接', act: 'copylink', icon: 'tabler:link' },
        ]" @select="(i) => conetextMenuHandler(playlist?.id, i)" />
      </RouterLink>
    </div>






  </aside>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { store } from '@/store';
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { resize } from '@/utils/imageProcess';
import { watch } from 'vue';
import { getUserPlaylist } from '@/api/user';
import ContextMenu from './ContextMenu/ContextMenu.vue';
import router from '@/router';
import { player } from '@/main';
import { showMessageNotification } from './notification/use_notification';
const profile = computed(() => {
  return store.state.profile
})
const loginStatus = computed(() => {
  return store.state.loginStatus
})
const userPlaylist = ref([])
const isLogin = computed({
  get: () => store.state.isLogin,
})
watch(isLogin, () => {
  if (profile.value?.userId && isLogin.value) {
    getUserPlaylist(profile.value.userId).then(data => {
      userPlaylist.value = data?.create
    })
  } else {
    userPlaylist.value = []
  }
}, { immediate: true })

function openDev() {
  window.electron.ipcRenderer.send("dev:openDevTool")
}
function conetextMenuHandler(id, item) {
  let act = item?.act
  let func = {
    open: () => {
      router.push({ name: "Playlist", params: { id: id } })
    },
    playall: () => {
      player.playPlaylist(null, null, { type: 'playlist', id }, true)
    },
    copylink: () => {
      const url = `https://music.163.com/#/playlist?id=${id}`
      window.navigator.clipboard.writeText(url)
      showMessageNotification("已复制")
    },
  }
  if (func[act]) {
    func[act]()
  }
}
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
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-o-4);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  box-sizing: border-box;
  gap: 0.4rem;
  border-radius: var(--br-1);
  border: none;
  background-color: transparent;

  .icon {
    width: 1.2rem;
    height: 1.2rem;

  }
}

.route:hover {
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

.active {
  color: var(--strong);
  font-weight: 600 !important;
}

.setting {
  width: 85%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: fit-content;
  margin: 0.5rem auto 5rem auto;
  gap: 1.2rem;
  padding: 0.5rem 0.5rem;

  .icon {
    color: var(--text-o-4);
    width: 1.5rem;
    height: 1.5rem;
  }

  .icon:hover {
    color: var(--strong);
  }
}

.tosetting {
  transform: rotate(0deg);
  transition: .3s cubic-bezier(0.23, 1, 0.320, 1);
}

.tosetting:hover {
  transform: rotate(180deg);
}

.active {
  background: var(--strong) !important;
  color: #fff;
  pointer-events: none;
}

.quick-find {
  width: 85%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  margin-bottom: 1.5rem;

  .playlist {
    scroll-snap-align: start;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.3rem 0.5rem;
    border-radius: var(--br-1);
    align-items: center;

    img {
      width: 2.3rem;
      height: 2.3rem;
      border-radius: var(--br-1)
    }

    .name {
      font-size: 0.8rem;
      color: var(--text-o-3);
    }
  }

  .playlist:hover {
    background: var(--hover);
  }

  .playlist:last-child {
    margin-bottom: 4rem;
  }
}

.quick-find::-webkit-scrollbar {
  width: 2px;
  display: none;
}

.quick-find:hover::-webkit-scrollbar {
  display: block;
}

.tip {
  width: 80%;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  border-bottom: var(--border) 1px solid;
  color: var(--text-o-4);
}

.user {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  width: 80%;
  margin-top: 2rem;

  .avatar {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
  }

  h2 {
    font-size: 1.1rem;
  }
}

.onfocus {
  background: var(--strong);
  pointer-events: none;
  color: white;
  text-decoration: none;
}
</style>
