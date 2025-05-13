<template>
    <div class="page">
        <div class="resource">

            <div class="r-song" v-if="resourceDetial.type === 0">
                <img :src="resourceDetial?.data?.al?.picUrl" alt="" class="cover">
                <div class="detial">
                    <h2 class="name">{{ resourceDetial?.data?.name }}</h2>
                    <ArtistNameGroup :array="resourceDetial?.data?.ar"></ArtistNameGroup>
                </div>
            </div>



        </div>
        <div class="comments">
            <CommentCard v-for="comment in comments" 
            :username="comment?.user?.nickname"
            :useravatar="comment?.user?.avatarUrl"
            :userid="comment?.user?.userId"
            :ip="comment?.ipLocation?.location"
            :commentid="comment?.commentId"
            :content="comment?.content"
            :highlight="comment?.highlight"
            :likes="comment?.likedCount"
            :liked="comment?.liked"
            :bereplied="comment?.beReplied"
            :time="comment?.time"
            :timestr="comment?.timeStr"

            @userclick="(userid) => $router.push({name:'User',params:{id:userid}})"
            >

            </CommentCard>
            <div class="loadmore" ref="loadmore"></div>
        </div>
        
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import {getComment} from '@/api/comment'
import { ref } from 'vue';
import CommentCard from '@/components/CommentCard.vue';
import { getSongDetial } from '@/api/song';
import ArtistNameGroup from '@/components/ArtistNameGroup.vue';
const typeMap = {
    "song":0
}
let type
let id
let page = 1
let sort = 1
let comments = ref([])
let cursor;
let loading = false
let hasMore = false
const loadmore = ref(null)
const resourceDetial = ref({})
onBeforeMount(()=>{
    const router = useRoute()
    type = typeMap[router.params.type]
    id = router.query.id
    loadComment()
    if(type === 0){
        getSongDetial(id).then(data=>{
            resourceDetial.value = {
                type,
                data:data.songs[0]
            }
        })
    }
})
async function loadComment(){
    const comment = await getComment(id,type,page++,20,sort,cursor)
    comments.value.push(...comment?.data.comments)
    hasMore = comment?.data.hasMore
    cursor = comment?.data?.cursor
    console.log(comment)
}
onMounted(()=>{
    const observer = new IntersectionObserver((entries)=>{
        if(entries[0].isIntersecting && !loading && hasMore){
            loading = true
            loadComment().then(()=>{
                loading = false
            })
        }
    },{
        rootMargin:'0px',
        threshold: 1.0
    })
    observer.observe(loadmore.value)
})


</script>
<style scoped>
.page{
    gap: 2rem;
    padding-top: 1rem;
}
.comments{
    width: 92%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 5rem;
}
.resource{
    width: 92%;
    height: fit-content;
    min-height: 5rem;


    .r-song{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;

        
        .cover{
            width: 5rem;
            height: 5rem;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-radius: var(--br-1);
        }

            .detial{
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
            }
        .name{
            font-size: 1.2rem;
            font-weight: 600;
        }
    }
}
</style>