import { nextTick } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Recommend',
      path: '/recommend/',
      component: () => import('../views/Recommend.vue'),
      meta: {
        savePosition: true
      }
    },
    {
      name: 'Playlist',
      path: '/playlist/:id',
      component: () => import('../views/playlist/Playlist.vue'),
      props: true,
      meta: {
        savePosition: true
      }
    },
    {
      name: 'PlaylistSquare',
      path: '/playlistsquare',
      component: () => import('../views/PlaylistSquare.vue'),
      props: true,
      meta: {
        savePosition: true
      }
    },
    {
      name: 'PlaylistCategory',
      path: '/playlistcategory/:cat',
      component: () => import('../views/PlaylistCategory.vue'),
      props: true,
      meta: {
        savePosition: true
      }
    },
    {
      name: 'Artist',
      path: '/artist/:id',
      component: () => import('../views/Artist.vue'),
      props: true,
      meta: {
        savePosition: true
      }
    },
    {
      name: 'MV',
      path: '/mv/:id',
      component: () => import('../views/MV.vue'),
      props: true
    },
    {
      name: 'Album',
      path: '/album/:id',
      component: () => import('../views/Album.vue'),
      props: true,
      meta: {
        savePosition: true
      }
    },
    {
      name: 'Cloud',
      path: '/cloud',
      component: () => import('../views/Cloud.vue')
    },
    {
      name: 'DailyRecommend',
      path: '/dailyrecommend',
      component: () => import('../views/DailyRecommend.vue'),
      meta: {
        savePosition: true
      }
    },
    {
      name: 'Search',
      path: '/search/:key',
      component: () => import('../views/Search.vue'),
      props: true,
      meta: {
        savePosition: true
      }
    },
    {
      name: 'SearchDetail',
      path: '/searchdetail/:type/:key',
      component: () => import('../views/SearchDetail.vue'),
      meta: {
        savePosition: true
      }
    },
    {
      name: 'Discover',
      path: '/discover',
      component: () => import('../views/Discover.vue'),
      props: true
    },
    {
      name: 'Library',
      path: '/library',
      component: () => import('../views/Library/Library.vue'),
      meta: {
        savePosition: true
      }
    },
    {
      name: 'Contributors',
      path: '/contributors',
      component: () => import('../views/Contributors.vue')
    },
    {
      name: 'Setting',
      path: '/setting',
      component: () => import('../views/Setting.vue')
    },
    {
      name: 'LocalMusic',
      path: '/localmusic',
      component: () => import('../views/LocalMusic.vue'),
      props: true
    },
    {
      name: 'LocalMusicGroup',
      path: '/localmusic/group/:id',
      component: () => import('../views/LocalMusicGroup.vue'),
      props: true
    },
    {
      name: 'Radio',
      path: '/radio',
      component: () => import('../views/Radio.vue'),
      meta: {
        savePosition: true,
      }
    },
    {
      name: 'ArtistWorks',
      path: '/artist/works',
      component: () => import('../views/ArtistWorks.vue'),
      meta: {
        savePosition: true,

      }
    },
    {
      name: 'Mine',
      path: '/mine',
      component: () => import('../views/Miner.vue')
    },
    {
      name: 'Transfer',
      path: '/transfer',
      component: () => import('../views/Transfer.vue')
    },
    {
      name: 'User',
      path: '/user/:id',
      component: () => import('../views/User.vue'),
      props: true,
      meta: {
        savePosition: true
      }
    },
    {
      name: 'Comment',
      path: '/comment/:type',
      component: () => import('../views/Comment.vue')
    },
    {
      name: 'BillboardVocaloid',
      path: '/plugin/billboardvocaloid',
      component: () => import('../views/BillboardVocaloid.vue')
    },
    {
      name: 'Program',
      path: '/program/:id',
      component: () => import('../views/Program.vue'),
      meta: {
        savePosition: true
      }
    },
    {
      name: 'AudioRecognition',
      path: '/audio/recognition',
      component: () => import('../views/AudioRecognition.vue')
    }
  ]
})
const scrollPositions = new Map();
const MAX_STORED_POSITIONS = 20;
const positionKeys = []; 
router.beforeEach((to, from, next) => {
  const appView = document.getElementById('__appview__');
  if (from.fullPath && appView && from.meta?.savePosition) {
    if (scrollPositions.has(from.fullPath)) {
      positionKeys.splice(positionKeys.indexOf(from.fullPath), 1);
    }
    positionKeys.push(from.fullPath);
    scrollPositions.set(from.fullPath, appView.scrollTop);
    if (positionKeys.length > MAX_STORED_POSITIONS) {
      const oldestKey = positionKeys.shift();
      scrollPositions.delete(oldestKey);
    }
  }
  next();
});

router.afterEach(async (to) => {
  await nextTick();
  nextTick(() => {
    const appView = document.getElementById('__appview__');
    if (appView && scrollPositions.has(to.fullPath) && to.meta.savePosition) {
      appView.scroll({ top: scrollPositions.get(to.fullPath) });
    }
  });
});
export default router
