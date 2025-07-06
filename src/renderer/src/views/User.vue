<template>
    <div class='page'>
        <!-- <div class="background" :style="{backgroundImage:`url(${profile?.backgroundUrl})`}">
        </div> -->
        <div class="body">
            <div class="profile">
                <div class="avatar-shell">
                    <img :src="profile?.avatarUrl" alt="" class="blur">
                    <img :src="profile?.avatarUrl" alt="" class="main">
                </div>
                <div class="info">
                    <h2 class="name">{{ profile?.nickname }}</h2>
                    <div class="tags">
                        <span class="gender" v-if="profile?.gender >= 0"
                            :style="{ color: profile?.gender === 1 ? 'rgb(0, 153, 255)' : 'rgb(236, 37, 159)' }">
                            {{ profile?.gender === 1 ? "♂" : "♀" }}</span>

                        <span v-if="profile?.createTime > 0">已注册{{ getYearsPassed(profile?.createTime) }}年</span>
                        <span class="lv">Lv.{{ detial?.level }}</span>

                    </div>
                    <p class="sign ">{{ profile?.signature }}</p>
                </div>
            </div>
            
            <div class="home display">
                <div class="self-head-row" v-if="enableRecent">
                    <div class="red-heart">
                        <h2 class="subtitle">{{ genderPrefix }}喜欢的音乐</h2>
                        <PlaylistCard :cover="redHeart?.coverImgUrl" :name="redHeart?.name" :id="redHeart?.id">

                        </PlaylistCard>
                    </div>
                    <div class="recent">
                        <h2 class="subtitle">{{ genderPrefix }}最近常听</h2>
                        <div class="songs" v-if="weekDataRecord.length > 0">
                            <Song_Small v-for="recent in weekDataRecord.slice(0, (deviceScreenSize < 1 ? 9 : 12))"
                                :name="recent?.song?.name" :cover="recent?.song?.al?.picUrl" :artist="recent?.song?.ar"
                                :id="recent?.song?.id" 
                                @play="(id)=>{player.playInsertTracks(id,[{id:id,source:{type:'insert',id:id}}],{type:'insert',id:id})}">

                            </Song_Small>
                            
                        </div>
                        <span class="none" v-if="weekDataRecord.length <= 0">什么也没有</span>
                    </div>
                </div>
                <div class="playlist">
                    <h2 class="subtitle">{{ genderPrefix }}创建的歌单</h2>
                    <div class="g-shell-6">
                        <PlaylistCard v-for="playlist in createPlaylist?.slice(enableRecent ? 1 : 0)"
                            :name="playlist?.name" :cover="playlist?.coverImgUrl" :id="playlist?.id" :key="playlist?.id"></PlaylistCard>

                    </div>
                </div>
                <div class="playlist">
                    <h2 class="subtitle">{{ genderPrefix }}收藏的歌单</h2>
                    <div class="g-shell-6">
                        <PlaylistCard v-for="playlist in collectPlaylist" :name="playlist?.name"
                            :cover="playlist?.coverImgUrl" :id="playlist?.id"></PlaylistCard>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { getUserDetial, getUserMedal, getUserEvent, getUserRecentListen, getUserSocialStatus, getUserPlaylist } from '@/api/user';
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import Song_Small from '@/components/Song_Small.vue';
import PlaylistCard from '@/components/PlaylistCard.vue';
import { store } from '@/store';
import { playlistCreate } from './Library';
import { player } from '@/main';
const profile = ref({})
const detial = ref({})
const genderPrefix = ref('TA')
const redHeart = ref({})
const weekDataRecord = ref([])
const enableRecent = ref(false)
const createPlaylist = ref([])
const collectPlaylist = ref([])
const deviceScreenSize = computed(() => {
    return store.state.deviceScreenSize
})
onBeforeMount(() => {
    const id = useRoute().params.id
    getUserDetial(id).then(data => {
        detial.value = data
        profile.value = data?.profile
        if (profile.value.gender === 1) {
            genderPrefix.value = "他"
        }
        if (profile.value.gender === 0) {
            genderPrefix.value = "她"
        }
        if (data?.peopleCanSeeMyPlayRecord) {
            enableRecent.value = true
            getUserRecentListen(id).then(data => {
                const weekData = data?.weekData.slice(12)
                weekDataRecord.value = weekData
            })
        }
    })
    getUserPlaylist(id).then(data => {
        redHeart.value = data?.create[0]
        createPlaylist.value = data?.create
        collectPlaylist.value = data?.collect
    })
})
function getYearsPassed(timestamp) {
    const now = new Date();
    const pastDate = new Date(timestamp);
    let years = now.getFullYear() - pastDate.getFullYear();
    const monthDiff = now.getMonth() - pastDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < pastDate.getDate())) {
        years--;
    }
    return years;
}


</script>
<style scoped>
@media screen and (min-width:1301px) {
    .recent .songs {
        grid-template-columns: repeat(4, 1fr) !important;
        grid-template-rows: repeat(3, 1fr) !important;
    }
}

.background {
    position: absolute;
    left: 0;
    width: 100%;
    height: 40rem;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    top: 0;
    z-index: 0;
    color: rgb(236, 37, 159);
}

.body {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
}

.profile {
    width: 100%;
    height: fit-content;
    position: relative;
    box-sizing: border-box;
    padding: 1.8rem 3rem;
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: center;
}

.avatar-shell {
    width: 11rem;
    height: 11rem;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    img {
        width: 100%;
        position: absolute;
        object-fit: cover;
        aspect-ratio: 1/1;
        border-radius: 50%;
    }

    .blur {
        width: 97%;
        bottom: -0.5rem;
        filter: blur(20px) brightness(0.7);
        opacity: 0.2;
        transition: .3s all;
    }
}

.avatar-shell:hover {
    .blur {
        bottom: -1rem;
        opacity: 0.35;
        filter: brightness(1) blur(20px);
    }
}

.info {
    display: flex;
    flex-direction: column;

    .name {
        font-size: 2.5rem;
    }

    .tags {
        margin-top: 0.5rem;
        display: flex;
        flex-direction: row;
        gap: 1rem;

        span {
            font-size: 0.9rem;
            font-weight: bold;

        }

        .lv {
            width: fit-content;
            height: fit-content;
            padding: 0.1rem 0.3rem;
            background: var(--ui);
            border-radius: 0.2rem;
        }
    }

    .sign {
        margin-top: 1rem;
        max-width: 43rem;
    }
}

.display-selector {
    width: 92%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    color: var(--text-o-1);
    box-sizing: border-box;
    gap: 1rem;

    button {
        width: fit-content;
        height: fit-content;
        box-sizing: border-box;
        padding: 0.3rem 0.5rem;
        border: none;
        background: none;
        color: inherit;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: var(--br-2);
        transition: .3s;
    }

    button:hover {
        background: var(--ui);
    }
}

.subtitle {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--text-o-2);
}

.display {
    margin-top: 1rem;
    width: 92%;


}

.self-head-row {
    display: flex;
    flex-direction: row;
    justify-content: left;
    gap: 2rem;
    height: fit-content;

    .red-heart {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 12rem;
    }

    .recent {
        height: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
        position: relative;

        .songs {
            flex: 0.88;
            display: grid;
            gap: 1.4rem 1rem;
            grid-template-rows: repeat(3, 1fr);
            grid-template-columns: repeat(3, 1fr);
        }

        .none {
            color: var(--text-o-4);
            width: 100%;
            height: 50%;
            display: block;
 
            align-content: center;
            text-align: center;
        }
    }
}

.playlist {
    margin-top: 1.9rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>