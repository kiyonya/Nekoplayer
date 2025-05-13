import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    { name: 'Recommend', path: '/recommend', component: () => import('../views/recommend/Recommend.vue') },
    {
      name: 'Playlist',
      path: '/playlist/:id',
      component: () => import('../views/Playlist/Playlist.vue'),
      props: true,
      meta:{
        top:0
      }
    },
    {
      name: 'Artist',
      path: '/artist/:id',
      component: () => import('../views/Artist.vue'),
      props: true
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
      props: true
    },
    {
      name: 'Cloud',
      path: '/cloud',
      component: () => import('../views/Cloud.vue')
    },
    {
      name: 'DailyRecommend',
      path: '/dailyrecommend',
      component: () => import('../views/DailyRecommend.vue')
    },
    {
      name: 'Search',
      path: '/search',
      component: () => import('../views/Search.vue'),
      props: true
    },
    {
      name: 'SearchDetial',
      path: ''
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
      meta:{
        top:0
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
      component: () => import('../views/Setting/Setting.vue')
    },

    {
      name: 'DesktopLyric',
      path: '/desktoplyric',
      component: () => import('../views/DesktopLyric.vue')
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
      name:"Dj",
      path:'/dj',
      component:()=>import('../views/Dj.vue')
    },
    {
      name:"ArtistWorks",
      path:'/artist/works',
      component:()=>import('../views/ArtistWorks.vue'),
      meta:{
        keepAlive:true,
        scroll:0
      }
    },
    {
      name:'Mine',
      path:'/mine',
      component:()=>import('../views/Miner.vue'),
    },
    {
      name:'User',
      path:'/user/:id',
      component:()=>import('../views/User.vue'),
      props:true
    },
    {
      name:"Comment",
      path:"/comment/:type",
      component:()=>import('../views/Comment.vue'),
    },
    {
      name:"BillboardVocaloid",
      path:"/plugin/billboardvocaloid",
      component:()=>import('../views/BillboardVocaloid.vue')
    }
  ],
})
export default router




